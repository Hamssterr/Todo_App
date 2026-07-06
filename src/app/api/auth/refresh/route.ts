import { getDataSource } from "@/database/data-source";
import { User } from "@/entities/User";
import { UserSession } from "@/entities/UserSession";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt";
import { comparePassword, hashPassword } from "@/lib/password";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy refresh token trong cookie",
        },
        { status: 401 },
      );
    }

    // 1. Kiểm tra JWT token có hợp lệ / hết hạn không
    const payload = await verifyRefreshToken(refreshToken).catch(() => null);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token đã hết hạn hoặc không hợp lệ",
        },
        { status: 401 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const sessionRepository = dataSource.getRepository(UserSession);

    // 2. Kiểm tra User còn tồn tại không
    const user = await userRepository.findOne({ where: { id: payload.id } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 401 },
      );
    }

    // 3. Tìm các session đang active của user này
    const activeSessions = await sessionRepository.find({
      where: { userId: user.id },
    });

    // 4. So sánh mã hash để tìm xem token này thuộc session nào
    let currentSession: UserSession | null = null;
    for (const session of activeSessions) {
      if (session.revokedAt) continue;
      if (new Date() > session.expiresAt) continue;

      const isMatch = await comparePassword(
        refreshToken,
        session.refreshTokenHash,
      );
      if (isMatch) {
        currentSession = session;
        break;
      }
    }

    if (!currentSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Phiên đăng nhập không hợp lệ hoặc đã bị thu hồi",
        },
        { status: 401 },
      );
    }

    // 5. Cấp phát cặp token mới (Rotate refresh token)
    const newPayload = {
      id: user.id,
      email: user.email,
      role: user.role, // Cập nhật lại role mới nhất từ DB
    };

    const newAccessToken = await signAccessToken(newPayload);
    const newRefreshToken = await signRefreshToken(newPayload);
    const newRefreshTokenHash = await hashPassword(newRefreshToken);

    // 6. Cập nhật hash mới vào DB để vô hiệu hóa token cũ
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    currentSession.refreshTokenHash = newRefreshTokenHash;
    currentSession.expiresAt = expiresAt;
    await sessionRepository.save(currentSession);

    const res = NextResponse.json({
      success: true,
      message: "Refresh token thành công",
      data: {
        accessToken: newAccessToken,
      },
    });

    res.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    res.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Lỗi khi refresh token:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi Server" },
      { status: 500 },
    );
  }
}

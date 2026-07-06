import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDataSource } from "@/database/data-source";
import { UserSession } from "@/entities/UserSession";
import { comparePassword } from "@/lib/password";
import { IsNull } from "typeorm";
import { decodeJwt } from "jose";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      const dataSource = await getDataSource();
      const sessionRepository = dataSource.getRepository(UserSession);

      // Tối ưu: Lấy userId từ token để không phải quét toàn bộ bảng UserSession
      let userId: string | undefined;
      try {
        const payload = decodeJwt(refreshToken);
        userId = payload.id as string;
      } catch (e) {
        // Token không hợp lệ
      }

      if (userId) {
        const sessions = await sessionRepository.find({
          where: {
            userId: userId,
            revokedAt: IsNull(),
          },
        });

        for (const session of sessions) {
          const isMatch = await comparePassword(
            refreshToken,
            session.refreshTokenHash,
          );

          if (isMatch) {
            session.revokedAt = new Date();
            await sessionRepository.save(session);
            break;
          }
        }
      }
    }

    const res = NextResponse.json({
      success: true,
      message: "Logout successfully",
    });

    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");

    return res;
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

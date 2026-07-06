import { getDataSource } from "@/database/data-source";
import { User } from "@/entities/User";
import { UserSession } from "@/entities/UserSession";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { comparePassword, hashPassword } from "@/lib/password";
import { loginSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu không hợp lệ",
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const sessionRepository = dataSource.getRepository(UserSession);

    const user = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email hoặc password không hợp lệ" },
        { status: 401 },
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Email hoặc password không hợp lệ" },
        { status: 401 },
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    const refreshTokenHash = await hashPassword(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      expiresAt,
      revokedAt: null,
    });

    await sessionRepository.save(session);

    const res = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
      },
    });
    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

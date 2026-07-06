import { getDataSource } from "@/database/data-source";
import { User, UserRole } from "@/entities/User";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu không hợp lệ",
        },
        {
          status: 400,
        },
      );
    }

    const { name, email, password, role } = parsed.data;

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email đã tồn tại",
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const user = userRepository.create({
      name,
      email,
      password: passwordHash,
      role: (role as UserRole) ?? UserRole.EMPLOYEE,
    });

    await userRepository.save(user);

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký tài khoản thành công",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Lỗi khi register:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi Server",
      },
      { status: 500 },
    );
  }
}

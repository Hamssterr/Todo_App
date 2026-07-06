import { getDataSource } from "@/database/data-source";
import { User, UserRole } from "@/entities/User";
import { getCurrentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { requireRole } from "@/lib/permissions";
import { getPagination, getPaginationMeta } from "@/schemas/query.schema";
import { createEmployeeSchema, userQuerySchema } from "@/schemas/user.schema";
import { NextResponse } from "next/server";
import { ILike, Not } from "typeorm";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const permissionError = requireRole(currentUser, [UserRole.MANAGER]);

    if (permissionError) return permissionError;

    const { searchParams } = new URL(req.url);

    const parsed = userQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      role: searchParams.get("role") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu không hợp lệ",
        },
        { status: 400 },
      );
    }
    const { search, role, page, limit } = parsed.data;
    const { skip, take } = getPagination(page, limit);

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const where: any = {
      id: Not(currentUser!.id),
    };

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await userRepository.findAndCount({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: "DESC",
      },
      skip,
      take,
    });

    return NextResponse.json({
      success: true,
      data: users,
      meta: getPaginationMeta(total, page, limit),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const permissionError = requireRole(currentUser, [UserRole.MANAGER]);

    if (permissionError) return permissionError;

    const body = await req.json();

    const parsed = createEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const existedUser = await userRepository.findOne({
      where: { email },
    });

    if (existedUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const employee = userRepository.create({
      name,
      email,
      password: passwordHash,
      role: UserRole.EMPLOYEE,
    });

    await userRepository.save(employee);

    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully",
        data: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

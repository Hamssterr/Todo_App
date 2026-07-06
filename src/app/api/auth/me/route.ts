import { getDataSource } from "@/database/data-source";
import { User } from "@/entities/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const dataSource = await getDataSource();
  const userRepository = await dataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: currentUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Không tìm thấy người dùng" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: user,
  });
}

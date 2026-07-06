import { getDataSource } from "@/database/data-source";
import { User, UserRole } from "@/entities/User";
import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    const permissionError = requireRole(currentUser, [UserRole.MANAGER]);
    if (permissionError) return permissionError;

    const { id } = await params;

    if (currentUser!.id === id) {
      return NextResponse.json(
        { success: false, message: "Không thể tự xóa bản thân" },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy nhân viên" },
        { status: 404 },
      );
    }

    await userRepository.delete(id);

    return NextResponse.json({
      success: true,
      message: "Xóa thành công",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Không thể xóa người dùng vì người dùng có các tác vụ liên quan.",
      },
      { status: 400 },
    );
  }
}

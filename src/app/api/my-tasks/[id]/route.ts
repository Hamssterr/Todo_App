import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getDataSource } from "@/database/data-source";

import { Task } from "@/entities/Task";
import { UserRole } from "@/entities/User";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    const permissionError = requireRole(currentUser, [UserRole.EMPLOYEE]);

    if (permissionError) {
      return permissionError;
    }

    const { id } = await params;

    const dataSource = await getDataSource();

    const taskRepository = dataSource.getRepository(Task);

    const task = await taskRepository.findOne({
      where: {
        id,
        assignedToId: currentUser!.id,
      },
      relations: {
        createdBy: true,
      },
      select: {
        createdBy: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

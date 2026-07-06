import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getDataSource } from "@/database/data-source";

import { Task } from "@/entities/Task";
import { TaskStatus } from "@/types/task.type";

import { UserRole } from "@/entities/User";

import { updateMyTaskStatusSchema } from "@/schemas/task.schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    const permissionError = requireRole(currentUser, [UserRole.EMPLOYEE]);

    if (permissionError) {
      return permissionError;
    }

    const { id } = await params;

    const body = await req.json();

    const parsed = updateMyTaskStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const dataSource = await getDataSource();

    const taskRepository = dataSource.getRepository(Task);

    const task = await taskRepository.findOne({
      where: {
        id,
        assignedToId: currentUser!.id,
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

    task.status = parsed.data.status;

    await taskRepository.save(task);

    return NextResponse.json({
      success: true,
      message: "Task status updated successfully",
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

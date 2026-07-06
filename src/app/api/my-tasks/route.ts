import { getDataSource } from "@/database/data-source";
import { Task } from "@/entities/Task";
import { UserRole } from "@/entities/User";
import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getPagination, getPaginationMeta } from "@/schemas/query.schema";
import { taskQuerySchema } from "@/schemas/task.schema";
import { NextResponse } from "next/server";
import { ILike } from "typeorm";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const permissionError = requireRole(currentUser, [UserRole.EMPLOYEE]);

    if (permissionError) {
      return permissionError;
    }

    const { searchParams } = new URL(req.url);

    const parsed = taskQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Lỗi Validation",
        },
        { status: 400 },
      );
    }

    const { search, status, priority, page, limit } = parsed.data;

    const where: any = {
      assignedToId: currentUser!.id,
    };

    if (search) {
      where.title = ILike(`%${search}%`);
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const { skip, take } = getPagination(page, limit);

    const dataSource = await getDataSource();
    const taskRepository = dataSource.getRepository(Task);

    const [tasks, total] = await taskRepository.findAndCount({
      where,
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
      order: {
        createdAt: "DESC",
      },
      skip,
      take,
    });

    return NextResponse.json({
      success: true,
      data: tasks,
      meta: getPaginationMeta(total, page, limit),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

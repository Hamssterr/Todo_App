import { getDataSource } from "@/database/data-source";
import { Task } from "@/entities/Task";
import { TaskPriority, TaskStatus } from "@/types/task.type";
import { User, UserRole } from "@/entities/User";
import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { getPagination, getPaginationMeta } from "@/schemas/query.schema";
import { createTaskSchema, taskQuerySchema } from "@/schemas/task.schema";
import { NextResponse } from "next/server";
import { ILike } from "typeorm";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const permissionError = requireRole(currentUser, [UserRole.MANAGER]);
    if (permissionError) {
      return permissionError;
    }

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
        },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const taskRepository = dataSource.getRepository(Task);

    const assignedUser = await userRepository.findOne({
      where: { id: parsed.data.assignedToId, role: UserRole.EMPLOYEE },
    });
    if (!assignedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy nhân viên",
        },
        { status: 404 },
      );
    }

    const task = taskRepository.create({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      priority: parsed.data.priority ?? TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      assignedToId: assignedUser.id,
      createdById: currentUser!.id,
    });

    await taskRepository.save(task);
    return NextResponse.json(
      {
        success: true,
        message: "Tạo task thành công",
        data: task,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi Server",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const permissionError = requireRole(currentUser, [UserRole.MANAGER]);
    if (permissionError) {
      return permissionError;
    }

    const { searchParams } = new URL(req.url);

    const parsed = taskQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
      assignedToId: searchParams.get("assignedToId") ?? undefined,
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

    const { search, status, priority, assignedToId, page, limit } = parsed.data;

    const dataSource = await getDataSource();
    const taskRepository = dataSource.getRepository(Task);

    // --- BẮT ĐẦU PHẦN LOGIC SEARCH NHÂN VIÊN TỐI ƯU ---
    const baseFilters: any = {};
    if (status) baseFilters.status = status;
    if (priority) baseFilters.priority = priority;
    if (assignedToId) baseFilters.assignedToId = assignedToId;

    let where: any | any[];

    if (search) {
      const searchLike = ILike(`%${search}%`);
      where = [
        { ...baseFilters, title: searchLike },
        { ...baseFilters, assignedTo: { name: searchLike } },
      ];
    } else {
      where = baseFilters;
    }
    // --- KẾT THÚC PHẦN LOGIC SEARCH ---

    const { skip, take } = getPagination(page, limit);
    const [tasks, total] = await taskRepository.findAndCount({
      where,
      relations: {
        assignedTo: true,
        createdBy: true,
      },
      select: {
        assignedTo: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
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

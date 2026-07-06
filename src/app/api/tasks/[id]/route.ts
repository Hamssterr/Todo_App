import { getDataSource } from "@/database/data-source";
import { Task } from "@/entities/Task";
import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { UserRole } from "@/entities/User";
import { updateTaskSchema } from "@/schemas/task.schema";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const dataSource = await getDataSource();
    const taskRepository = dataSource.getRepository(Task);

    const task = await taskRepository.findOne({
      where: { id },
      relations: {
        assignedTo: true,
        createdBy: true,
      },
      select: {
        assignedTo: { id: true, name: true, email: true },
        createdBy: { id: true, name: true, email: true },
      },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    // Only managers or the assigned employee can view the task
    if (
      currentUser.role !== UserRole.MANAGER &&
      task.assignedToId !== currentUser.id
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    const permissionError = requireRole(currentUser, [UserRole.MANAGER]);
    if (permissionError) return permissionError;

    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);

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

    const dataSource = await getDataSource();
    const taskRepository = dataSource.getRepository(Task);

    const task = await taskRepository.findOne({ where: { id } });
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    // Update task
    Object.assign(task, parsed.data);
    await taskRepository.save(task);

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    const permissionError = requireRole(currentUser, [UserRole.MANAGER]);
    if (permissionError) return permissionError;

    const dataSource = await getDataSource();
    const taskRepository = dataSource.getRepository(Task);

    const task = await taskRepository.findOne({ where: { id } });
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    await taskRepository.remove(task);

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

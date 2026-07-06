import { z } from "zod";
import { TaskPriority, TaskStatus } from "@/types/task.type";
import { paginationSchema } from "./query.schema";

export const createTaskSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().optional().nullable(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assignedToId: z.string().uuid(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  description: z.string().optional().nullable(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assignedToId: z.string().uuid().optional(),
});

export const updateMyTaskStatusSchema = z.object({
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]),
});

export const taskQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assignedToId: z.string().uuid().optional(),
});

import { z } from "zod";
import { paginationSchema } from "./query.schema";

export const userQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  role: z.enum(["MANAGER", "EMPLOYEE"]).optional(),
});

export const createEmployeeSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
});

import { LoginResponse } from "@/types/auth.type";
import { loginSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import http from "@/services/http";

export type LoginFormValues = z.infer<typeof loginSchema>;

export const authApi = {
  login: async (data: LoginFormValues) => {
    const response = await http.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
};

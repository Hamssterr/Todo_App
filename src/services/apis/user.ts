import { PaginatedResponse } from "@/types/common.type";
import { User, UserQueryParams } from "@/types/user.type";
import http from "@/services/http";

export const userApi = {
  getUsers: async (params?: UserQueryParams) => {
    const res = await http.get<PaginatedResponse<User[]>>("/users", {
      params,
    });
    return res.data;
  },
  createUser: async (data: any) => {
    const res = await http.post<{ success: boolean; data: User }>("/users", data);
    return res.data.data;
  },
  deleteUser: async (id: string) => {
    const res = await http.delete<{ success: boolean; message: string }>(`/users/${id}`);
    return res.data;
  },
};

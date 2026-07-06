import http from "@/services/http";
import { PaginatedResponse } from "@/types/common.type";
import { Task, TaskQueryParams } from "@/types/task.type";

export const taskApi = {
  getTasks: async (params?: TaskQueryParams) => {
    const response = await http.get<PaginatedResponse<Task[]>>("/tasks", {
      params,
    });
    return response.data;
  },
  getTaskById: async (id: string) => {
    const response = await http.get<{ success: boolean; data: Task }>(
      `/tasks/${id}`,
    );
    return response.data.data;
  },
  createTask: async (data: any) => {
    const response = await http.post<{ success: boolean; data: Task }>(
      "/tasks",
      data,
    );
    return response.data;
  },
  updateTask: async (id: string, data: any) => {
    const response = await http.put<{ success: boolean; data: Task }>(
      `/tasks/${id}`,
      data,
    );
    return response.data;
  },
  deleteTask: async (id: string) => {
    const response = await http.delete<{ success: boolean }>(`/tasks/${id}`);
    return response.data;
  },
  getMyTasks: async (params?: TaskQueryParams) => {
    const response = await http.get<PaginatedResponse<Task[]>>("/my-tasks", {
      params,
    });
    return response.data;
  },
  getMyTaskById: async (id: string) => {
    const response = await http.get<{ success: boolean; data: Task }>(
      `/my-tasks/${id}`,
    );
    return response.data.data;
  },
  updateMyTaskStatus: async (id: string, status: string) => {
    const response = await http.patch<{ success: boolean; data: Task }>(
      `/my-tasks/${id}/status`,
      { status },
    );
    return response.data;
  },
};

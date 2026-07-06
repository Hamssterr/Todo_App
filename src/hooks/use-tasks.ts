import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/services/apis/task";
import { TaskQueryParams, Task } from "@/types/task.type";

export function useTasks(params?: TaskQueryParams) {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => taskApi.getTasks(params),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => taskApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      if (!id) throw new Error("Task ID is required for update");
      return taskApi.updateTask(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["task", id] });
      }
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useMyTasks(params?: TaskQueryParams) {
  return useQuery({
    queryKey: ["my-tasks", params],
    queryFn: () => taskApi.getMyTasks(params),
  });
}

export function useMyTask(id: string) {
  return useQuery({
    queryKey: ["my-task", id],
    queryFn: () => taskApi.getMyTaskById(id),
    enabled: !!id,
  });
}

export function useUpdateMyTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      taskApi.updateMyTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
  });
}

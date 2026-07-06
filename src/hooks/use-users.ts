import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/services/apis/user";
import { UserQueryParams } from "@/types/user.type";

export function useUsers(params: UserQueryParams = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
  });
}

export function useInfiniteUsers(params: Omit<UserQueryParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: ["users-infinite", params],
    queryFn: ({ pageParam = 1 }) => userApi.getUsers({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => userApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-infinite"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-infinite"] });
    },
  });
}

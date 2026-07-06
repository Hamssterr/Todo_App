import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { authApi, LoginFormValues } from "@/services/apis/auth";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: (data) => {
      if (data.success) {
        setAuth(
          {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
          },
          data.data.accessToken,
        );

        if (data.data.role === "MANAGER") {
          router.push("/manager");
        } else {
          router.push("/employee");
        }
      }
    },
  });
}

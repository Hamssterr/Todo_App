export type UserRole = "MANAGER" | "EMPLOYEE";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: AuthUser & { accessToken: string };
};

export type RefreshResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
};

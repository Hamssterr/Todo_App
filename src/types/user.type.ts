import { AuthUser } from "./auth.type";

export type User = AuthUser & {
  createdAt: string;
  updatedAt: string;
};

export type UserQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
};

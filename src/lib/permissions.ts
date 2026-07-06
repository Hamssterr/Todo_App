import { NextResponse } from "next/server";
import { JwtPayload } from "@/lib/jwt";

export function requireAuth(user: JwtPayload | null) {
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  return null;
}

export function requireRole(user: JwtPayload | null, roles: string[]) {
  const authError = requireAuth(user);

  if (authError) {
    return authError;
  }

  if (!roles.includes(user!.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 },
    );
  }

  return null;
}

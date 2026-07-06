import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";

const protectedRoutes = [
  {
    path: "/manager",
    roles: ["MANAGER"],
  },
  {
    path: "/employee",
    roles: ["EMPLOYEE"],
  },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lấy token
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  let role: string | null = null;

  // Nếu người dùng truy cập /login mà đã có token hợp lệ -> Không cho quay lại login
  if (pathname.startsWith("/login")) {
    if (accessToken) {
      try {
        const payload = await verifyAccessToken(accessToken);
        role = payload.role;
      } catch {}
    }

    if (!role && refreshToken) {
      try {
        const payload = await verifyRefreshToken(refreshToken);
        role = payload.role;
      } catch {}
    }

    // Nếu đã đăng nhập, đẩy về dashboard
    if (role === "MANAGER") {
      return NextResponse.redirect(new URL("/manager", req.url));
    } else if (role === "EMPLOYEE") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }

    return NextResponse.next();
  }

  // Logic cho các protected routes (/manager, /employee)
  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path),
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kiểm tra access_token trước
  if (accessToken) {
    try {
      const payload = await verifyAccessToken(accessToken);
      if (!matchedRoute.roles.includes(payload.role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    } catch {}
  }

  // Nếu access_token hỏng, thử refresh_token (để UI có cơ hội gọi interceptor thay vì bị văng ngay lập tức)
  if (refreshToken) {
    try {
      const payload = await verifyRefreshToken(refreshToken);
      if (!matchedRoute.roles.includes(payload.role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    } catch {}
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/manager/:path*", "/employee/:path*", "/login"],
};

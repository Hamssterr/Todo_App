import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  let role: string | null = null;

  // Cố gắng đọc token từ access_token trước
  if (accessToken) {
    try {
      const payload = await verifyAccessToken(accessToken);
      role = payload.role;
    } catch (e) {
      // access_token hết hạn hoặc không hợp lệ, bỏ qua để check refresh_token
    }
  }

  // Nếu không có role (do access_token hỏng/hết hạn), thử đọc từ refresh_token
  if (!role && refreshToken) {
    try {
      const payload = await verifyRefreshToken(refreshToken);
      role = payload.role;
    } catch (e) {
      redirect("/login");
    }
  }

  // Chuyển hướng dựa theo role
  if (role === "MANAGER") {
    redirect("/manager");
  } else if (role === "EMPLOYEE") {
    redirect("/employee");
  } else {
    redirect("/login");
  }
}

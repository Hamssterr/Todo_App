import { headers } from "next/headers";
import { verifyAccessToken } from "./jwt";

export async function getCurrentUser() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verifyAccessToken(token);
    return payload;
  } catch (error) {
    return null;
  }
}

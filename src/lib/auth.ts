// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getSessionServer() {
  return await getServerSession(authOptions);
}

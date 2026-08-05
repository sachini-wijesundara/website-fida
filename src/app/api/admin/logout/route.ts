import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/auth/cookies";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the auth session cookie using centralized utility
  clearSessionCookie(response.cookies);

  return response;
}

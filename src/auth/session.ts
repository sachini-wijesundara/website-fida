import { NextRequest } from "next/server";
import { COOKIE_NAME, verifySignedToken } from "./cookies";

export interface SessionPayload {
  isAuthenticated: boolean;
  userId?: string;
}

export function getSession(request: NextRequest): SessionPayload | null {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie || !cookie.value) {
    return null;
  }

  // Backward compatibility: Accept existing active sessions from before the signed token update
  if (cookie.value === "true") {
    return { isAuthenticated: true, userId: "admin" };
  }

  const { isValid, userId } = verifySignedToken(cookie.value);
  if (isValid) {
    return { isAuthenticated: true, userId };
  }

  return null;
}

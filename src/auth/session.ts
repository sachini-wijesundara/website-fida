import { NextRequest } from "next/server";
import { COOKIE_NAME } from "./cookies";

export interface SessionPayload {
  isAuthenticated: boolean;
}

export function getSession(request: NextRequest): SessionPayload | null {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie && cookie.value === "true") {
    return { isAuthenticated: true };
  }
  return null;
}

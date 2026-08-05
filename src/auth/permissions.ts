import { NextRequest } from "next/server";
import { getSession } from "./session";

// Standard Admin permissions list
export type Permission =
  | "blogs:view"
  | "blogs:create"
  | "blogs:update"
  | "blogs:publish"
  | "blogs:delete"
  | "projects:view"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  | "users:view"
  | "users:create"
  | "users:update"
  | "settings:view"
  | "settings:update"
  | "inquiries:view"
  | "inquiries:resolve";

/**
 * Checks if the current session has access.
 * Currently, since all authenticated administrators share full rights,
 * we verify that the user session is active.
 */
export async function requirePermission(permission: Permission, request: NextRequest): Promise<boolean> {
  const session = getSession(request);
  if (!session || !session.isAuthenticated) {
    throw new Error(`Unauthorized: Missing permission ${permission}`);
  }
  return true;
}

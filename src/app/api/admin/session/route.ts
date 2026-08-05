/**
 * src/app/api/admin/session/route.ts
 *
 * GET /api/admin/session
 *
 * Returns whether the current request has a valid admin session.
 * Used by client-side components to check authentication state
 * without exposing cookie internals to the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/auth/session";

export async function GET(request: NextRequest) {
  const session = getSession(request);

  if (!session || !session.isAuthenticated) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({ authenticated: true });
}

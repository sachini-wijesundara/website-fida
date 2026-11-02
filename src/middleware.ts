import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@/auth/session";

// Content APIs where GET is public, but mutating operations (POST, PUT, DELETE) require admin session
const PROTECTED_CONTENT_APIS = [
  "/api/blogs",
  "/api/products",
  "/api/projects",
  "/api/solutions",
  "/api/services",
  "/api/teams",
  "/api/customers",
  "/api/expertise",
  "/api/testimonials",
  "/api/terms",
  "/api/categories",
  "/api/features",
  "/api/timeline",
  "/api/company-profile",
  "/api/settings",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();

  // 1. Protected Admin Web Pages (redirect to /admin/login if not logged in)
  const isProtectedAdminPage =
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    pathname !== "/admin/register";

  if (isProtectedAdminPage) {
    const session = getSession(request);
    if (!session || !session.isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protected Admin API Endpoints (reject unauthenticated requests with 401)
  const isProtectedAdminApi =
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login";

  if (isProtectedAdminApi) {
    const session = getSession(request);
    if (!session || !session.isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }
  }

  // 3. Protected Content Mutation Endpoints (prevent unauthorized POST / PUT / DELETE)
  if (method !== "GET" && method !== "OPTIONS" && method !== "HEAD") {
    const isProtectedContentMutation = PROTECTED_CONTENT_APIS.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (isProtectedContentMutation) {
      const session = getSession(request);
      if (!session || !session.isAuthenticated) {
        return NextResponse.json(
          { message: "Forbidden. Admin authorization required to modify content." },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};

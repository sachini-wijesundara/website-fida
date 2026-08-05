import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/auth/session';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define protected routes
  const isProtectedPath = pathname.startsWith('/admin') && pathname !== '/admin/login' && !pathname.startsWith('/api/');

  if (isProtectedPath) {
    const session = getSession(request);

    // If no session cookie exists, redirect to login
    if (!session || !session.isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};

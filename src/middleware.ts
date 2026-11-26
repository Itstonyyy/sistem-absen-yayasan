import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/services/auth.service';

// Paths that don't require authentication
const publicPaths = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/',
  '/favicon.ico',
  '/_next',
  '/static',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redirect to login
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Get user from database
  const user = await getUserById(payload.id);

  if (!user || !user.isActive) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth).*)',
  ],
};
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/services/auth.service';

export interface AuthResult {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'karyawan';
    name: string;
  };
  error?: string;
}

/**
 * Middleware to authenticate and authorize requests
 * @param request - Next.js request
 * @param allowedRoles - Array of allowed roles for this endpoint
 * @returns AuthResult with authentication status and user info
 */
export async function authenticate(
  request: NextRequest,
  allowedRoles?: ('admin' | 'karyawan')[]
): Promise<AuthResult> {
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return { isAuthenticated: false, error: 'Tidak ada token' };
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return { isAuthenticated: false, error: 'Token tidak valid' };
  }

  // Get user from database
  const user = await getUserById(payload.id);

  if (!user) {
    return { isAuthenticated: false, error: 'Pengguna tidak ditemukan' };
  }

  if (!user.isActive) {
    return { isAuthenticated: false, error: 'Akun tidak aktif' };
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    return {
      isAuthenticated: false,
      error: 'Anda tidak memiliki izin untuk mengakses sumber daya ini',
    };
  }

  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'karyawan',
      name: user.name,
    },
  };
}

/**
 * Create authenticated API handler
 * @param handler - The actual handler function
 * @param allowedRoles - Array of allowed roles
 */
export function withAuth(
  handler: (req: NextRequest, user: NonNullable<AuthResult['user']>) => Promise<Response> | Response,
  allowedRoles?: ('admin' | 'karyawan')[]
) {
  return async (request: NextRequest): Promise<Response> => {
    const authResult = await authenticate(request, allowedRoles);

    if (!authResult.isAuthenticated) {
      return new Response(
        JSON.stringify({ error: authResult.error || 'Tidak terautentikasi' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return handler(request, authResult.user!);
  };
}
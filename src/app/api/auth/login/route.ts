import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { loginSchema } from '@/validations/auth.validation';
import { login } from '@/services/auth.service';

function getZodErrorMessage(error: z.ZodError): string {
  const issues = error.issues;
  if (issues.length > 0) {
    return issues[0].message;
  }
  return 'Validasi gagal';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = loginSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(validated.error) },
        { status: 400 }
      );
    }

    // Authenticate user
    const result = await login(validated.data);

    // Set HTTP-only cookie
    const response = NextResponse.json({
      user: result.user,
      message: 'Login berhasil',
    });

    response.cookies.set({
      name: 'auth-token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: validated.data.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24, // 7 days or 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 401 }
    );
  }
}
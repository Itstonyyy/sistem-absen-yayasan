import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { verifyToken } from '@/lib/auth';
import { changePassword } from '@/services/auth.service';
import { changePasswordSchema } from '@/validations/auth.validation';

function getZodErrorMessage(error: z.ZodError): string {
  const issues = error.issues;
  if (issues.length > 0) {
    return issues[0].message;
  }
  return 'Validasi gagal';
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada token' }, { status: 401 });
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validated = changePasswordSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(validated.error) },
        { status: 400 }
      );
    }

    // Change password
    await changePassword(
      payload.id,
      validated.data.currentPassword,
      validated.data.newPassword
    );

    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan' },
      { status: 400 }
    );
  }
}
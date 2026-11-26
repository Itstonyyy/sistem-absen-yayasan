import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { verifyToken, hashPassword } from '@/lib/auth';
import { resetPasswordSchema } from '@/validations/auth.validation';
import { db } from '@/lib/db';

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
    const validated = resetPasswordSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(validated.error) },
        { status: 400 }
      );
    }

    // Verify token
    const payload = verifyToken(validated.data.token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token tidak valid atau sudah kadaluarsa' },
        { status: 400 }
      );
    }

    // Update password
    const newPasswordHash = await hashPassword(validated.data.password);

    await db.employee.update({
      where: { id: payload.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
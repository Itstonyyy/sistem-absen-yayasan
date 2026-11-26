import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { forgotPasswordSchema } from '@/validations/auth.validation';
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
    const validated = forgotPasswordSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: getZodErrorMessage(validated.error) },
        { status: 400 }
      );
    }

    // Find user by email
    const employee = await db.employee.findUnique({
      where: { email: validated.data.email },
    });

    // Always return success to prevent email enumeration
    // In production, send email with reset token here
    if (employee) {
      // TODO: Generate and send password reset email
      // For now, just log it (in production, use email service)
      console.log(`Reset token would be sent to ${validated.data.email}`);
    }

    return NextResponse.json({
      message: 'Jika email terdaftar, tautan reset password telah dikirim.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
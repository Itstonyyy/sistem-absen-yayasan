import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Logout berhasil' });

    // Clear the auth cookie
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    );
  }
}
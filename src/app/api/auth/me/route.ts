import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada token' }, { status: 401 });
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token tidak valid atau sudah kadaluarsa' }, { status: 401 });
    }

    // Get user from database
    const user = await getUserById(payload.id);

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan atau tidak aktif' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
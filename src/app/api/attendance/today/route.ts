import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  // This endpoint requires karyawan role
  const authResult = await authenticate(request, ['karyawan']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  // At this point, you can access authResult.user
  // Implement your business logic here
  return NextResponse.json({
    message: 'Attendance endpoint - protected',
    user: authResult.user,
  });
}
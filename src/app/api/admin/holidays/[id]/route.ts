import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import { updateHolidaySchema } from '@/validations/holiday.validation';
import {
  getHolidayById as getHolidayByIdService,
  updateHoliday as updateHolidayService,
  deleteHoliday as deleteHolidayService,
} from '@/services/holiday.service';

/**
 * GET /api/admin/holidays/[id]
 * Get holiday by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const holiday = await getHolidayByIdService(id);

    if (!holiday) {
      return NextResponse.json(
        { error: 'Hari libur tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(holiday);
  } catch (error) {
    console.error('Error fetching holiday:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil hari libur' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/holidays/[id]
 * Update holiday
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateHolidaySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || 'Gagal memperbarui hari libur' },
        { status: 400 }
      );
    }

    const holiday = await updateHolidayService(id, validated.data);

    return NextResponse.json(holiday);
  } catch (error) {
    console.error('Error updating holiday:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui hari libur' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/holidays/[id]
 * Delete (soft delete) holiday
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    await deleteHolidayService(id);

    return NextResponse.json({ message: 'Hari libur berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting holiday:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghapus hari libur' },
      { status: 400 }
    );
  }
}
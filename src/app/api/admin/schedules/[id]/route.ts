import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import {
  updateWorkScheduleSchema,
  setDefaultScheduleSchema,
} from '@/validations/schedule.validation';
import {
  getWorkScheduleById as getScheduleByIdService,
  updateWorkSchedule as updateScheduleService,
  deleteWorkSchedule as deleteScheduleService,
  setDefaultSchedule as setDefaultScheduleService,
} from '@/services/schedule.service';

/**
 * GET /api/admin/schedules/[id]
 * Get work schedule by ID
 * Note: In Next.js 16, params is a Promise and must be awaited
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
    const schedule = await getScheduleByIdService(id);

    if (!schedule) {
      return NextResponse.json(
        { error: 'Jadwal kerja tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil jadwal kerja' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/schedules/[id]
 * Update work schedule
 * Note: In Next.js 16, params is a Promise and must be awaited
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
    const validated = updateWorkScheduleSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || 'Gagal memperbarui jadwal kerja' },
        { status: 400 }
      );
    }

    // Handle special case for setting default schedule
    if ('isDefault' in validated.data && validated.data.isDefault !== undefined) {
      const schedule = await setDefaultScheduleService(id, validated.data.isDefault);
      return NextResponse.json(schedule);
    }

    const schedule = await updateScheduleService(id, validated.data);

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui jadwal kerja' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/schedules/[id]
 * Delete (hard delete) work schedule
 * Note: In Next.js 16, params is a Promise and must be awaited
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
    await deleteScheduleService(id);

    return NextResponse.json({ message: 'Jadwal kerja berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghapus jadwal kerja' },
      { status: 400 }
    );
  }
}
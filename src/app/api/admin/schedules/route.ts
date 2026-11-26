import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import {
  createWorkScheduleSchema,
  setDefaultScheduleSchema,
} from '@/validations/schedule.validation';
import {
  getAllWorkSchedules as getAllSchedulesService,
  createWorkSchedule as createWorkScheduleService,
  getDefaultWorkSchedule as getDefaultScheduleService,
  getHolidaysStats,
} from '@/services/schedule.service';
import { getHolidaysStats as getHolidayStatsService } from '@/services/holiday.service';

/**
 * GET /api/admin/schedules
 * Get list of work schedules with pagination
 */
export async function GET(request: NextRequest) {
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const page = request.nextUrl.searchParams.get('page')
      ? parseInt(request.nextUrl.searchParams.get('page')!)
      : 1;
    const limit = request.nextUrl.searchParams.get('limit')
      ? parseInt(request.nextUrl.searchParams.get('limit')!)
      : 10;

    const schedules = await getAllSchedulesService(page, limit);

    // Get default schedule separately
    const defaultSchedule = await getDefaultScheduleService();

    return NextResponse.json({
      ...schedules,
      default: defaultSchedule,
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil daftar jadwal kerja' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/schedules
 * Create new work schedule
 */
export async function POST(request: NextRequest) {
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validated = createWorkScheduleSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || 'Gagal membuat jadwal kerja' },
        { status: 400 }
      );
    }

    const schedule = await createWorkScheduleService(validated.data);

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal membuat jadwal kerja' },
      { status: 400 }
    );
  }
}
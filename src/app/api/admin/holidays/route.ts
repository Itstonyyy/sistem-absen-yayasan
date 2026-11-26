import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import {
  createHolidaySchema,
  holidaySearchParamsSchema,
} from '@/validations/holiday.validation';
import {
  getAllHolidays as getAllHolidaysService,
  createHoliday as createHolidayService,
  getHolidayStats,
} from '@/services/holiday.service';

/**
 * GET /api/admin/holidays
 * Get list of holidays with pagination, search, and filter
 */
export async function GET(request: NextRequest) {
  // This endpoint requires admin role only
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    // Parse query parameters
    const searchParams = {
      page: request.nextUrl.searchParams.get('page') 
        ? parseInt(request.nextUrl.searchParams.get('page')!) 
        : 1,
      limit: request.nextUrl.searchParams.get('limit') 
        ? parseInt(request.nextUrl.searchParams.get('limit')!) 
        : 10,
      jenis: (request.nextUrl.searchParams.get('jenis') as 'rutin' | 'nasional' | 'khusus') || undefined,
      year: request.nextUrl.searchParams.get('year') || undefined,
    };

    const validatedSearch = holidaySearchParamsSchema.safeParse({
      jenis: searchParams.jenis,
      year: searchParams.year,
    });

    if (!validatedSearch.success) {
      return NextResponse.json(
        { error: validatedSearch.error.issues[0]?.message || 'Parameter pencarian tidak valid' },
        { status: 400 }
      );
    }

    const holidays = await getAllHolidaysService(
      searchParams.page,
      searchParams.limit,
      searchParams.jenis,
      searchParams.year
    );

    return NextResponse.json(holidays);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil daftar hari libur' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/holidays
 * Create new holiday
 */
export async function POST(request: NextRequest) {
  // This endpoint requires admin role only
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validated = createHolidaySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || 'Parameter pencarian tidak valid' },
        { status: 400 }
      );
    }

    const holiday = await createHolidayService(validated.data);

    return NextResponse.json(holiday, { status: 201 });
  } catch (error) {
    console.error('Error creating holiday:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal membuat hari libur' },
      { status: 400 }
    );
  }
}
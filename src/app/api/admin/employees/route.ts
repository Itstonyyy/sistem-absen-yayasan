import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import {
  createEmployeeSchema,
  employeeSearchParamsSchema,
} from '@/validations/employee.validation';
import {
  getAllEmployees as getAllEmployeesService,
  createEmployee as createEmployeeService,
  checkNipExists,
  checkEmailExists,
} from '@/services/employee.service';

/**
 * GET /api/admin/employees
 * Get list of employees with pagination, search, and filter
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
      search: request.nextUrl.searchParams.get('search') || undefined,
      jabatan: request.nextUrl.searchParams.get('jabatan') || undefined,
      isActive: request.nextUrl.searchParams.get('isActive')
        ? request.nextUrl.searchParams.get('isActive') === 'true'
        : undefined,
      page: request.nextUrl.searchParams.get('page')
        ? parseInt(request.nextUrl.searchParams.get('page')!)
        : 1,
      pageSize: request.nextUrl.searchParams.get('pageSize')
        ? parseInt(request.nextUrl.searchParams.get('pageSize')!)
        : 10,
    };

    // Validate parameters
    const validatedParams = employeeSearchParamsSchema.parse(searchParams);

    // Get employees
    const result = await getAllEmployeesService(validatedParams);

    return NextResponse.json({
      data: result.data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data karyawan' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/employees
 * Create new employee
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
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedInput = createEmployeeSchema.parse(body);

    // Check if NIP already exists
    const nipExists = await checkNipExists(validatedInput.nip);
    if (nipExists) {
      return NextResponse.json(
        { error: 'NIP sudah ada. NIP harus unik.' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(validatedInput.email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'Email sudah ada. Email harus unik.' },
        { status: 409 }
      );
    }

    // Create employee
    const employee = await createEmployeeService(validatedInput);

    // Remove password hash from response
    const { passwordHash, ...employeeWithoutPassword } = employee as any;

    return NextResponse.json(
      {
        message: 'Karyawan berhasil ditambahkan',
        data: employeeWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors.map((e: any) => e.message).join(', ') },
        { status: 400 }
      );
    }
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan karyawan' },
      { status: 500 }
    );
  }
}
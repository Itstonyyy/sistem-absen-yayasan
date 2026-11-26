import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';
import {
  updateEmployeeSchema,
  resetPasswordSchema,
} from '@/validations/employee.validation';
import {
  getEmployeeById,
  updateEmployee as updateEmployeeService,
  deleteEmployee,
  resetEmployeePassword,
  checkNipExists,
  checkEmailExists,
} from '@/services/employee.service';

/**
 * GET /api/admin/employees/[id]
 * Get employee by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // This endpoint requires admin role only
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const employee = await getEmployeeById(id);

    if (!employee) {
      return NextResponse.json(
        { error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data karyawan' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/employees/[id]
 * Update employee
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // This endpoint requires admin role only
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedInput = updateEmployeeSchema.parse(body);

    // Check if NIP already exists (if NIP is being updated)
    if ('nip' in validatedInput && (validatedInput as any).nip) {
      const nipExists = await checkNipExists((validatedInput as any).nip, id);
      if (nipExists) {
        return NextResponse.json(
          { error: 'NIP sudah ada. NIP harus unik.' },
          { status: 409 }
        );
      }
    }

    // Check if email already exists (if email is being updated)
    if ('email' in validatedInput && validatedInput.email) {
      const emailExists = await checkEmailExists(validatedInput.email, id);
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email sudah ada. Email harus unik.' },
          { status: 409 }
        );
      }
    }

    // Update employee
    const employee = await updateEmployeeService(id, validatedInput);

    // Remove password hash from response if present
    const { passwordHash, ...employeeWithoutPassword } = employee as any;

    return NextResponse.json({
      message: 'Data karyawan berhasil diperbarui',
      data: employeeWithoutPassword,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors.map((e: any) => e.message).join(', ') },
        { status: 400 }
      );
    }
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data karyawan' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/employees/[id]
 * Delete employee permanently (hard delete)
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // This endpoint requires admin role only
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    // Check if employee exists
    const existingEmployee = await getEmployeeById(id);
    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete employee permanently
    const employee = await deleteEmployee(id);

    return NextResponse.json({
      message: 'Data karyawan berhasil dihapus permanently',
      data: employee,
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data karyawan. Pastikan data tidak terikat dengan data lain.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/employees/[id]/reset-password
 * Reset password for employee (by admin)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // This endpoint requires admin role only
  const authResult = await authenticate(request, ['admin']);

  if (!authResult.isAuthenticated) {
    return NextResponse.json(
      { error: authResult.error || 'Tidak terautentikasi' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    // Parse request body
    const body = await request.json();

    // Validate input
    const { newPassword } = resetPasswordSchema.parse(body);

    // Check if employee exists
    const existingEmployee = await getEmployeeById(id);
    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Reset password
    await resetEmployeePassword(id, newPassword);

    return NextResponse.json({
      message: 'Password karyawan berhasil direset',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors.map((e: any) => e.message).join(', ') },
        { status: 400 }
      );
    }
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Gagal mereset password karyawan' },
      { status: 500 }
    );
  }
}

import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeSearchParams,
  Employee,
} from '@/validations/employee.validation';

/**
 * Generate avatar color gradient based on employee name
 */
function generateAvatarColor(name: string): string {
  const gradients = [
    'from-emerald-500 to-green-600',
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-indigo-600',
    'from-teal-500 to-cyan-600',
    'from-violet-500 to-fuchsia-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
    'from-lime-500 to-green-600',
    'from-slate-500 to-gray-600',
  ];
  
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  return gradients[index];
}

/**
 * Map Prisma employee to API response (remove passwordHash)
 */
function mapToEmployee(employee: any): Employee {
  return {
    id: employee.id,
    nip: employee.nip,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    jabatan: employee.jabatan,
    telepon: employee.telepon,
    jenisKelamin: employee.jenisKelamin,
    tempatLahir: employee.tempatLahir,
    tanggalLahir: employee.tanggalLahir,
    agama: employee.agama,
    alamat: employee.alamat,
    avatarColor: employee.avatarColor,
    sisaCuti: employee.sisaCuti,
    isActive: employee.isActive,
    deletedAt: employee.deletedAt,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  };
}

/**
 * Get all employees with pagination, search, and filter
 */
export async function getAllEmployees(params: EmployeeSearchParams) {
  const { search, jabatan, isActive, page = 1, pageSize = 10 } = params;
  
  // Build where clause
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nip: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (jabatan) {
    where.jabatan = jabatan;
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive;
  }
  
  // Get total count
  const total = await db.employee.count({ where });
  
  // Get data with pagination
  const employees = await db.employee.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });
  
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    data: employees.map(mapToEmployee),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get employee by ID
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  const employee = await db.employee.findUnique({
    where: { id },
  });
  
  return employee ? mapToEmployee(employee) : null;
}

/**
 * Check if NIP already exists
 */
export async function checkNipExists(nip: string, excludeId?: string): Promise<boolean> {
  const where: any = { nip };
  if (excludeId) {
    where.id = { not: excludeId };
  }
  const count = await db.employee.count({ where });
  return count > 0;
}

/**
 * Check if email already exists
 */
export async function checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
  const where: any = { email };
  if (excludeId) {
    where.id = { not: excludeId };
  }
  const count = await db.employee.count({ where });
  return count > 0;
}

/**
 * Create new employee
 */
export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  // Hash password
  const passwordHash = await hashPassword(input.password);
  
  // Generate avatar color based on name
  const avatarColor = generateAvatarColor(input.name);
  
  // Create employee
  const employee = await db.employee.create({
    data: {
      nip: input.nip,
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'karyawan', // Default role
      jabatan: input.jabatan,
      telepon: input.telepon || null,
      jenisKelamin: input.jenisKelamin || null,
      tempatLahir: input.tempatLahir || null,
      tanggalLahir: input.tanggalLahir,
      agama: input.agama || 'Islam',
      alamat: input.alamat || null,
      avatarColor,
      isActive: true,
    },
  });
  
  return mapToEmployee(employee);
}

/**
 * Update employee
 */
export async function updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
  // Prepare update data
  const updateData: any = {};
  
  if (input.name !== undefined) updateData.name = input.name;
  if (input.email !== undefined) updateData.email = input.email;
  if (input.jabatan !== undefined) updateData.jabatan = input.jabatan;
  if (input.telepon !== undefined) updateData.telepon = input.telepon;
  if (input.jenisKelamin !== undefined) updateData.jenisKelamin = input.jenisKelamin;
  if (input.tempatLahir !== undefined) updateData.tempatLahir = input.tempatLahir;
  if (input.tanggalLahir !== undefined) updateData.tanggalLahir = input.tanggalLahir;
  if (input.agama !== undefined) updateData.agama = input.agama;
  if (input.alamat !== undefined) updateData.alamat = input.alamat;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;
  
  const employee = await db.employee.update({
    where: { id },
    data: updateData,
  });
  
  return mapToEmployee(employee);
}

/**
 * Delete employee permanently (hard delete)
 */
export async function deleteEmployee(id: string): Promise<Employee> {
  const employee = await db.employee.delete({
    where: { id },
  });
  
  return mapToEmployee(employee);
}

/**
 * Reactivate employee
 */
export async function reactivateEmployee(id: string): Promise<Employee> {
  const employee = await db.employee.update({
    where: { id, isActive: false }, // Only reactivate if inactive
    data: {
      isActive: true,
      deletedAt: null,
    },
  });
  
  return mapToEmployee(employee);
}

/**
 * Reset password for employee (by admin)
 */
export async function resetEmployeePassword(id: string, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword);
  
  await db.employee.update({
    where: { id },
    data: { passwordHash },
  });
}
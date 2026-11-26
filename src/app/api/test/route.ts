import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const employees = await db.employee.findMany({ take: 5 });
    return NextResponse.json({
      message: 'API test successful',
      employeesCount: employees.length,
      employees: employees.map(e => ({ id: e.id, name: e.name, role: e.role })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Test failed' },
      { status: 500 }
    );
  }
}
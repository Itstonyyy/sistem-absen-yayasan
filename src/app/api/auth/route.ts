import { NextRequest, NextResponse } from 'next/server';

// This is a catch-all handler - individual endpoints are in subdirectories
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Auth API - use /api/auth/login, /api/auth/me, etc.' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Auth API - use /api/auth/login, /api/auth/forgot-password, etc.' });
}
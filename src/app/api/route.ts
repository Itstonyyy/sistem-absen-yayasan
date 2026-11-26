import { NextResponse } from "next/server";

// This is a catch-all handler - individual endpoints are in subdirectories
// Use /api/auth/login, /api/auth/logout, /api/auth/me, etc.
export async function GET() {
  return NextResponse.json({ 
    message: "API Sistem Absensi Yayasan Al-Maghfirah",
    endpoints: [
      "POST /api/auth/login - Login",
      "POST /api/auth/logout - Logout",
      "GET /api/auth/me - Get current user",
      "PUT /api/auth/password - Change password",
      "POST /api/auth/forgot-password - Request password reset",
      "POST /api/auth/reset-password - Reset password"
    ]
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: "API Sistem Absensi Yayasan Al-Maghfirah",
    endpoints: [
      "POST /api/auth/login - Login",
      "POST /api/auth/logout - Logout",
      "GET /api/auth/me - Get current user",
      "PUT /api/auth/password - Change password",
      "POST /api/auth/forgot-password - Request password reset",
      "POST /api/auth/reset-password - Reset password"
    ]
  });
}
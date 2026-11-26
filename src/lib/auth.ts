import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'default-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'admin' | 'karyawan';
}

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Generate secure random token for password reset
export function generateSecureToken(): string {
  return jwt.sign(
    { random: Math.random().toString(36).substring(2) },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}
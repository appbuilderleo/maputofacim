import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 12;
const SESSION_COOKIE_NAME = 'facim_session';

// ── Password Hashing ───────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── JWT Token Management ───────────────────────────────────
interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as import('jsonwebtoken').SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// ── Session Management ─────────────────────────────────────
export async function createSession(userId: string): Promise<string> {
  // Calculate expiry (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Get user info for JWT payload
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, role: true },
  });

  if (!user) throw new Error('Utilizador não encontrado');

  // Create session in database
  const session = await prisma.session.create({
    data: {
      userId,
      token: crypto.randomUUID(),
      expiresAt,
    },
  });

  // Generate JWT with session ID
  const token = generateToken({
    userId,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });

  return token;
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    // Verify session still exists and hasn't expired
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            avatar: true,
            isActive: true,
            empresa: {
              select: {
                id: true,
                nome: true,
                logotipo: true,
              },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date() || !session.user.isActive) {
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}

export async function invalidateSession(sessionId: string) {
  try {
    await prisma.session.delete({ where: { id: sessionId } });
  } catch {
    // Session may already be deleted
  }
}

export async function invalidateAllUserSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

// ── Cookie Helpers ─────────────────────────────────────────
export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  };
}

// ── Validation Helpers ─────────────────────────────────────
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'A palavra-passe deve ter pelo menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'A palavra-passe deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'A palavra-passe deve conter pelo menos uma letra minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'A palavra-passe deve conter pelo menos um número' };
  }
  return { valid: true, message: '' };
}

export function validateNUIT(nuit: string): boolean {
  // Mozambique NUIT: typically 9-10 digits
  return /^\d{9,10}$/.test(nuit.replace(/\s/g, ''));
}

export function validatePhone(phone: string): boolean {
  // Mozambique phone format: +258 8X XXX XXXX or similar
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+258)?8[2-7]\d{7}$/.test(cleaned);
}

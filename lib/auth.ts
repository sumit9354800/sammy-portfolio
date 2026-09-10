import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-portfolio-sumit-shrivastav-2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sumit9354800@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeInProduction123!';

export interface AuthSession {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

export function createToken(email: string): string {
  const payload: AuthSession = {
    email,
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(dataStr)
    .digest('base64url');

  return `${dataStr}.${signature}`;
}

export function verifyToken(token: string): AuthSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [dataStr, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(dataStr)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: AuthSession = JSON.parse(
      Buffer.from(dataStr, 'base64url').toString('utf-8')
    );

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(email: string, pass: string): boolean {
  return email === ADMIN_EMAIL && pass === ADMIN_PASSWORD;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token =
    req.cookies?.admin_session ||
    req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }

  const session = verifyToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  (req as any).adminUser = session;
  next();
}

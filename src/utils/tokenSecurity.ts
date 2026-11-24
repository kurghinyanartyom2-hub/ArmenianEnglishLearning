import crypto from 'crypto';

export const OFFICIAL_OWNER_EMAIL = 'kurghinyanartyom2@gmail.com';
export const SERVER_SECRET = process.env.SESSION_SECRET || 'hayenglish_secure_owner_hmac_secret_2026_x89f';

export interface ServerTokenPayload {
  userId: string;
  email: string;
  role: 'super_admin' | 'student';
  issuedAt: number;
  expiresAt: number;
}

export function createSignedSessionToken(userId: string, email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  // STRICT: Only kurghinyanartyom2@gmail.com can EVER receive the super_admin role on the server
  const isOwner = cleanEmail === OFFICIAL_OWNER_EMAIL.toLowerCase();
  const role: 'super_admin' | 'student' = isOwner ? 'super_admin' : 'student';

  const payload: ServerTokenPayload = {
    userId,
    email: cleanEmail,
    role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  const payloadJson = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadJson).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

export function verifySignedSessionToken(token: string): ServerTokenPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadBase64, providedSignature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SERVER_SECRET)
      .update(payloadBase64)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload: ServerTokenPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    // Double-check: Even if somehow a token had role 'super_admin', enforce email match strictly
    if (payload.role === 'super_admin' && payload.email.toLowerCase() !== OFFICIAL_OWNER_EMAIL.toLowerCase()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

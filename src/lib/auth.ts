import { SignJWT, jwtVerify } from 'jose';

function getSecret() {
  const secret = process.env.SUPABASE_SERVICE_KEY;
  if (!secret) {
    throw new Error('SUPABASE_SERVICE_KEY environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());

  return token;
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD environment variable is not set');
  }
  return password === adminPassword;
}

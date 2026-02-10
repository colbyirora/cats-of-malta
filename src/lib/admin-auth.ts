import { cookies } from 'next/headers';
import { verifyToken } from './auth';

export async function requireAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    await verifyToken(token);
    return true;
  } catch {
    return false;
  }
}

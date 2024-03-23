import { cookies } from 'next/headers';
import type { User } from '@/app/lib/definitions';

export function encrypt(payload: any) {
  return btoa(JSON.stringify(payload));
}

export function decrypt(input: string) {
  return JSON.parse(atob(input));
}

export function createSession(user: User) {
  // Create the session
  const oneDay = 24 * 60 * 60 * 1000;
  const expires = new Date(Date.now() + oneDay);
  const session = encrypt({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      groupId: user.group_id,
      name: user.name,
    },
    expires,
  });

  // Save the session in a cookie
  cookies().set('session', session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
}

export function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return decrypt(session);
}

import type { NextAuthConfig } from 'next-auth';
import { getSession } from '@/app/lib/session';

const canUserGoThere = (pathname: string) => {
  return (
    pathname === '/dashboard' ||
    pathname.includes('/users') ||
    pathname.includes('/groups')
  );
};

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isInAdminPanel = nextUrl.pathname.startsWith('/dashboard');
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');
      const session = await getSession();

      const role = session?.user.role;

      if (isOnLoginPage && isLoggedIn && session) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      if (isInAdminPanel) {
        if (!isLoggedIn || !session) {
          return false;
        }

        if (role === 'admin' || canUserGoThere(nextUrl.pathname)) {
          return true;
        }
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

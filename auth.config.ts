import type { NextAuthConfig } from 'next-auth';
import { getSession } from '@/app/lib/session';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');
      const session = await getSession();

      if (isOnDashboard) {
        if (isLoggedIn && session) {
          return true;
        }

        return false; // Redirect unauthenticated users to login page
      }

      if (isOnLoginPage && isLoggedIn && session) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

import type { NextAuthConfig } from 'next-auth';
import { getSession } from '@/app/lib/session';

const canUserGoThere = ({
  pathname,
  groupId,
  userId,
}: {
  pathname: string;
  groupId: string;
  userId: string;
}) => {
  return (
    pathname === '/dashboard' ||
    pathname.includes(`/users/${userId}/edit`) ||
    pathname.includes(`/groups/${groupId}/edit`)
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

      if (isOnLoginPage && isLoggedIn && session) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      if (isInAdminPanel) {
        const userId = session?.user.id;
        const groupId = session?.user.groupId;
        const role = session?.user.role;

        if (!isLoggedIn || !session) {
          return false;
        }

        if (
          role === 'admin' ||
          canUserGoThere({ groupId, pathname: nextUrl.pathname, userId })
        ) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

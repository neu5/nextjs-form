import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import EmerykLogo from '@/app/ui/emeryk-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { logout } from '@/app/lib/session';
import { getSession } from '@/app/lib/session';

export default async function SideNav() {
  const { user } = await getSession();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-white p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <EmerykLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks role={user.role} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await logout();
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Wyloguj</div>
          </button>
        </form>
      </div>
    </div>
  );
}

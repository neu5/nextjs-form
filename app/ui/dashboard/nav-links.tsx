'use client';

import {
  UserGroupIcon,
  HomeIcon,
  GlobeEuropeAfricaIcon,
  ClockIcon,
  TruckIcon,
  TrophyIcon,
  Cog8ToothIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const adminLinks = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Grupy', href: '/dashboard/groups', icon: UserGroupIcon },
  { name: 'Trasy', href: '/dashboard/paths', icon: GlobeEuropeAfricaIcon },
  { name: 'Transport', href: '/dashboard/transports', icon: TruckIcon },
  {
    name: 'Godziny startów',
    href: '/dashboard/leaving-hours',
    icon: ClockIcon,
  },
  {
    name: 'Organizatorzy',
    href: '/dashboard/organizers',
    icon: TrophyIcon,
  },
  {
    name: 'Użytkownicy',
    href: '/dashboard/users',
    icon: UsersIcon,
  },
  {
    name: 'Ustawienia',
    href: '/dashboard/configuration',
    icon: Cog8ToothIcon,
  },
];

const memberLinks = ({
  userId,
  groupId,
}: {
  userId: string;
  groupId?: string;
}) => [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  ...(groupId
    ? [
        {
          name: 'Grupa',
          href: `/dashboard/groups/${groupId}/edit`,
          icon: UserGroupIcon,
        },
      ]
    : []),
  {
    name: 'Profil',
    href: `/dashboard/users/${userId}/edit`,
    icon: UsersIcon,
  },
];

export default function NavLinks({
  id,
  groupId,
  role,
}: {
  id: string;
  groupId: string;
  role: string;
}) {
  const pathname = usePathname();

  const links =
    role === 'admin' ? adminLinks : memberLinks({ userId: id, groupId });

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

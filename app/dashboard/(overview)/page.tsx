import { lusitana } from '@/app/ui/fonts';
// import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  fetchGroupCount,
  fetchMembersCount,
  fetchMembersWithPTTKCardCount,
  fetchMembersWithShirts,
  fetchPaths,
  fetchGroupsByPathId,
  fetchMembersGroupCount,
} from '@/app/lib/data';
import { getSession } from '@/app/lib/session';
import { getSortedMembersShirts } from '@/app/lib/utils';
import type { PathsTable } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Home',
};

async function MembersList({ paths }: { paths: PathsTable[] }) {
  const pathsWithGroups = await Promise.all(
    paths.map(async (path: PathsTable) => {
      const groups = await fetchGroupsByPathId(path.id);

      const membersPerGroup = await Promise.all(
        groups.map(async (group) => {
          const membersCount = await fetchMembersGroupCount(group.id);

          return {
            ...group,
            membersCount,
          };
        }),
      );

      return {
        ...path,
        membersCount: membersPerGroup.reduce(
          (sum, group) => sum + Number(group.membersCount),
          0,
        ),
      };
    }),
  );

  return (
    <div className="mt-6">
      <h3>Liczba ludzi na trasach:</h3>
      {pathsWithGroups.map(({ id, name, type, membersCount }) => (
        <div key={id}>
          <Link
            href={`/print/groups/members-list/${id}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            {name} {type ? `(${type})` : ''} ({membersCount})
          </Link>
        </div>
      ))}
    </div>
  );
}

const AdminInfo = async ({
  membersCount,
  membersWithPTTKCardCount,
  membersWithoutPTTKCardCount,
  membersWithShirts,
  groupCount,
  paths,
}: {
  membersCount: number;
  membersWithPTTKCardCount: number;
  membersWithoutPTTKCardCount: number;
  membersWithShirts: {
    shirt_size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    shirt_type: 'damska' | 'męska';
  }[];
  groupCount: number;
  paths: { id: string; type: string; name: string; date: Date }[];
}) => {
  const sortedMembersShirts = getSortedMembersShirts(membersWithShirts);

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <div className="">
        <p>
          Liczba zapisanych uczestników:{' '}
          <span className="font-bold">{membersCount}</span>
        </p>
        <p>
          Liczba osób z legitymacją PTTK:{' '}
          <span className="font-bold">{membersWithPTTKCardCount}</span>
        </p>
        <p>
          Liczba osób bez legitymacji PTTK:{' '}
          <span className="font-bold">{membersWithoutPTTKCardCount}</span>
        </p>
        <p>
          Liczba grup: <span className="font-bold">{groupCount}</span>
        </p>
      </div>
      {/* @ts-ignore */}
      <MembersList paths={paths} />
      <div className="mt-6">
        <h3>Spis grup do druku dla kierowników tras:</h3>
        {paths.map(({ id, name, type }) => (
          <div key={id}>
            <Link
              href={`/print/groups/list/${id}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              {name} {type ? `(${type})` : ''}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3>Lista obecności:</h3>
        {paths.map(({ id, name, type }) => (
          <div key={id}>
            <Link
              href={`/print/groups/attendance-list/${id}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              {name} {type ? `(${type})` : ''}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href="/dashboard/remarks"
          className="font-bold text-blue-600 underline"
        >
          Uwagi ze wszystkich grup
        </Link>
      </div>
      <div className="mt-4">
        <Link
          href="/print/insurance-list-with-no-pttk"
          target="_blank"
          className="font-bold text-blue-600 underline"
        >
          Lista ubezpieczeniowa uczestników bez legitymacji PTTK
        </Link>
      </div>
      <div className="">
        <Link
          href="/print/insurance-list-with-pttk"
          target="_blank"
          className="font-bold text-blue-600 underline"
        >
          Lista ubezpieczeniowa uczestników z legitymacją PTTK
        </Link>
      </div>
      <div className="mt-6">
        <h3>
          <Link
            href="/print/shirts-list"
            target="_blank"
            className="font-bold text-blue-600 underline"
          >
            Koszulki
          </Link>
          : {membersWithShirts.length}
        </h3>
        <h3 className="font-bold">Męskie</h3>
        <p>S: {sortedMembersShirts.male.S}</p>
        <p>M: {sortedMembersShirts.male.M}</p>
        <p>L: {sortedMembersShirts.male.L}</p>
        <p>XL: {sortedMembersShirts.male.XL}</p>
        <p>XXL: {sortedMembersShirts.male.XXL}</p>
        <h3 className="mt-4 font-bold">Damskie</h3>
        <p>S: {sortedMembersShirts.female.S}</p>
        <p>M: {sortedMembersShirts.female.M}</p>
        <p>L: {sortedMembersShirts.female.L}</p>
        <p>XL: {sortedMembersShirts.female.XL}</p>
        <p>XXL: {sortedMembersShirts.female.XXL}</p>
      </div>
    </div>
  );
};

export default async function Page() {
  const [
    membersCount,
    membersWithPTTKCardCount,
    groupCount,
    membersWithShirts,
    paths,
    session,
  ] = await Promise.all([
    fetchMembersCount(),
    fetchMembersWithPTTKCardCount(),
    fetchGroupCount(),
    fetchMembersWithShirts(),
    fetchPaths(),
    getSession(),
  ]);

  const membersWithoutPTTKCardCount = membersCount - membersWithPTTKCardCount;
  const isAdmin = session.user.role === 'admin';

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {isAdmin && (
        <AdminInfo
          membersCount={membersCount}
          membersWithPTTKCardCount={membersWithPTTKCardCount}
          membersWithoutPTTKCardCount={membersWithoutPTTKCardCount}
          groupCount={groupCount}
          membersWithShirts={membersWithShirts}
          /* @ts-ignore */
          paths={paths}
        />
      )}
    </main>
  );
}

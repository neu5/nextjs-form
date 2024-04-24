import Link from 'next/link';
import {
  fetchGroupCount,
  fetchMembersCount,
  fetchMembersWithPTTKCardCount,
  fetchMembersWithShirts,
  fetchPaths,
  fetchGroupsByPathId,
  fetchMembersGroupCount,
  fetchOrganizers,
} from '@/app/lib/data';
import { getSortedMembersShirts, getSortedPaths } from '@/app/lib/utils';
import type { PathsTable } from '@/app/lib/definitions';

type sortedShirts = {
  male: shirts;
  female: shirts;
};
type shirts = { S: number; M: number; L: number; XL: number; XXL: number };

const getSortedShirts = (
  sortedMembersShirts: sortedShirts,
  sortedOrganizersShirts: sortedShirts,
) => ({
  male: {
    S: sortedMembersShirts.male.S + sortedOrganizersShirts.male.S,
    M: sortedMembersShirts.male.M + sortedOrganizersShirts.male.M,
    L: sortedMembersShirts.male.L + sortedOrganizersShirts.male.L,
    XL: sortedMembersShirts.male.XL + sortedOrganizersShirts.male.XL,
    XXL: sortedMembersShirts.male.XXL + sortedOrganizersShirts.male.XXL,
  },
  female: {
    S: sortedMembersShirts.female.S + sortedOrganizersShirts.female.S,
    M: sortedMembersShirts.female.M + sortedOrganizersShirts.female.M,
    L: sortedMembersShirts.female.L + sortedOrganizersShirts.female.L,
    XL: sortedMembersShirts.female.XL + sortedOrganizersShirts.female.XL,
    XXL: sortedMembersShirts.female.XXL + sortedOrganizersShirts.female.XXL,
  },
});

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
            {name} {type ? `(${type})` : ''}{' '}
            <span className="font-bold">({membersCount})</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default async function AdminInfo() {
  const [
    membersCount,
    membersWithPTTKCardCount,
    groupCount,
    membersWithShirts,
    paths,
    organizers,
  ] = await Promise.all([
    fetchMembersCount(),
    fetchMembersWithPTTKCardCount(),
    fetchGroupCount(),
    fetchMembersWithShirts(),
    fetchPaths(),
    fetchOrganizers(),
  ]);

  const membersWithoutPTTKCardCount = membersCount - membersWithPTTKCardCount;

  const sortedMembersShirts = getSortedMembersShirts(membersWithShirts);
  const sortedOrganizersShirts = getSortedMembersShirts(organizers);

  const sortedShirts = getSortedShirts(
    sortedMembersShirts,
    sortedOrganizersShirts,
  );

  const sortedShirtsSum =
    sortedShirts.male.S +
    sortedShirts.male.M +
    sortedShirts.male.L +
    sortedShirts.male.XL +
    sortedShirts.male.XXL +
    sortedShirts.female.S +
    sortedShirts.female.M +
    sortedShirts.female.L +
    sortedShirts.female.XL +
    sortedShirts.female.XXL;

  const sortedPaths = getSortedPaths(paths);

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <div>
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
      <MembersList paths={sortedPaths} />
      <div className="mt-6">
        <h3>Spis grup do druku dla kierowników tras:</h3>
        {sortedPaths.map(({ id, name, type }) => (
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
        {sortedPaths.map(({ id, name, type }) => (
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
          : {sortedShirtsSum}
        </h3>
        <h3 className="font-bold">Męskie</h3>
        <p>S: {sortedShirts.male.S}</p>
        <p>M: {sortedShirts.male.M}</p>
        <p>L: {sortedShirts.male.L}</p>
        <p>XL: {sortedShirts.male.XL}</p>
        <p>XXL: {sortedShirts.male.XXL}</p>
        <h3 className="mt-4 font-bold">Damskie</h3>
        <p>S: {sortedShirts.female.S}</p>
        <p>M: {sortedShirts.female.M}</p>
        <p>L: {sortedShirts.female.L}</p>
        <p>XL: {sortedShirts.female.XL}</p>
        <p>XXL: {sortedShirts.female.XXL}</p>
      </div>
    </div>
  );
}

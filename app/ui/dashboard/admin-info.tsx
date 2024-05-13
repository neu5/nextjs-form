import Link from 'next/link';
import {
  fetchGroupCount,
  fetchMembersCount,
  fetchMembersWithPTTKCardCount,
  fetchPaths,
  fetchMembersFees,
} from '@/app/lib/data';
import { getSortedPaths } from '@/app/lib/utils';

export default async function AdminInfo() {
  const [
    membersCount,
    membersWithPTTKCardCount,
    groupCount,

    paths,

    membersFees,
  ] = await Promise.all([
    fetchMembersCount(),
    fetchMembersWithPTTKCardCount(),
    fetchGroupCount(),

    fetchPaths(),

    fetchMembersFees(),
  ]);

  const membersWithoutPTTKCardCount = membersCount - membersWithPTTKCardCount;

  const sortedPaths = getSortedPaths(paths);

  const membersFeesSum = membersFees.reduce(
    (sum, member) => sum + Number(member.fee),
    0,
  );

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
      <div className="mt-4">
        <Link
          href="/public/groups/list-with-numbers"
          target="_blank"
          className="text-blue-600 underline"
        >
          Lista grup + ilość uczestników
        </Link>
      </div>
      <div className="mt-4">
        Szacunkowe wpłaty:{' '}
        <span className="font-bold">{membersFeesSum} PLN</span>
      </div>
      {/* @ts-ignore */}
      <div className="mt-6">
        <Link
          href="/dashboard/info/members-list"
          className="font-bold text-blue-600 underline"
        >
          Liczba ludzi na trasach
        </Link>
      </div>
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
        <Link
          href="/dashboard/info/shirts"
          className="font-bold text-blue-600 underline"
        >
          Koszulki
        </Link>
      </div>
    </div>
  );
}

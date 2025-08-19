import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import {
  fetchGroupsByPathId,
  fetchMembersGroupCount,
  fetchPaths,
} from '@/app/lib/data';
import { Metadata } from 'next';
import type { PathsTable } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Liczba ludzi na trasach',
};

export default async function Page() {
  const [paths] = await Promise.all([fetchPaths()]);

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
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Liczba ludzi na trasach
        </h1>
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mt-6">
          <h3>Liczba ludzi na trasach:</h3>      
          {sortedPaths.map(({ id, name, type, membersCount }) => (
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
      </div>
    </div>
  );
}

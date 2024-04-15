import clsx from 'clsx';
import { fetchGroupsByPathId, fetchMembersGroup } from '@/app/lib/data';

type Group = {
  id: string;
  name: string;
  chef_group_phone_number: string;
  leaving_hour_id: string;
  path_id: string;
  leaving_hour: string;
};

async function getMembers(group: Group) {
  const members = await fetchMembersGroup(group.id);

  return {
    ...group,
    members,
  };
}

const Table = ({
  group,
}: {
  group: Group & {
    members: {
      id: string;
      name: string;
      is_group_chef: boolean;
    }[];
  };
}) => {
  return (
    <div className="mt-6 flow-root pb-8">
      <div className="inline-block min-w-full align-middle">
        <div className="">
          <h2 className="mx-4">{group.name}</h2>
          <table className="min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Lp.
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Imię i nazwisko
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Obecność
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {group.members?.map(
                (
                  member: { id: string; is_group_chef: boolean; name: string },
                  idx: number,
                ) => (
                  <tr
                    key={member.id}
                    className="w-full border-b border-black py-3 text-sm"
                  >
                    <td className="whitespace-nowrap border border-black py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">{idx + 1}</div>
                    </td>
                    <td
                      className={clsx(
                        'whitespace-nowrap border border-black px-3 py-3',
                        {
                          'bg-yellow-200': member.is_group_chef,
                        },
                      )}
                    >
                      <p>{member.name}</p>
                    </td>
                    <td className="whitespace-nowrap border border-black px-3 py-3">
                      {''}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default async function GroupsTable({ id }: { id: string }) {
  let groups = await fetchGroupsByPathId(id);

  const groupWithMembers = await Promise.all(
    /* @ts-ignore */
    groups.map((group) => getMembers(group)),
  );

  return groupWithMembers.map((group) => (
    <Table
      /* @ts-ignore */
      group={group}
      key={group.id}
    />
  ));
}

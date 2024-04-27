import { fetchGroups, fetchMembersGroupCount } from '@/app/lib/data';

type Group = {
  id: string;
  name: string;
  pathname: string;
};

async function getMembersCount(group: Group) {
  const membersCount = await fetchMembersGroupCount(group.id);

  return {
    ...group,
    membersCount,
  };
}

export default async function GroupsTable() {
  let groups = await fetchGroups();

  const groupWithMembersCount = await Promise.all(
    /* @ts-ignore */
    groups.map((group) => getMembersCount(group)),
  );

  console.log(groupWithMembersCount);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="">
          <table className="min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Lp.
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Nazwa trasy
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Nazwa grupy
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Osób zgłoszonych
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {groupWithMembersCount?.map((group, idx) => (
                <tr
                  key={group.id}
                  className="w-full border-b border-black py-3 text-sm"
                >
                  <td className="whitespace-nowrap border border-black py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">{idx + 1}</div>
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    <p>{group.pathname}</p>
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    <p>{group.name}</p>
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {group.membersCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

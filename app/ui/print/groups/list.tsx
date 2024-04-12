import {
  fetchGroupsByPathId,
  fetchMembersGroupCount,
  fetchGroupChefByGroupId,
} from '@/app/lib/data';

type Group = {
  id: string;
  name: string;
  chef_group_phone_number: string;
  leaving_hour_id: string;
  path_id: string;
  leaving_hour: string;
};

async function getMembersCount(group: Group) {
  const membersCount = await fetchMembersGroupCount(group.id);

  return {
    ...group,
    membersCount,
  };
}

async function getGroupChefs(group: Group & { membersCount: string }) {
  const { name } = await fetchGroupChefByGroupId(group.id);

  return {
    ...group,
    groupChefName: name,
  };
}

export default async function GroupsTable({ id }: { id: string }) {
  let groups = await fetchGroupsByPathId(id);

  const groupWithMembersCount = await Promise.all(
    /* @ts-ignore */
    groups.map((group) => getMembersCount(group)),
  );
  const groupWithMembersCountAndGroupChef = await Promise.all(
    groupWithMembersCount.map((group) => getGroupChefs(group)),
  );

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
                  Nazwa grupy
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Kierownik grupy
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Telefon
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Godzina
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Wpisowe
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Osób zgłoszonych
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Osób na starcie
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Kwituję odbiór znaczków i opisu trasy
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {groupWithMembersCountAndGroupChef?.map((group, idx) => (
                <tr
                  key={group.id}
                  className="w-full border-b border-black py-3 text-sm"
                >
                  <td className="whitespace-nowrap border border-black py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">{idx + 1}</div>
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    <p>{group.name}</p>
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {group.groupChefName}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {group.chef_group_phone_number}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {group.leaving_hour}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {''}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {group.membersCount}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {''}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {''}
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

import { fetchGroups, fetchMembersGroup } from '@/app/lib/data';

type Group = {
  id: string;
  name: string;
  pathname: string;
};

async function getMembers(group: Group) {
  const members = await fetchMembersGroup(group.id);

  return {
    ...group,
    guardians: members.filter(
      (member) => member.is_guardian || member.guardian_name !== '',
    ),
  };
}

export default async function GuardiansTable() {
  let groups = await fetchGroups();

  const groupsWithMembers = await Promise.all(
    /* @ts-ignore */
    groups.map((group) => getMembers(group)),
  );

  const groupWithGuardians = groupsWithMembers.filter(
    (group) => group.guardians.length > 0,
  );

  return (
    <div className="mt-6 flow-root bg-gray-50">
      <div className="inline-block min-w-full align-middle">
        <div className="">
          <table className="min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Lp.
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Nazwa drużyny
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Nazwa trasy
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Opiekunowie
                </th>
              </tr>
            </thead>
            <tbody>
              {groupWithGuardians?.map((group, idx) => (
                <tr
                  key={group.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap border-solid py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">{idx + 1}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{group.name}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p>{group.pathname}</p>
                  </td>
                  <td className="px-3 py-3">
                    {group.guardians.map((member, idx) => {
                      return member.is_guardian ? (
                        <div key={idx}>
                          <span className="font-bold">{member.name}</span>
                        </div>
                      ) : (
                        <div key={idx}>
                          <span className="font-bold">
                            {member.guardian_name}
                          </span>{' '}
                          jest opiekunem{' '}
                          <span className="font-bold">{member.name}</span>
                        </div>
                      );
                    })}
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

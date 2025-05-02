import clsx from 'clsx';
import {
  fetchGroupsByPathId,
  fetchMembersGroup,
  fetchTransports,
  fetchLeavingHours,
} from '@/app/lib/data';

type Group = {
  id: string;
  name: string;
  chef_group_phone_number: string;
  leaving_hour_id: string;
  path_id: string;
  leaving_hour: string;
  submitting_person_email: string;
};

type Member = {
  id: string;
  is_group_chef: boolean;
  birthday_date: string;
  name: string;
  fee: number;
  pttk_card_number: string;
  shirt_size: string;
  shirt_type: string;
  transport_id: string;
  transport_name: string;
  transport_leaving_hour: string;
};

type ObjWithStringKeys = {
  [key: string]: string;
};

const TRANSPORT_FEE: number = 15;

async function getMembers(group: Group) {
  const [members, transports, leavingHours] = await Promise.all([
    fetchMembersGroup(group.id),
    fetchTransports(),
    fetchLeavingHours(),
  ]);

  const transportsObj: ObjWithStringKeys = transports.reduce(
    (result, tranportObj) => ({
      ...result,
      [tranportObj.id]: tranportObj.name,
    }),
    {},
  );

  const leavingHoursObj: ObjWithStringKeys = leavingHours.reduce(
    (result, tranportObj) => ({
      ...result,
      [tranportObj.id]: tranportObj.value,
    }),
    {},
  );

  return {
    ...group,
    members: members.map((member) => ({
      ...member,
      ...(member.transport_id
        ? {
            fee: (Number(member.fee) + TRANSPORT_FEE).toFixed(2),
            transport_name: transportsObj[member.transport_id],
            transport_leaving_hour:
              leavingHoursObj[member.transport_leaving_hour_id],
          }
        : {}),
    })),
  };
}

const Table = ({
  group,
}: {
  group: Group & {
    members: Member[];
  };
}) => {
  const feeSum = group.members.reduce(
    (sum, member) => sum + Number(member.fee),
    0,
  );

  return (
    <div className="mt-6 flow-root pb-8">
      <div className="inline-block min-w-full align-middle">
        <div className="">
          <h2 className="mx-4">
            <span className="font-bold">{group.name}</span> |{' '}
            {group.chef_group_phone_number} | {group.submitting_person_email} |
            Suma opłat: {feeSum} PLN
          </h2>

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
                  Data urodzenia
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Nr legitymacji PTTK
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Koszulka
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Transport
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Opłata
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {group.members?.map((member: Member, idx: number) => (
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
                    {member.birthday_date}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {member.pttk_card_number}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {member.shirt_type
                      ? `${member.shirt_type}, ${member.shirt_size}`
                      : ''}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {member.transport_id
                      ? `${member.transport_name}, ${member.transport_leaving_hour}`
                      : ''}
                  </td>
                  <td className="whitespace-nowrap border border-black px-3 py-3">
                    {member.fee}
                  </td>
                </tr>
              ))}
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

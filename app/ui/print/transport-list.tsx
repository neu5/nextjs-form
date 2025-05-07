import { fetchTransportPrint } from '@/app/lib/data';

export default async function GroupsTable() {
  const members = await fetchTransportPrint();

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
                  Imię i nazwisko
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Drużyna
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Transport na trasie
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Godzina transportu
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {members?.map((member, idx) => (
                <tr
                  key={member.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap border-solid py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">{idx + 1}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{member.name}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {group.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.transport_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {member.transport_leaving_hour_id}
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

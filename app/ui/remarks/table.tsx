import { fetchGroupRemarks } from '@/app/lib/data';

export default async function GroupsRemarksTable() {
  const groups = await fetchGroupRemarks();

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
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Treść uwagi
                </th>
              </tr>
            </thead>
            <tbody>
              {groups?.map((group, idx) => (
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
                  <td className="px-3 py-3">{group.submitting_person_email}</td>
                  <td className="px-3 py-3">{group.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// import Image from 'next/image';
import { fetchGroups } from '@/app/lib/data';
import { UpdateGroup, DeleteGroup } from '@/app/ui/groups/buttons';
// import { formatDateToLocal } from '@/app/lib/utils';

export default async function GroupsTable() {
  const groups = await fetchGroups();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {groups?.map((group) => (
              <div
                key={group.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{group.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{group.pathname}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>Utworzono - {group.creation_datetime}</p>
                  </div>
                  <div>
                    <p>Edytowano - {group.last_edition_datetime}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateGroup id={group.id} />
                    <DeleteGroup id={group.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nazwa grupy
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Trasa
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Utworzono
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ostatnia edycja
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {groups?.map((group) => (
                <tr
                  key={group.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{group.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {group.pathname}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {group.creation_datetime}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {group.last_edition_datetime}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateGroup id={group.id} />
                      <DeleteGroup id={group.id} />
                    </div>
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

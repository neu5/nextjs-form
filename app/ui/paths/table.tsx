import { fetchPaths } from '@/app/lib/data';
import { UpdatePath } from '@/app/ui/paths/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { getSortedPaths } from '@/app/lib/utils';

export default async function PathsTable() {
  const paths = await fetchPaths();

  const sortedPaths = getSortedPaths(paths);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {sortedPaths?.map((path) => (
              <div
                key={path.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{path.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{path.type}</p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>Kolejność - {path.path_order}</p>
                  </div>
                  <div>
                    <p>{formatDateToLocal(path.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdatePath id={path.id} />
                    {/* <DeleteInvoice id={invoice.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nazwa trasy
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Rodzaj trasy
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Kolejność
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Data dodania trasy
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paths?.map((path) => (
                <tr
                  key={path.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{path.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{path.type}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {path.path_order}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(path.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePath id={path.id} />
                      {/* <DeleteInvoice id={invoice.id} /> */}
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

import Image from 'next/image';
import { fetchPaths } from '@/app/lib/data';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import { formatDateToLocal } from '@/app/lib/utils';

export default async function PathsTable() {
  const paths = await fetchPaths();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {paths?.map((path) => (
              <div
                key={path.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{path.name}</p>
                    </div>
                    {/* <p className="text-sm text-gray-500">{invoice.email}</p> */}
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{formatDateToLocal(path.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} /> */}
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
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{path.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(path.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} /> */}
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

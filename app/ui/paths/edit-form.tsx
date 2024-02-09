'use client';

import { PathForm } from '@/app/lib/definitions';
import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updatePath } from '@/app/lib/actions/paths';

export default function EditPathForm({ path }: { path: PathForm }) {
  const updatePathWithId = updatePath.bind(null, path.id);

  return (
    <form action={updatePathWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Path Name */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={path.name}
                placeholder="Nazwa trasy"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <GlobeEuropeAfricaIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/paths"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Anuluj
        </Link>
        <Button type="submit">Edytuj trasę</Button>
      </div>
    </form>
  );
}

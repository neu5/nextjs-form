'use client';

import { useFormState } from 'react-dom';
import {
  OrganizersTable,
  ShirtsSizesList,
  ShirtsTypesList,
} from '@/app/lib/definitions';
import { TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateOrganizer } from '@/app/lib/actions/organizers';

export default function EditOrganizerForm({
  organizer,
  shirtsSizes,
  shirtsTypes,
}: {
  organizer: OrganizersTable;
  shirtsSizes: ShirtsSizesList[];
  shirtsTypes: ShirtsTypesList[];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateOrganizer, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <input type="hidden" name="id" value={organizer.id} />

        {/* Organizer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Organizator
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={organizer.name}
                placeholder="Imię i nazwisko"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <TrophyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Shirt type */}
        <div className="mb-4">
          <label
            htmlFor="shirt-type"
            className="mb-2 block text-sm font-medium"
          >
            Rodzaj koszulki
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id={`shirt-type`}
                name="shirtType"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="shirt-type-error"
              >
                <option value="">Wybierz rodzaj koszulki</option>
                {shirtsTypes.map(({ type }) => (
                  <option
                    key={type}
                    value={type}
                    selected={organizer.shirt_type === type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Shirt size */}
        <div className="mb-4">
          <label
            htmlFor="shirt-size"
            className="mb-2 block text-sm font-medium"
          >
            Rozmiar koszulki
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id={`shirt-size`}
                name="shirtSize"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="shirt-type-error"
              >
                <option value="">Wybierz rozmiar koszulki</option>
                {shirtsSizes.map(({ size }) => (
                  <option
                    key={size}
                    value={size}
                    selected={organizer.shirt_size === size}
                  >
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/organizers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Anuluj
        </Link>
        <Button type="submit">Zapisz zmiany</Button>
      </div>
    </form>
  );
}

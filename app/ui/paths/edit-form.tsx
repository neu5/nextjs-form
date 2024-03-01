'use client';

import { useFormState } from 'react-dom';
import { LeavingHoursForm, PathForm } from '@/app/lib/definitions';
import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updatePath } from '@/app/lib/actions/paths';

export default function EditPathForm({
  path,
  pathsTypes,
  leavingHours,
  pathLeavingHours,
}: {
  path: PathForm;
  pathsTypes: Array<{ type: string }>;
  leavingHours: Array<LeavingHoursForm>;
  pathLeavingHours: Array<string>;
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updatePath, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <input type="hidden" name="id" value={path.id} />
        {/* Path Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Zmień nazwę trasy
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={path.name}
                placeholder="Nazwa trasy"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <GlobeEuropeAfricaIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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

        {/* Path type */}
        <div className="mb-4">
          <label htmlFor="pathType" className="mb-2 block text-sm font-medium">
            Rodzaj trasy
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="pathType"
              name="pathType"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="">Wybierz rodzaj trasy</option>
              {pathsTypes.map(({ type }) => (
                <option key={type} value={type} selected={path.type === type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leaving hours */}
        <div className="mb-4">
          <label
            htmlFor="leavingHours"
            className="mb-2 block text-sm font-medium"
          >
            Godziny startu
          </label>
          <div className="relative mt-2 rounded-md">
            {leavingHours.map((leavingHour) => (
              <div key={leavingHour.id} className="relative mt-2">
                <input
                  id={leavingHour.id}
                  type="checkbox"
                  name="leavingHours"
                  value={leavingHour.id}
                  defaultChecked={pathLeavingHours.includes(leavingHour.id)}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />

                <label
                  htmlFor={leavingHour.id}
                  className="ml-2 cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  {leavingHour.value}
                </label>
              </div>
            ))}
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

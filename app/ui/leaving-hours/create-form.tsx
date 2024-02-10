'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createLeavingHour } from '@/app/lib/actions/leaving-hours';

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createLeavingHour, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Leaving hour */}
        <div className="mb-4">
          <label htmlFor="value" className="mb-2 block text-sm font-medium">
            Godzina startu
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="value"
                name="value"
                placeholder="Godzina startu"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                minLength={5}
                maxLength={5}
                required
                aria-describedby="value-error"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="value-error" aria-live="polite" aria-atomic="true">
              {state.errors?.value &&
                state.errors.value.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
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
        <Button type="submit">Dodaj godzinę startu</Button>
      </div>
    </form>
  );
}

'use client';

import { useFormState } from 'react-dom';
import { CustomerField } from '@/app/lib/definitions_TO_REMOVE/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FingerPrintIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createGroup } from '@/app/lib/actions/groups';

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createGroup, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Group Name */}
        <div className="mb-4">
          <label htmlFor="groupName" className="mb-2 block text-sm font-medium">
            Nazwa drużyny <span className="text-red-600">*</span> (min 2 znaki,
            max 180 znaków)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="groupName"
                name="groupName"
                placeholder="Nazwa drużyny"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                minLength={2}
                maxLength={180}
                required
                aria-describedby="group-name-error"
              />
              <FingerPrintIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="group-name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.groupName &&
                state.errors.groupName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex">
        <Button type="submit">Dodaj zgłoszenie</Button>
      </div>
    </form>
  );
}

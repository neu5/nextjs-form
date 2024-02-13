'use client';

import { useFormState } from 'react-dom';
import { useState } from 'react';
import { GroupForm } from '@/app/lib/definitions';
import {
  ClockIcon,
  GlobeEuropeAfricaIcon,
  FingerPrintIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createGroup } from '@/app/lib/actions/groups';

export default function Form({ paths }: { paths: GroupForm[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createGroup, initialState);

  const [pathId, setPathId] = useState('');

  let leavingHours = null;

  if (paths !== undefined && pathId !== '') {
    const path = paths.find((path) => path.id === pathId);

    if (path) {
      leavingHours = path.leavingHours;
    }
  }

  return (
    <form action={dispatch}>
      <h2 className="my-8 text-3xl font-bold">Dodaj zgłoszenie</h2>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Group Name */}
        <div className="mb-4">
          <label htmlFor="groupName" className="mb-2 block text-sm font-medium">
            <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Nazwa drużyny
            </span>{' '}
            (min 2 znaki, max 180 znaków)
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

        {/* Path Name */}
        <div className="mb-4">
          <label htmlFor="path" className="mb-2 block text-sm font-medium">
            <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Trasa
            </span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="path"
                name="pathId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="path-error"
                onChange={(event) => setPathId(event.target.value)}
              >
                <option value="" disabled>
                  Wybierz trasę
                </option>
                {paths.map((path) => (
                  <option key={path.id} value={path.id}>
                    {path.name}
                  </option>
                ))}
              </select>
              <GlobeEuropeAfricaIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="path-error" aria-live="polite" aria-atomic="true">
              {state.errors?.pathId &&
                state.errors.pathId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Path Name */}
        <div className="mb-4">
          <label
            htmlFor="leavingHour"
            className="mb-2 block text-sm font-medium"
          >
            <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Planowana godzina startu
            </span>
          </label>
          {leavingHours ? (
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <select
                  id="leavingHour"
                  name="leavingHourId"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultValue=""
                  aria-describedby="leaving-hour-error"
                >
                  <option value="" disabled>
                    Wybierz godzinę
                  </option>
                  {leavingHours.map((leavingHour) => (
                    <option key={leavingHour.id} value={leavingHour.id}>
                      {leavingHour.value}
                    </option>
                  ))}
                </select>
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          ) : (
            <div>Najpierw wybierz trasę</div>
          )}
        </div>
      </div>

      <div className="mt-6 flex">
        <Button type="submit">Dodaj zgłoszenie</Button>
      </div>
    </form>
  );
}

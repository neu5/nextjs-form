'use client';

import clsx from 'clsx';

import {
  AtSymbolIcon,
  ClockIcon,
  GlobeEuropeAfricaIcon,
  FingerPrintIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { GroupForm } from '@/app/lib/definitions';
import { GroupState } from '../../lib/actions/groups';

export default function GroupDetails({
  mode,
  leavingHours,
  group,
  paths,
  saveGroup,
  state,
}: {
  mode?: string;
  leavingHours: { id: string; value: string }[] | null;
  group: {
    chefGroupPhoneNumber: string;
    name: string;
    leavingHourId: string;
    isInstitution: string | boolean;
    pathId: string;
    submittingPersonEmail: string;
  };
  paths: GroupForm[];
  saveGroup: Function;
  state: GroupState;
}) {
  return (
    <>
      {/* Group Name */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
            Nazwa grupy
          </span>{' '}
          (min 2 znaki, max 255 znaków)
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="name"
              name="name"
              placeholder="Nazwa grupy"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              minLength={2}
              maxLength={255}
              value={group.name}
              onChange={(ev) =>
                saveGroup({
                  name: 'name',
                  value: ev.target.value,
                })
              }
              required
              aria-describedby="group-name-error"
            />
            <FingerPrintIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="group-name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
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
              aria-describedby="path-error"
              value={group.pathId}
              onChange={(ev) =>
                saveGroup({
                  name: 'pathId',
                  value: ev.target.value,
                })
              }
            >
              <option value="" disabled>
                Wybierz trasę
              </option>
              {paths.map((path) => (
                <option key={path.id} value={path.id}>
                  {path.name} {path.type ? `(${path.type})` : ''}
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

      {/* Leaving Hour */}
      <div className="mb-4">
        <label htmlFor="leavingHour" className="mb-2 block text-sm font-medium">
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
                aria-describedby="leaving-hour-error"
                value={group.leavingHourId}
                onChange={(ev) =>
                  saveGroup({
                    name: 'leavingHourId',
                    value: ev.target.value,
                  })
                }
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
            <div id="leaving-hour-error" aria-live="polite" aria-atomic="true">
              {state.errors?.leavingHourId &&
                state.errors.leavingHourId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        ) : (
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="text"
                disabled
                placeholder="Najpierw wybierz trasę"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        )}
      </div>

      {/* Is group from intitution */}
      <div className="my-8">
        <label className="mb-2 block flex text-sm font-medium">
          <input
            name="isInstitution"
            id="isInstitution"
            className="peer mr-4 block border border-gray-200 text-sm placeholder:text-gray-500"
            type="checkbox"
            checked={!!group.isInstitution}
            onChange={(ev) =>
              saveGroup({
                name: 'isInstitution',
                value: ev.target.checked ? 'true' : '',
              })
            }
          />
          <span>Czy grupa jest z intytucji (np. szkoły)?</span>
        </label>
        <span className="text-xs">
          W przypadku grup np. szkolnych 1 opiekun na 10 niepełnoletnich nie
          płaci.
        </span>
      </div>

      {/* Submitting Person Email */}
      <div className="mb-4">
        <label
          htmlFor="submittingPersonEmail"
          className="mb-2 block text-sm font-medium"
        >
          <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
            Adres e-mail osoby zgłaszającej (do kontaktu ze zgłoszoną grupą)
          </span>
        </label>
        <span className="text-xs">
          Na podany adres e-mail wyślemy potwierdzenie zgłoszenia grupy oraz
          dane do logowania do edycji zgłoszonej grupy.
        </span>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="submittingPersonEmail"
              name="submittingPersonEmail"
              placeholder="Adres email"
              className={clsx(
                'peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500',
                {
                  'opacity-50': mode === 'EDIT',
                },
              )}
              type="email"
              readOnly={mode === 'EDIT'}
              maxLength={100}
              value={group.submittingPersonEmail}
              onChange={(ev) =>
                saveGroup({
                  name: 'submittingPersonEmail',
                  value: ev.target.value,
                })
              }
              required
              aria-describedby="group-submitting-person-email-error"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id="group-submitting-person-email-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.submittingPersonEmail &&
              state.errors.submittingPersonEmail.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Group chef phone number */}
      <div className="mb-4">
        <label
          htmlFor="chefGroupPhoneNumber"
          className="mb-2 block text-sm font-medium"
        >
          <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
            Numer telefonu <span className="font-bold">kierownika grupy</span>
          </span>
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="chefGroupPhoneNumber"
              name="chefGroupPhoneNumber"
              placeholder="Numer telefonu"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              type="tel"
              minLength={5}
              maxLength={20}
              value={group.chefGroupPhoneNumber}
              onChange={(ev) =>
                saveGroup({
                  name: 'chefGroupPhoneNumber',
                  value: ev.target.value,
                })
              }
              required
              aria-describedby="group-chef-phone-number-error"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id="group-chef-phone-number-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.chefGroupPhoneNumber &&
              state.errors.chefGroupPhoneNumber.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

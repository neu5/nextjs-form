'use client';

import { useState } from 'react';
import {
  CalendarDaysIcon,
  CreditCardIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { GroupState } from '@/app/lib/actions/groups';
import { Button, BUTTON_KINDS } from '@/app/ui/button';

export default function GroupMember({
  memberNumber,
  removeMember,
  saveMember,
  state,
}: {
  memberNumber: number;
  removeMember: (num: number) => void;
  saveMember: ({
    name,
    memberNumber,
    value,
  }: {
    name: string;
    memberNumber: number;
    value: string;
  }) => void;
  state: GroupState;
}) {
  const [groupChief, setGroupChief] = useState('');

  return (
    <div className="mb-8">
      {/* Member Name */}
      <div className="mb-4 mt-4">
        <label htmlFor="memberName" className="mb-2 block text-sm font-medium">
          <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
            Imię i nazwisko ({memberNumber})
          </span>
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id={`memberName-${memberNumber}`}
              name="memberName"
              placeholder="Imię i nazwisko"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              type="text"
              minLength={5}
              maxLength={20}
              onChange={(ev) =>
                saveMember({
                  name: 'memberName',
                  memberNumber,
                  value: ev.target.value,
                })
              }
              required
              aria-describedby={`group-member-name-${memberNumber}-error`}
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id={`group-member-name-${memberNumber}-error`}
            aria-live="polite"
            aria-atomic="true"
          >
            {/* {state.errors?.memberName[memberNumber] &&
              state.errors.memberName[memberNumber].map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
          </div>
        </div>
      </div>
      {/* Member Birthday date */}
      <div className="mb-4">
        <label
          htmlFor="submittingPersonPhoneNumber"
          className="mb-2 block text-sm font-medium"
        >
          <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
            Data urodzenia
          </span>
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="submittingPersonPhoneNumber"
              name="submittingPersonPhoneNumber"
              placeholder="DD.MM.RRRR"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              type="date"
              required
              aria-describedby="group-submitting-person-phone-number-error"
            />
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id="group-submitting-person-phone-number-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.submittingPersonPhoneNumber &&
              state.errors.submittingPersonPhoneNumber.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      {/* Member Name */}
      <div className="mb-4 mt-4">
        <label
          htmlFor="submittingPersonPhoneNumber"
          className="mb-2 block text-sm font-medium"
        >
          <span className="after:ml-0.5 after:text-red-500">
            Nr legitymacji PTTK (tylko jeśli uczestnik posiada ważną
            legitymację)
          </span>
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="submittingPersonPhoneNumber"
              name="submittingPersonPhoneNumber"
              placeholder="Numer legitymacji PTTK"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              type="text"
              minLength={6}
              maxLength={6}
              aria-describedby="group-submitting-person-phone-number-error"
            />
            <CreditCardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id="group-submitting-person-phone-number-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.submittingPersonPhoneNumber &&
              state.errors.submittingPersonPhoneNumber.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      {/* Group chef */}
      <div className="mb-4 mt-4">
        <label className="mb-2 block flex text-sm font-medium">
          <input
            name="groupChef"
            className="peer mr-4 block border border-gray-200 text-sm placeholder:text-gray-500"
            // onChange={(event) =>
            //   setGroupChief(event.target.checked ? event.target.value : '')
            // }
            // value={5}
            type="radio"
            aria-describedby="group-submitting-person-phone-number-error"
          />
          <span className="after:ml-0.5 after:text-red-500">
            Ten uczestnik jest{' '}
            <strong className="font-bold">kierownikiem</strong> grupy
          </span>
        </label>
      </div>
      {/* Group chef phone number */}
      {groupChief && (
        <div className="mb-4">
          <label
            htmlFor="submittingPersonPhoneNumber"
            className="mb-2 block text-sm font-medium"
          >
            <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Numer telefonu
            </span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="submittingPersonPhoneNumber"
                name="submittingPersonPhoneNumber"
                placeholder="Numer telefonu"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="tel"
                minLength={5}
                maxLength={20}
                required
                aria-describedby="group-submitting-person-phone-number-error"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div
              id="group-submitting-person-phone-number-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors?.submittingPersonPhoneNumber &&
                state.errors.submittingPersonPhoneNumber.map(
                  (error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ),
                )}
            </div>
          </div>
        </div>
      )}
      <Button
        type="button"
        kind={BUTTON_KINDS.REMOVE}
        onClick={() => removeMember(memberNumber)}
      >
        Usuń uczestnika ({memberNumber})
      </Button>
    </div>
  );
}

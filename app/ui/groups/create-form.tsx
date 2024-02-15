'use client';

import { useFormState } from 'react-dom';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { GroupForm } from '@/app/lib/definitions';
import {
  AtSymbolIcon,
  ClockIcon,
  GlobeEuropeAfricaIcon,
  FingerPrintIcon,
} from '@heroicons/react/24/outline';
import { Button, BUTTON_KINDS } from '@/app/ui/button';
import { createGroup } from '@/app/lib/actions/groups';
import GroupMember from './group-member';

export default function Form({ paths }: { paths: GroupForm[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createGroup, initialState);

  const [pathId, setPathId] = useState('');
  const [groupMembers, setGroupMembers] = useState([
    { memberName: '', number: 1 },
  ]);

  let leavingHours = null;

  if (paths !== undefined && pathId !== '') {
    const path = paths.find((path) => path.id === pathId);

    if (path) {
      leavingHours = path.leavingHours;
    }
  }

  const saveMember = useDebouncedCallback(({ name, memberNumber, value }) => {
    console.log({ name, memberNumber, value });

    setGroupMembers(
      groupMembers.map((member) => ({
        ...member,
        ...(member.number === memberNumber
          ? {
              [name]: value,
            }
          : {}),
      })),
    );

    setTimeout(() => {
      console.log('saveMember', { groupMembers });
    }, 1000);
  }, 300);

  const addGroupMember = (number: number) => {
    if (groupMembers.length >= 10) {
      console.log(
        'Nie można dodać więcej niż 100 uczestników do jednej grupy.',
      );

      return;
    }

    setGroupMembers([...groupMembers, { number }]);
    setTimeout(() => {
      console.log('dodanie', { groupMembers });
    }, 500);
  };

  const removeMember = (memberNumber: number) => {
    if (groupMembers.length <= 1) {
      console.log('Nie można usunąć uczestnika.');

      return;
    }

    console.log({ groupMembers, memberNumber });

    const newGroupMembers = groupMembers.filter((groupMember) => {
      return groupMember.number !== memberNumber;
    });

    console.log({ newGroupMembers });

    setGroupMembers([...newGroupMembers]);

    setTimeout(() => {
      console.log('usuwanie', { groupMembers });
    }, 500);
  };

  return (
    <form action={dispatch}>
      <h2 className="my-8 text-3xl font-bold">Dodaj zgłoszenie</h2>
      <div className="rounded-md bg-gray-50 p-1 md:p-4 md:p-6">
        {/* Group Name */}
        <div className="mb-4">
          <label htmlFor="groupName" className="mb-2 block text-sm font-medium">
            <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Nazwa drużyny
            </span>{' '}
            (min 2 znaki, max 255 znaków)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="groupName"
                name="groupName"
                placeholder="Nazwa drużyny"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                minLength={2}
                maxLength={255}
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

        {/* Leaving Hour */}
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
              <div
                id="leaving-hour-error"
                aria-live="polite"
                aria-atomic="true"
              >
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
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="email"
                maxLength={100}
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

        {/* Adding Group Members */}
        <div className="mb-4 rounded-md bg-gray-100 p-1 md:p-4">
          <h3>Dodaj uczestników grupy ({groupMembers.length})</h3>
          {groupMembers.map((groupMember, i) => {
            return (
              <GroupMember
                key={`group-member-${i}`}
                memberNumber={i + 1}
                removeMember={removeMember}
                saveMember={saveMember}
                state={state}
              />
            );
          })}
          <Button
            type="button"
            kind={BUTTON_KINDS.ADD}
            onClick={() => addGroupMember(groupMembers.length + 1)}
          >
            Dodaj uczestnika
          </Button>
        </div>
      </div>

      <div className="mt-6 flex">
        <Button>Dodaj zgłoszenie</Button>
      </div>
    </form>
  );
}

'use client';

import { useFormState } from 'react-dom';
import { FormEvent, useEffect, useState } from 'react';
import { useThrottledCallback } from 'use-debounce';
import { GroupForm } from '@/app/lib/definitions';
import {
  AtSymbolIcon,
  ClockIcon,
  GlobeEuropeAfricaIcon,
  FingerPrintIcon,
} from '@heroicons/react/24/outline';
import { Button, BUTTON_KINDS } from '@/app/ui/button';
import { createGroup } from '@/app/lib/actions/groups';
import GroupMember, { Member } from './group-member';

let memberId = 0;
const MAX_MEMBERS_NUM = 2;

const getMemberId = () => {
  memberId += 1;
  return `member-${memberId}`;
};

const getMemberDefault = () => ({
  id: getMemberId(),
  name: '',
  birthdayDate: '',
  PTTKCardNumber: '',
});

const getGroupDefault = () => ({
  name: '',
  pathId: '',
  leavingHourId: '',
  submittingPersonEmail: '',
  members: [getMemberDefault()],
});

export default function Form({ paths }: { paths: GroupForm[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createGroup, initialState);

  // const [pathId, setPathId] = useState('');
  const [group, setGroup] = useState(getGroupDefault());

  let leavingHours = null;

  if (paths !== undefined && group.pathId !== '') {
    const path = paths.find((path) => path.id === group.pathId);

    if (path) {
      leavingHours = path.leavingHours;
    }
  }

  const addMember = (data = {}) => {
    if (group.members.length >= MAX_MEMBERS_NUM) {
      console.log(
        `Nie można dodać więcej niż ${MAX_MEMBERS_NUM} uczestników do jednej grupy.`,
      );
      return;
    }

    setGroup({ ...group, members: [...group.members, getMemberDefault()] });
  };

  const saveGroup = ({ name, value }: { name: string; value: string }) => {
    setGroup({
      ...group,
      [name]: value,
    });
  };

  const saveMember = ({
    id,
    name,
    value,
  }: {
    name: string;
    id: string;
    value: string;
  }) => {
    setGroup({
      ...group,
      members: group.members.map((member) => ({
        ...member,
        ...(member.id === id
          ? {
              [name]: value,
            }
          : {}),
      })),
    });
  };

  const removeMember = (id: string) => {
    setGroup({
      ...group,
      members: group.members.reduce((result: Array<Member>, member) => {
        if (member.id !== id) {
          result.push(member);
        }
        return result;
      }, []),
    });
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData();

    formData.append('name', group.name);
    formData.append('pathId', group.pathId);
    formData.append('leavingHourId', group.leavingHourId);
    formData.append('submittingPersonEmail', group.submittingPersonEmail);

    group.members.forEach((member) => {
      formData.append('members', JSON.stringify(member));
    });

    dispatch(formData);
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="my-8 text-3xl font-bold">Dodaj zgłoszenie</h2>
      <div className="rounded-md bg-gray-50 p-1 md:p-4 md:p-6">
        {/* Group Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Nazwa drużyny
            </span>{' '}
            (min 2 znaki, max 255 znaków)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                placeholder="Nazwa drużyny"
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
                // required
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
                value={group.submittingPersonEmail}
                onChange={(ev) =>
                  saveGroup({
                    name: 'submittingPersonEmail',
                    value: ev.target.value,
                  })
                }
                // required
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
          <h3>Dodaj uczestników grupy ({group.members.length})</h3>
          {group.members.map((member, i) => (
            <GroupMember
              key={`group-member-${i}`}
              memberNumber={i + 1}
              removeMember={removeMember}
              saveMember={saveMember}
              member={member}
              memberErrors={state.errors?.members?.reduce(
                (result, membersErrors) => {
                  const error = JSON.parse(membersErrors);

                  if (error.id === member.id) {
                    Object.assign(result, {
                      [error.field]: [error.message],
                    });
                  }

                  return result;
                },
                {},
              )}
            />
          ))}
          <Button
            type="button"
            kind={BUTTON_KINDS.ADD}
            onClick={() => addMember()}
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

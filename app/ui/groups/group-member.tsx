'use client';

import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button, BUTTON_KINDS } from '@/app/ui/button';

export type Member = {
  id: string;
  name: string;
  birthdayDate: string;
  PTTKCardNumber: string;
  chefGroupId: string;
  shirtType: string;
  shirtSize: string;
};

export default function GroupMember({
  member,
  memberNumber,
  removeMember,
  saveMember,
  shirtsSizes,
  shirtsTypes,
  memberErrors,
}: {
  member: Member;
  memberNumber: number;
  removeMember: Function;
  saveMember: Function;
  shirtsSizes: Array<{ id: string; value: string }>;
  shirtsTypes: Array<{ id: string; value: string }>;
  memberErrors: any;
}) {
  const { id, name, birthdayDate, PTTKCardNumber, shirtType, shirtSize } =
    member;

  return (
    <div className="mb-8">
      {/* Member Name */}
      <div className="mb-4 mt-4">
        <label
          htmlFor={`name-${id}`}
          className="mb-2 block text-sm font-medium"
        >
          <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
            Imię i nazwisko ({memberNumber})
          </span>
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id={`name-${id}`}
              name="name"
              placeholder="Imię i nazwisko"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              type="text"
              // minLength={5}
              // maxLength={20}
              value={name}
              onChange={(ev) =>
                saveMember({
                  id,
                  name: 'name',
                  value: ev.target.value,
                })
              }
              // required
              aria-describedby={`group-member-name-${id}-error`}
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id={`group-member-name-${id}-error`}
            aria-live="polite"
            aria-atomic="true"
          >
            {memberErrors?.name &&
              memberErrors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Member Birthday date */}
      <div className="mb-4">
        <label
          htmlFor={`birthday-${id}`}
          className="mb-2 block text-sm font-medium"
        >
          <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
            Data urodzenia
          </span>
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id={`birthday-${id}`}
              name="birthdayDate"
              placeholder="DD.MM.RRRR"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              type="date"
              value={birthdayDate}
              onChange={(ev) =>
                saveMember({
                  id,
                  name: 'birthdayDate',
                  value: ev.target.value,
                })
              }
              // required
              aria-describedby={`group-member-birthday-date-${id}-error`}
            />
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id={`group-member-birthday-date-${id}-error`}
            aria-live="polite"
            aria-atomic="true"
          >
            {memberErrors?.birthdayDate &&
              memberErrors.birthdayDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Member PTTK card */}
      <div className="mb-4 mt-4">
        <label
          htmlFor={`PTTKCardNumber-${id}`}
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
              id={`PTTKCardNumber-${id}`}
              name="PTTKCardNumber"
              placeholder="Numer legitymacji PTTK"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              type="text"
              minLength={6}
              maxLength={6}
              value={PTTKCardNumber}
              onChange={(ev) =>
                saveMember({
                  id,
                  name: 'PTTKCardNumber',
                  value: ev.target.value,
                })
              }
              aria-describedby="group-pttk-card-number-error"
            />
            <CreditCardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id="group-pttk-card-number-error"
            aria-live="polite"
            aria-atomic="true"
          ></div>
        </div>
      </div>

      {/* Shirt type */}
      <div className="mb-4 mt-4">
        <label
          htmlFor={`shirt-type-${id}`}
          className="mb-2 block text-sm font-medium"
        >
          <span className="after:ml-0.5 after:text-red-500">
            Rodzaj koszulki
          </span>
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <select
              id={`shirt-type-${id}`}
              name="shirtType"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="shirt-type-error"
              value={shirtType}
              onChange={(ev) =>
                saveMember({
                  id,
                  name: 'shirtType',
                  value: ev.target.value,
                })
              }
            >
              <option value="">Wybierz rodzaj koszulki</option>
              {shirtsTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shirt size */}
      <div className="mb-4 mt-4">
        <label
          htmlFor={`shirt-size-${id}`}
          className="mb-2 block text-sm font-medium"
        >
          <span className="after:ml-0.5 after:text-red-500">
            Rozmiar koszulki
          </span>
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <select
              id={`shirt-type-${id}`}
              name="shirtSize"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="shirt-type-error"
              value={shirtSize}
              onChange={(ev) =>
                saveMember({
                  id,
                  name: 'shirtSize',
                  value: ev.target.value,
                })
              }
            >
              <option value="">Wybierz rozmiar koszulki</option>
              {shirtsSizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Group chef */}
      <div className="mb-4 mt-4">
        <label className="mb-2 block flex text-sm font-medium">
          <input
            name="chefGroupId"
            className="peer mr-4 block border border-gray-200 text-sm placeholder:text-gray-500"
            value={id}
            onChange={() =>
              saveMember({
                id,
                name: 'chefGroupId',
                value: id,
              })
            }
            type="radio"
          />
          <span className="after:ml-0.5 after:text-red-500">
            Ten uczestnik jest{' '}
            <strong className="font-bold">kierownikiem</strong> grupy
          </span>
        </label>
      </div>
      <Button
        type="button"
        kind={BUTTON_KINDS.REMOVE}
        onClick={() => removeMember(id)}
      >
        Usuń uczestnika ({memberNumber})
      </Button>
    </div>
  );
}

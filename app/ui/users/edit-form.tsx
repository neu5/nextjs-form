'use client';

import { useFormState } from 'react-dom';
import { User } from '@/app/lib/definitions';
import { AtSymbolIcon, KeyIcon, ScaleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateUser } from '@/app/lib/actions/users';

export default function EditUsersForm({
  loggedUserRole,
  user,
}: {
  loggedUserRole: 'user' | 'admin';
  user: User;
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateUser, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <input type="hidden" name="id" value={user.id} />
        {loggedUserRole === 'user' ? (
          <input type="hidden" name="role" value={user.role} />
        ) : null}

        {/* User Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Adres email (login)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                defaultValue={user.email}
                placeholder="Imię i nazwisko"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm opacity-50 outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
                readOnly={true}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* User Role */}
        {loggedUserRole === 'admin' && (
          <div className="mb-4">
            <label htmlFor="role" className="mb-2 block text-sm font-medium">
              Rola użytkownika (user | admin)
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  defaultValue={user.role}
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="role-error"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        )}

        {/* Users name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nazwa (opcjonalnie)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                placeholder="Nazwa"
                defaultValue={user.name}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                maxLength={200}
                aria-describedby="name-error"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Hasło
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                placeholder="Hasło"
                type="password"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                maxLength={200}
                aria-describedby="password-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Password Confirmation */}
        <div className="mb-4">
          <label
            htmlFor="passwordConfirmation"
            className="mb-2 block text-sm font-medium"
          >
            Powtórz hasło
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                placeholder="Powtórz hasło"
                type="password"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                maxLength={200}
                aria-describedby="password-confirmation-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div
              id="password-confirmation-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors?.passwordConfirmation &&
                state.errors.passwordConfirmation.map((error: string) => (
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
          href="/dashboard/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Anuluj
        </Link>
        <Button type="submit">Zapisz zmiany</Button>
      </div>
    </form>
  );
}

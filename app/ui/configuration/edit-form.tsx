'use client';

import { useFormState } from 'react-dom';
import { Configuration } from '@/app/lib/definitions';
import Link from 'next/link';
import clsx from 'clsx';
import { Button } from '@/app/ui/button';
import { IS_TRANSPORTATION_ENABLED } from '@/app/lib/utils';
import { updateConfiguration } from '@/app/lib/actions/configuration';

export default function EditConfigurationForm({
  configuration,
}: {
  configuration: Configuration;
}) {
  const initialState = { message: null, errors: {} };
  // eslint-disable-next-line
  const [state, dispatch] = useFormState(updateConfiguration, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Is form enabled */}
        <div className="mb-4">
          <label className="inline-flex cursor-pointer items-center">
            <input
              id="isFormEnabled"
              name="isFormEnabled"
              type="checkbox"
              defaultChecked={configuration.is_form_enabled}
              className="peer sr-only"
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
            <span className="ms-3 text-sm font-medium">
              Czy formularz jest dostępny?
            </span>
          </label>
        </div>

        {/* Editing for users */}
        <div className="mb-4">
          <label className="inline-flex cursor-pointer items-center">
            <input
              id="isEditingForUsersEnabled"
              name="isEditingForUsersEnabled"
              type="checkbox"
              defaultChecked={configuration.is_editing_for_users_enabled}
              className="peer sr-only"
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
            <span className="ms-3 text-sm font-medium">
              Czy użytkownicy mogą edytować grupy?
            </span>
          </label>
        </div>

        {/* Mailing */}
        <div className="mb-4">
          <label className="inline-flex cursor-pointer items-center">
            <input
              id="isMailingEnabled"
              name="isMailingEnabled"
              type="checkbox"
              defaultChecked={configuration.is_mailing_enabled}
              className="peer sr-only"
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
            <span className="ms-3 text-sm font-medium">
              Czy wysyłanie maili jest włączone? (aktualnie to nic nie zmienia)
            </span>
          </label>
        </div>

        {/* Ordering shirts */}
        <div className="mb-4">
          <label className="inline-flex cursor-pointer items-center">
            <input
              id="isOrderingShirtsEnabled"
              name="isOrderingShirtsEnabled"
              type="checkbox"
              defaultChecked={configuration.is_ordering_shirts_enabled}
              className="peer sr-only"
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
            <span className="ms-3 text-sm font-medium">
              Czy zamawianie koszulek jest włączone?
            </span>
          </label>
        </div>

        {/* Ordering transportation */}
        <div className="mb-4">
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              defaultChecked={IS_TRANSPORTATION_ENABLED}
              className="peer sr-only"
              disabled
            />
            <div
              className={clsx(
                "peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full",
                {
                  'peer-checked:bg-blue-200 peer-checked:after:translate-x-full peer-checked:after:border-white':
                    IS_TRANSPORTATION_ENABLED,
                },
              )}
            ></div>
            <span className="ms-3 text-sm font-medium">
              Czy transport jest włączony?
            </span>
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Anuluj
        </Link>
        <Button type="submit">Zapisz zmiany</Button>
      </div>
    </form>
  );
}

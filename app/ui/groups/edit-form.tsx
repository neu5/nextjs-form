'use client';

import { useFormState } from 'react-dom';
import { FormEvent, useState } from 'react';
import { GroupForm } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateGroup } from '@/app/lib/actions/groups';
import GroupDetails from './group-details';

export default function EditPathForm({
  fetchedGroup,
  paths,
}: {
  fetchedGroup: any;
  paths: GroupForm[];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateGroup, initialState);

  const {
    id,
    chef_group_phone_number,
    is_institution,
    leaving_hour_id,
    name,
    path_id,
    remarks,
    submitting_person_email,
  } = fetchedGroup[0];

  const [group, setGroup] = useState({
    chefGroupPhoneNumber: chef_group_phone_number,
    isInstitution: is_institution,
    leavingHourId: leaving_hour_id,
    name,
    pathId: path_id,
    remarks,
    submittingPersonEmail: submitting_person_email,
  });

  let leavingHours = null;

  if (paths !== undefined && group.pathId !== '') {
    const path = paths.find((path) => path.id === group.pathId);

    if (path) {
      leavingHours = path.leavingHours;
    }
  }

  const saveGroup = ({ name, value }: { name: string; value: string }) => {
    setGroup({
      ...group,
      [name]: value,
    });
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData();

    formData.append('id', id);
    formData.append('name', group.name);
    formData.append('pathId', group.pathId);
    formData.append('leavingHourId', group.leavingHourId);
    formData.append('submittingPersonEmail', group.submittingPersonEmail);
    formData.append('chefGroupPhoneNumber', group.chefGroupPhoneNumber);
    formData.append('remarks', group.remarks);
    formData.append('isInstitution', group.isInstitution);

    // group.members.forEach((member) => {
    //   formData.append('members', JSON.stringify(member));
    // });

    dispatch(formData);
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <input type="hidden" name="id" value={id} />

        <GroupDetails
          leavingHours={leavingHours}
          group={group}
          paths={paths}
          state={state}
          saveGroup={saveGroup}
        />

        {/* Group Remarks */}
        <div className="mb-4">
          <label htmlFor="remarks" className="mb-2 block text-sm font-medium">
            Dodatkowe uwagi
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="remarks"
                name="remarks"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                value={group.remarks}
                maxLength={1000}
                aria-describedby="group-remarks-error"
                onChange={(ev) =>
                  saveGroup({
                    name: 'remarks',
                    value: ev.target.value,
                  })
                }
              ></textarea>
            </div>
            <div id="group-remarks-error" aria-live="polite" aria-atomic="true">
              {state.errors?.remarks &&
                state.errors.remarks.map((error: string) => (
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
          href="/dashboard/groups"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Anuluj
        </Link>
        <Button type="submit">Edytuj grupę</Button>
      </div>
    </form>
  );
}

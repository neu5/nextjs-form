'use client';

import { useFormState } from 'react-dom';
import { FormEvent, useState, useEffect } from 'react';
import {
  GroupForm,
  ShirtsSizesList,
  ShirtsTypesList,
} from '@/app/lib/definitions';
import Link from 'next/link';
import { Button, BUTTON_KINDS } from '@/app/ui/button';
import { updateGroup } from '@/app/lib/actions/groups';
import { isAdult } from '@/app/lib/utils';
import GroupDetails from './group-details';
import GroupMember, { Member } from './group-member';
import { MAX_MEMBERS_NUM, getMemberDefault, getMemberId } from './utils';

let wasSubmitClicked = false;
const mode = 'EDIT';

export default function EditGroupForm({
  fetchedGroup,
  paths,
  shirtsSizes,
  shirtsTypes,
  transports,
  isEditingForUsersEnabled,
  isShirtOrderingEnabled,
  loggedUserRole,
}: {
  fetchedGroup: any;
  paths: GroupForm[];
  shirtsSizes: ShirtsSizesList[];
  shirtsTypes: ShirtsTypesList[];
  transports: Array<{
    id: string;
    name: string;
    leavingHours: Array<{ id: string; value: string }>;
  }>;
  isEditingForUsersEnabled: boolean;
  isShirtOrderingEnabled: boolean;
  loggedUserRole: 'user' | 'admin';
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateGroup, initialState);
  const [isTooManyMembers, setTooManyMembersError] = useState(false);

  const {
    id,
    chef_group_phone_number,
    is_institution,
    is_skkt_starachowice,
    leaving_hour_id,
    name,
    path_id,
    remarks,
    submitting_person_email,
  } = fetchedGroup[0];

  const [group, setGroup] = useState({
    chefGroupPhoneNumber: chef_group_phone_number,
    isInstitution: is_institution ? 'true' : '',
    isSKKTStarachowice: is_skkt_starachowice ? 'true' : '',
    leavingHourId: leaving_hour_id,
    name,
    pathId: path_id,
    remarks,
    submittingPersonEmail: submitting_person_email,
    members: fetchedGroup.map(
      ({
        birthday_date,
        fee,
        guardian_name,
        is_group_chef,
        is_guardian,
        member_name,
        pttk_card_number,
        shirt_size,
        shirt_type,
        transport_id,
        transport_leaving_hour_id,
      }: {
        birthday_date: string;
        fee: string;
        guardian_name: string;
        is_group_chef: boolean;
        is_guardian: string;
        member_name: string;
        pttk_card_number: string;
        shirt_size: string;
        shirt_type: string;
        transport_id: string;
        transport_leaving_hour_id: string;
      }) => {
        const memberId = getMemberId();

        return {
          birthdayDate: birthday_date,
          fee,
          chefGroupId: is_group_chef ? memberId : '',
          guardianName: guardian_name,
          id: memberId,
          isAdult: isAdult({ birthDate: birthday_date }),
          isGuardian: is_guardian ? 'true' : '',
          name: member_name,
          PTTKCardNumber: pttk_card_number,
          shirtSize: shirt_size,
          shirtType: shirt_type,
          transportId: transport_id,
          transportLeavingHourId: transport_leaving_hour_id,
        };
      },
    ),
  });

  let leavingHours = null;

  if (paths !== undefined && group.pathId !== '') {
    const path = paths.find((path) => path.id === group.pathId);

    if (path) {
      leavingHours = path.leavingHours;
    }
  }

  const addMember = () => {
    if (group.members.length >= MAX_MEMBERS_NUM) {
      setTooManyMembersError(true);

      return;
    }

    setTooManyMembersError(false);
    setGroup({ ...group, members: [...group.members, getMemberDefault()] });
  };

  const saveGroup = ({ name, value }: { name: string; value: string }) => {
    setTooManyMembersError(false);
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
    setTooManyMembersError(false);
    setGroup({
      ...group,
      members: group.members
        .map((member: Member) => ({
          ...member,
          ...(name === 'chefGroupId'
            ? {
                chefGroupId: '',
              }
            : {}),
        }))
        .map((member: Member) => ({
          ...member,
          ...(member.id === id
            ? {
                [name]: value,
                ...(name === 'transportId'
                  ? {
                      transportLeavingHourId: '',
                    }
                  : {}),
                ...(name === 'birthdayDate'
                  ? {
                      isGuardian: '',
                      isAdult: isAdult({ birthDate: value }),
                    }
                  : {}),
              }
            : {}),
        })),
    });
  };

  const removeMember = (id: string) => {
    setTooManyMembersError(false);
    setGroup({
      ...group,
      members: group.members.reduce((result: Array<Member>, member: Member) => {
        if (member.id !== id) {
          result.push(member);
        }
        return result;
      }, []),
    });
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    wasSubmitClicked = true;

    const formData = new FormData();

    formData.append('id', id);
    formData.append('name', group.name);
    formData.append('pathId', group.pathId);
    formData.append('leavingHourId', group.leavingHourId);
    formData.append('submittingPersonEmail', group.submittingPersonEmail);
    formData.append('chefGroupPhoneNumber', group.chefGroupPhoneNumber);
    formData.append('remarks', group.remarks);
    formData.append('isInstitution', group.isInstitution);
    formData.append('isSKKTStarachowice', group.isSKKTStarachowice);

    group.members.forEach((member: Member) => {
      formData.append('members', JSON.stringify(member));
    });

    dispatch(formData);
  }

  const formErrors = state.errors?.members?.reduce(
    (result: Array<string>, membersErrors) => {
      const error = JSON.parse(membersErrors);

      if (error.field === 'chefGroupId') {
        result.push(error.message);
      }

      return result;
    },
    [],
  );

  if (
    (wasSubmitClicked && state.errors && Object.keys(state.errors).length) ||
    isTooManyMembers
  ) {
    wasSubmitClicked = false;

    setTimeout(() => {
      const main = document.getElementsByTagName('main');
      const errorsElements = main[0].getElementsByClassName('text-red-500');

      if (errorsElements.length || isTooManyMembers) {
        errorsElements[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 500);
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (ev: Event) => {
    ev.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <input type="hidden" name="id" value={id} />

        {!isEditingForUsersEnabled && (
          <div className="mb-4 rounded-md bg-red-200 p-3">
            Obecnie edycja danych grupy jest{' '}
            <span className="font-bold">wyłączona. 🚫</span>
          </div>
        )}
        {!isEditingForUsersEnabled && loggedUserRole === 'admin' && (
          <div className="mb-4 rounded-md bg-blue-200 p-3">
            Ale jesteś <span className="font-bold">🦸 adminem</span>, więc
            możesz edytować.
          </div>
        )}

        <GroupDetails
          mode={mode}
          group={group}
          leavingHours={leavingHours}
          paths={paths}
          state={state}
          saveGroup={saveGroup}
        />

        {/* Adding Group Members */}
        <div className="mb-4 rounded-md bg-gray-100 p-1 md:p-4">
          <h3>Uczestnicy grupy ({group.members.length})</h3>
          {group.members.map((member: Member, i: number) => (
            <GroupMember
              key={`group-member-${i}`}
              memberNumber={i + 1}
              removeMember={removeMember}
              saveMember={saveMember}
              mode={mode}
              shirtsSizes={shirtsSizes}
              shirtsTypes={shirtsTypes}
              transports={transports}
              isInstitution={group.isInstitution}
              isShirtOrderingEnabled={isShirtOrderingEnabled}
              member={member}
              loggedUserRole={loggedUserRole}
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
          <Button type="button" kind={BUTTON_KINDS.ADD} onClick={addMember}>
            Dodaj uczestnika
          </Button>
        </div>

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

        <div aria-live="polite" aria-atomic="true">
          {formErrors?.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          )}
          {isTooManyMembers && (
            <p className="mt-2 text-sm text-red-500">
              Nie można dodać kolejnego uczestnika. Limit to {MAX_MEMBERS_NUM}.
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/groups"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Anuluj
        </Link>
        {(isEditingForUsersEnabled || loggedUserRole === 'admin') && (
          <Button type="submit">Zapisz zmiany</Button>
        )}
      </div>
    </form>
  );
}

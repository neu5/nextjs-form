'use client';

import { useFormState } from 'react-dom';
import { FormEvent, useState, useEffect } from 'react';
import {
  GroupForm,
  ShirtsSizesList,
  ShirtsTypesList,
} from '@/app/lib/definitions';
import { Button, BUTTON_KINDS } from '@/app/ui/button';
import { createGroup } from '@/app/lib/actions/groups';
import { isAdult } from '@/app/lib/utils';
import GroupDetails from './group-details';
import GroupMember, { Member } from './group-member';
import { MAX_MEMBERS_NUM, getMemberDefault, getGroupDefault } from './utils';

let wasSubmitClicked = false;

export default function Form({
  isShirtOrderingEnabled,
  paths,
  shirtsSizes,
  shirtsTypes,
  transports,
}: {
  isShirtOrderingEnabled: boolean;
  paths: GroupForm[];
  shirtsSizes: ShirtsSizesList[];
  shirtsTypes: ShirtsTypesList[];
  transports: Array<{
    id: string;
    name: string;
    leavingHours: Array<{ id: string; value: string }>;
  }>;
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createGroup, initialState);

  const [group, setGroup] = useState(getGroupDefault());

  const [isTooManyMembers, setTooManyMembersError] = useState(false);

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
        .map((member) => ({
          ...member,
          ...(name === 'chefGroupId'
            ? {
                chefGroupId: '',
              }
            : {}),
        }))
        .map((member) => ({
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

    wasSubmitClicked = true;

    const formData = new FormData();

    formData.append('name', group.name);
    formData.append('pathId', group.pathId);
    formData.append('leavingHourId', group.leavingHourId);
    formData.append('submittingPersonEmail', group.submittingPersonEmail);
    formData.append('chefGroupPhoneNumber', group.chefGroupPhoneNumber);
    formData.append('remarks', group.remarks);
    formData.append('termsAndConditions', group.termsAndConditions);
    formData.append('isInstitution', group.isInstitution);
    formData.append('isSKKTStarachowice', group.isSKKTStarachowice);
    formData.append('rodo', group.rodo);

    group.members.forEach((member) => {
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

  const adultGuardians = group.members.reduce(
    (adultGuardians: Member[], member: Member) => {
      if (member.isAdult) {
        adultGuardians.push(member);
      }

      return adultGuardians;
    },
    [],
  );

  return (
    <form onSubmit={onSubmit}>
      <h2 className="my-8 text-3xl font-bold">Dodaj zgłoszenie</h2>
      <div className="rounded-md bg-gray-50 p-1 md:p-4 md:p-6">
        <GroupDetails
          leavingHours={leavingHours}
          group={group}
          paths={paths}
          state={state}
          saveGroup={saveGroup}
        />

        {/* Adding Group Members */}
        <div className="mb-4 rounded-md bg-gray-100 p-1 md:p-4">
          <h3>Dodaj uczestników grupy ({group.members.length})</h3>
          {group.members.map((member, i) => (
            <GroupMember
              key={`group-member-${i}`}
              adultGuardians={adultGuardians}
              memberNumber={i + 1}
              removeMember={removeMember}
              saveMember={saveMember}
              shirtsSizes={shirtsSizes}
              shirtsTypes={shirtsTypes}
              transports={transports}
              isInstitution={group.isInstitution}
              isShirtOrderingEnabled={isShirtOrderingEnabled}
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

        {/* Terms and conditions */}
        <div className="mb-4">
          <label className="mb-2 block flex text-sm font-medium">
            <input
              name="termsAndConditions"
              className="peer mr-4 block border border-gray-200 text-sm placeholder:text-gray-500"
              type="checkbox"
              onChange={(ev) =>
                saveGroup({
                  name: 'termsAndConditions',
                  value: ev.target.checked ? 'true' : '',
                })
              }
              aria-describedby="group-terms-and-conditions-error"
            />
            <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Akceptuję{' '}
              <a
                href="https://emeryk.pttk.pl/2025/dokumenty"
                target="_blank"
                className="text-blue-600 underline"
              >
                regulamin
              </a>{' '}
              Rajdu. Oświadczam, że wszyscy zgłoszeni uczestnicy Rajdu zapoznali
              się z regulaminem Rajdu.
            </span>
          </label>
          <div
            id="group-terms-and-conditions-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.termsAndConditions &&
              state.errors.termsAndConditions.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Rodo */}
        <div className="mb-4">
          <label className="mb-2 block flex text-sm font-medium">
            <input
              name="rodo"
              className="peer mr-4 block border border-gray-200 text-sm placeholder:text-gray-500"
              type="checkbox"
              onChange={(ev) =>
                saveGroup({
                  name: 'rodo',
                  value: ev.target.checked ? 'true' : '',
                })
              }
              aria-describedby="group-rodo-error"
            />
            <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
              Oświadczam, że wszyscy zgłaszani uczestnicy Rajdu wyrażają zgodę
              na przetwarzanie danych osobowych zgodnie z art. 6 ust. 1 pkt a)
              rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z 27
              kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z
              przetwarzaniem danych osobowych i w sprawie swobodnego przepływu
              takich danych oraz uchylenia dyrektywy 95/46/WE (RODO), w celach
              niezbędnych do przeprowadzenia Ogólnopolskiego Rajdu Nocnego św.
              Emeryka organizowanego przez Oddział Międzyszkolny PTTK w
              Starachowicach.{' '}
              <a
                href="https://emeryk.pttk.pl/2025/dokumenty"
                target="_blank"
                className="text-blue-600 underline"
              >
                Klauzula informacyjna ochrony danych osobowych
              </a>
            </span>
          </label>
          <div id="group-rodo-error" aria-live="polite" aria-atomic="true">
            {state.errors?.rodo &&
              state.errors.rodo.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {formErrors?.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
          {isTooManyMembers && (
            <p className="mt-2 text-sm text-red-500">
              Nie można dodać kolejnego uczestnika. Limit to {MAX_MEMBERS_NUM}.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex">
        <Button>Dodaj zgłoszenie</Button>
      </div>
    </form>
  );
}

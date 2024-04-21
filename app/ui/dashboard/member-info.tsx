import { getSession } from '@/app/lib/session';
import Link from 'next/link';
import {
  fetchGroupById,
  fetchPathById,
  fetchLeavingHourById,
} from '@/app/lib/data';
import clsx from 'clsx';

export default async function MemberInfo() {
  const session = await getSession();

  const groupId = session.user.groupId;

  const fetchedGroup = await fetchGroupById(groupId);

  if (!fetchedGroup) {
    console.log('Nie ma takiej grupy');
    return null;
  }

  const {
    chef_group_phone_number,
    is_institution,
    leaving_hour_id,
    name,
    path_id,
    submitting_person_email,
  } = fetchedGroup[0];

  const path = await fetchPathById(path_id);
  const leavingHour = await fetchLeavingHourById(leaving_hour_id);

  const members = fetchedGroup.map(
    ({
      member_id,
      member_name,
      birthday_date,
      is_group_chef,
    }: {
      member_id: string;
      member_name: string;
      birthday_date: string;
      is_group_chef: boolean;
    }) => ({
      id: member_id,
      birthdayDate: birthday_date,
      name: member_name,
      isGroupChef: is_group_chef,
    }),
  );

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <h2>
        Podsumowanie grupy -{' '}
        <Link
          className="text-blue-600 underline"
          href={`/dashboard/groups/${groupId}/edit`}
        >
          edytuj grupę
        </Link>
      </h2>
      <div className="mt-4">
        <table className="min-w-full md:table">
          <tbody className="bg-white">
            <tr className="w-full border-b py-3 text-sm">
              <td className="whitespace-nowrap px-3 py-3">Nazwa grupy</td>
              <td className="whitespace-nowrap px-3 py-3 font-bold">{name}</td>
            </tr>
            <tr className="w-full border-b py-3 text-sm">
              <td className="whitespace-nowrap px-3 py-3">Trasa</td>
              <td className="whitespace-nowrap px-3 py-3 font-bold">
                {path.name}
              </td>
            </tr>
            <tr className="w-full border-b py-3 text-sm">
              <td className="whitespace-nowrap px-3 py-3">
                Planowana godzina startu
              </td>
              <td className="whitespace-nowrap px-3 py-3 font-bold">
                {leavingHour.value}
              </td>
            </tr>
            <tr className="w-full border-b py-3 text-sm">
              <td className="whitespace-nowrap px-3 py-3">
                Czy grupa jest instytucją?
              </td>
              <td className="whitespace-nowrap px-3 py-3 font-bold">
                {is_institution ? 'TAK' : 'NIE'}
              </td>
            </tr>
            <tr className="w-full border-b py-3 text-sm">
              <td className="whitespace-nowrap px-3 py-3">
                Adres e-mail osoby zgłaszającej
              </td>
              <td className="whitespace-nowrap px-3 py-3 font-bold">
                {submitting_person_email}
              </td>
            </tr>
            <tr className="w-full border-b py-3 text-sm">
              <td className="whitespace-nowrap px-3 py-3">
                Nr telefonu kierownika grupy
              </td>
              <td className="whitespace-nowrap px-3 py-3 font-bold">
                {chef_group_phone_number}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="mb-2 mt-6">Uczestnicy ({members.length})</h3>
        <table className="min-w-full md:table">
          <tbody className="bg-white">
            {members.map(({ id, isGroupChef, birthdayDate, name }) => (
              <tr
                className={clsx('w-full border-b py-3 text-sm', {
                  'bg-yellow-200': isGroupChef,
                })}
                key={id}
              >
                <td className="whitespace-nowrap px-3 py-3">
                  {name}, {birthdayDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

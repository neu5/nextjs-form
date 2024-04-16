// import EditGroup from '@/app/ui/groups/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchGroupById } from '@/app/lib/data';
import { deleteGroup } from '@/app/lib/actions/groups';
import { notFound } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';

export default async function Page({ params }: { params: { id: string } }) {
  const groupId = params.id;

  const fetchedGroups = await fetchGroupById(groupId);

  if (!fetchedGroups) {
    notFound();
  }

  const group = fetchedGroups[0];
  const { id, name, submitting_person_email } = group;

  const deleteGroupWithId = deleteGroup.bind(null, {
    id,
    name,
    submitting_person_email,
  });

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Grupy', href: '/dashboard/groups' },
          {
            label: 'Usuwanie grupy',
            href: `/dashboard/groups/${id}/delete`,
            active: true,
          },
        ]}
      />

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        Czy na pewno chcesz usunąć grupę{' '}
        <span className="font-bold">{name}</span>?
        <p className="mt-4">Ta operacja jest nieodwracalna.</p>
        <p>
          Konto użytkownika ({submitting_person_email}) również zostanie
          usunięte i nastąpi wylogowanie.
        </p>
        <form action={deleteGroupWithId} className="mt-6">
          <button className="rounded-md border bg-red-300 p-2 hover:bg-red-200">
            Usuń <TrashIcon className="inline w-5" />
          </button>
        </form>
      </div>
    </main>
  );
}

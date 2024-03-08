import Form from '@/app/ui/groups/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchGroupById, fetchPathsWithItsLeavingHours } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const group = await fetchGroupById(id);
  const paths = await fetchPathsWithItsLeavingHours();

  if (!group) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Grupy', href: '/dashboard/groups' },
          {
            label: 'Edycja grupy',
            href: `/dashboard/groups/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        fetchedGroup={group}
        /* @ts-ignore */
        paths={paths}
      />
    </main>
  );
}

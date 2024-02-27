// import Form from '@/app/ui/paths/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  // fetchLeavingHours,
  fetchGroupById,
  // fetchPathLeavingHours,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const group = await fetchGroupById(id);
  // const leavingHours = await fetchLeavingHours();
  // const pathLeavingHours = await fetchPathLeavingHours(id);

  if (!group) {
    notFound();
  }

  console.log({ group });

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
      {/* <Form
        // leavingHours={leavingHours}
        path={path}
        // pathLeavingHours={pathLeavingHours}
      /> */}
    </main>
  );
}

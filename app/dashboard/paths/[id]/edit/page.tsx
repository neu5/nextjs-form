import Form from '@/app/ui/paths/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchLeavingHours,
  fetchPathById,
  fetchPathLeavingHours,
  fetchPathsTypes,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const path = await fetchPathById(id);
  const pathsTypes = await fetchPathsTypes();
  const leavingHours = await fetchLeavingHours();
  const pathLeavingHours = await fetchPathLeavingHours(id);

  if (!path) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Trasy', href: '/dashboard/paths' },
          {
            label: 'Edycja trasy',
            href: `/dashboard/paths/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        leavingHours={leavingHours}
        path={path}
        pathsTypes={pathsTypes}
        pathLeavingHours={pathLeavingHours}
      />
    </main>
  );
}

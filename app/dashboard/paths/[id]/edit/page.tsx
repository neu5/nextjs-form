import Form from '@/app/ui/paths/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchPathById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const path = await fetchPathById(id);

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
      <Form path={path} />
    </main>
  );
}

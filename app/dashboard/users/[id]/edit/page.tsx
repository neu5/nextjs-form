import Form from '@/app/ui/organizers/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchShirtsSizes,
  fetchOrganizerById,
  fetchShirtsTypes,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const organizer = await fetchOrganizerById(id);
  const shirtsTypes = await fetchShirtsTypes();
  const shirtsSizes = await fetchShirtsSizes();

  if (!organizer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Organizatorzy', href: '/dashboard/organizers' },
          {
            label: 'Edycja organizatora',
            href: `/dashboard/organizers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        organizer={organizer}
        shirtsSizes={shirtsSizes}
        shirtsTypes={shirtsTypes}
      />
    </main>
  );
}

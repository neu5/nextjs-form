import Form from '@/app/ui/organizers/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchShirtsSizes, fetchShirtsTypes } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dodaj organizatora',
};

export default async function Page() {
  const shirtsTypes = await fetchShirtsTypes();
  const shirtsSizes = await fetchShirtsSizes();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Organizatorzy', href: '/dashboard/organizers' },
          {
            label: 'Dodaj organizatora',
            href: '/dashboard/organizers/create',
            active: true,
          },
        ]}
      />
      <Form shirtsSizes={shirtsSizes} shirtsTypes={shirtsTypes} />
    </main>
  );
}

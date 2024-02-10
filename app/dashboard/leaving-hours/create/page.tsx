import Form from '@/app/ui/leaving-hours/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dodaj godzinę startu',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Godziny startów', href: '/dashboard/leaving-hours' },
          {
            label: 'Dodaj godzinę startu',
            href: '/dashboard/leaving-hours/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}

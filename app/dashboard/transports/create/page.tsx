import Form from '@/app/ui/transports/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dodaj transport',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transport', href: '/dashboard/transports' },
          {
            label: 'Dodaj transport',
            href: '/dashboard/transports/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}

import Form from '@/app/ui/paths/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dodaj trasę',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Trasy', href: '/dashboard/paths' },
          {
            label: 'Dodaj trasę',
            href: '/dashboard/paths/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}

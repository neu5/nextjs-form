import Form from '@/app/ui/transports/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchLeavingHours,
  fetchTransportById,
  fetchTransportLeavingHours,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const transport = await fetchTransportById(id);
  const leavingHours = await fetchLeavingHours();
  const transportLeavingHours = await fetchTransportLeavingHours(id);

  if (!transport) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transport', href: '/dashboard/transports' },
          {
            label: 'Edycja transportu',
            href: `/dashboard/transports/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        leavingHours={leavingHours}
        transport={transport}
        transportLeavingHours={transportLeavingHours}
      />
    </main>
  );
}

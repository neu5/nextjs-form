import EditGroup from '@/app/ui/groups/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchGroupById,
  fetchPathsWithItsLeavingHours,
  fetchShirtsSizes,
  fetchShirtsTypes,
  fetchTransportsWithItsLeavingHours,
  fetchUserEditingConfiguration,
} from '@/app/lib/data';
import { getSession } from '@/app/lib/session';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const group = await fetchGroupById(id);
  const paths = await fetchPathsWithItsLeavingHours();
  const shirtsTypes = await fetchShirtsTypes();
  const shirtsSizes = await fetchShirtsSizes();
  const transports = await fetchTransportsWithItsLeavingHours();
  const isEditingForUsersEnabled = await fetchUserEditingConfiguration();
  const session = await getSession();

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
      <EditGroup
        fetchedGroup={group}
        /* @ts-ignore */
        paths={paths}
        shirtsSizes={shirtsSizes}
        shirtsTypes={shirtsTypes}
        /* @ts-ignore */
        transports={transports}
        isEditingForUsersEnabled={isEditingForUsersEnabled}
        loggedUserRole={session.user.role}
      />
    </main>
  );
}

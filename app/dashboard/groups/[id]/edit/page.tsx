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

  const [
    group,
    paths,
    shirtsTypes,
    shirtsSizes,
    transports,
    isEditingForUsersEnabled,
    session,
  ] = await Promise.all([
    fetchGroupById(id),
    fetchPathsWithItsLeavingHours(),
    fetchShirtsTypes(),
    fetchShirtsSizes(),
    fetchTransportsWithItsLeavingHours(),
    fetchUserEditingConfiguration(),
    getSession(),
  ]);

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

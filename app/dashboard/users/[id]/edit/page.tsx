import Form from '@/app/ui/users/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchUserById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Użytkownicy', href: '/dashboard/users' },
          {
            label: 'Edycja użytkownika',
            href: `/dashboard/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form user={user} />
    </main>
  );
}

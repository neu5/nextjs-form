import Form from '@/app/ui/users/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchUserById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

const getEditPath = (id: string) => ({
  label: 'Edycja użytkownika',
  href: `/dashboard/users/${id}/edit`,
  active: true,
});

const adminBreadcrumbs = (id: string) => [
  { label: 'Użytkownicy', href: '/dashboard/users' },
  getEditPath(id),
];

const userBreadcrumbs = (id: string) => [getEditPath(id)];

const getBreadcrumbs = ({ id, role }: { id: string; role: string }) =>
  role === 'admin' ? adminBreadcrumbs(id) : userBreadcrumbs(id);

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs breadcrumbs={getBreadcrumbs({ id, role: user.role })} />
      <Form user={user} />
    </main>
  );
}

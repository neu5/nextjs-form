import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteOrganizer } from '@/app/lib/actions/organizers';

export function CreateOrganizer() {
  return (
    <Link
      href="/dashboard/organizers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Dodaj organizatora</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateOrganizer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/organizers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteOrganizer({ id }: { id: string }) {
  const deleteOrganizerWithId = deleteOrganizer.bind(null, id);

  return (
    <form action={deleteOrganizerWithId}>
      <button className="rounded-md border bg-red-300 p-2 hover:bg-red-200">
        <span className="sr-only">Usuń</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

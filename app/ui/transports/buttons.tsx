import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateTransport() {
  return (
    <Link
      href="/dashboard/transports/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Dodaj transport</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateTransport({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/transports/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

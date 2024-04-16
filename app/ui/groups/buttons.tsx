import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function UpdateGroup({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/groups/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteGroup({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/groups/${id}/delete`}
      className="rounded-md border bg-red-300 p-2 p-2 hover:bg-red-200"
    >
      <TrashIcon className="w-5" />
    </Link>
  );
}

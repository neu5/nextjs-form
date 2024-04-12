import { Metadata } from 'next';
import Table from '@/app/ui/print/groups/attendance-list';

export const metadata: Metadata = {
  title: 'Do druku | Lista obecności',
};

export default function Print({ params }: { params: { id: string } }) {
  const id = params.id;

  return <Table id={id} />;
}

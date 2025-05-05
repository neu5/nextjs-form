import { Metadata } from 'next';
import Table from '@/app/ui/print/transport-list';

export const metadata: Metadata = {
  title: 'Do druku',
};

export default function Print() {
  return <Table />;
}

import { Metadata } from 'next';
import Table from '@/app/ui/print/insurance-list-with-pttk';

export const metadata: Metadata = {
  title: 'Do druku',
};

export default function Print() {
  return <Table />;
}

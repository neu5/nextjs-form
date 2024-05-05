import { Metadata } from 'next';
import Table from '@/app/ui/print/groups/list-with-numbers';

export const metadata: Metadata = {
  title: 'Do druku | Spis grup',
};

export default function Print() {
  return <Table />;
}

import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/guardians/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Opiekunowie',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Opiekunowie</h1>
      </div>
      <Table />
    </div>
  );
}

import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/paths/table';
import { CreatePath } from '@/app/ui/paths/buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trasy',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Trasy</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreatePath />
      </div>
      <Table />
    </div>
  );
}

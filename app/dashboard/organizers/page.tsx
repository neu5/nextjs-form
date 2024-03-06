import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/organizers/table';
import { CreateOrganizer } from '@/app/ui/organizers/buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organizatorzy',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Organizatorzy</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateOrganizer />
      </div>
      <Table />
    </div>
  );
}

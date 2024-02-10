import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/leaving-hours/table';
import { CreateLeavingHour } from '@/app/ui/leaving-hours/buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Godziny startów',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Godziny startów</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateLeavingHour />
      </div>
      <Table />
    </div>
  );
}

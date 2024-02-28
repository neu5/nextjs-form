import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/transports/table';
import { CreateTransport } from '@/app/ui/transports/buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transport',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transport</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateTransport />
      </div>
      <Table />
    </div>
  );
}

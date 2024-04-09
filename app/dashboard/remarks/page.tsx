import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/remarks/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uwagi',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Uwagi</h1>
      </div>
      <Table />
    </div>
  );
}

import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/users/table';
import { CreateUser } from '@/app/ui/users/buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Użytkownicy',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Użytkownicy</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateUser />
      </div>
      <Table />
    </div>
  );
}

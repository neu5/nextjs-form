import { lusitana } from '@/app/ui/fonts';
import Form from '@/app/ui/configuration/edit-form';
import { fetchConfiguration } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ustawienia',
};

export default async function Page() {
  const configuration = await fetchConfiguration();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Ustawienia</h1>
      </div>
      <Form configuration={configuration} />
    </div>
  );
}

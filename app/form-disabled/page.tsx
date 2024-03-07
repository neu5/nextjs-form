import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formularz jest niedostępny',
};

export default function GroupCreateFormDisabledPage() {
  return (
    <main className="mx-8 my-8 flex-grow bg-white p-6 md:overflow-y-auto md:p-10">
      <h2 className="font-red my-8 text-3xl text-red-600">
        Formularz jest aktualnie niedostępny.
      </h2>
      Wróć na stronę emeryka -{' '}
      <a className="text-blue-600 underline" href="https://www.emeryk.pttk.pl/">
        https://www.emeryk.pttk.pl/
      </a>
    </main>
  );
}

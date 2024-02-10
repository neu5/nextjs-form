import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ogłoszenie dodane',
};

export default function GroupCreateSuccessPage() {
  return (
    <main className="mx-8 my-8 flex-grow bg-white p-6 md:overflow-y-auto md:p-10">
      <h2 className="my-8 text-3xl font-bold">
        Udało się! Zgłoszenie zostało dodane.
      </h2>
      Wróć na stronę emeryka -{' '}
      <a className="text-blue-600 underline" href="https://www.emeryk.pttk.pl/">
        https://www.emeryk.pttk.pl/
      </a>
    </main>
  );
}

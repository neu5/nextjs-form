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
      <p className="mt-6">
        <strong className="font-bold">
          Każde zgłoszenie jest potwierdzane na adres e-mail podany w
          zgłoszeniu.
          <br /> W przypadku nieotrzymania wiadomości w ciągu 30 min od
          prawidłowo wysłanego zgłoszenia prosimy o sprawdzenie folderu SPAM.
          <br />W razie problemów prosimy o kontakt mailowy: &nbsp;
          <a
            className="text-blue-600 underline"
            href="mailto:kontakt@emeryk.pttk.pl"
          >
            kontakt@emeryk.pttk.pl
          </a>
        </strong>
      </p>
    </main>
  );
}

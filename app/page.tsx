import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import CreateGroup from '@/app/ui/groups/create-form';
import {
  fetchFormConfiguration,
  fetchShirtOrderingConfiguration,
  fetchPathsWithItsLeavingHours,
  fetchShirtsSizes,
  fetchShirtsTypes,
  fetchTransportsWithItsLeavingHours,
} from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Rajd Świętego Emeryka | Formularz',
};

async function CreateGroupWrapper({
  isFormEnabled,
}: {
  isFormEnabled: boolean;
}) {
  if (!isFormEnabled) {
    return null;
  }

  const [paths, shirtsTypes, shirtsSizes, transports, isShirtOrderingEnabled] =
    await Promise.all([
      fetchPathsWithItsLeavingHours(),
      fetchShirtsTypes(),
      fetchShirtsSizes(),
      fetchTransportsWithItsLeavingHours(),
      fetchShirtOrderingConfiguration(),
    ]);

  return (
    <CreateGroup
      isShirtOrderingEnabled={isShirtOrderingEnabled}
      /* @ts-ignore */
      paths={paths}
      shirtsSizes={shirtsSizes}
      shirtsTypes={shirtsTypes}
      /* @ts-ignore */
      transports={transports}
    />
  );
}

export default async function Page() {
  const isFormEnabled = await fetchFormConfiguration();

  return (
    <main className="sx:mx-8 sx:p-6 mx-1 mx-auto my-8 max-w-screen-xl flex-grow bg-white p-1 md:overflow-y-auto md:p-10">
      <div className="flex justify-end gap-4">
        <Link
          href="/login"
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Zaloguj się</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
      </div>
      <div className="flex items-center justify-center p-6">
        <Image
          src="/emeryk2025-znaczek.png"
          width={200}
          height={200}
          className="hidden md:block"
          alt="Znaczek rajdowy"
          priority={true}
        />
        <Image
          src="/emeryk2025-znaczek.png"
          width={100}
          height={100}
          className="block md:hidden"
          alt="Znaczek rajdowy"
          priority={true}
        />
      </div>
      <h2 className="my-8 text-3xl font-bold">
        Zanim wypełnisz formularz zgłoszeniowy…
      </h2>
      <ul className="list-disc pl-4 leading-loose">
        <li>
          Prosimy o wcześniejsze zapoznanie się z przebiegiem tras i godzinami
          startu.
        </li>
        <li>Prosimy o wcześniejsze zapoznanie się z regulaminem Rajdu.</li>
        <li>
          Prosimy podawać prawidłowe i kompletne dane w zgłoszeniu. Podanie
          niewłaściwych danych może skutkować brakiem ubezpieczenia dla
          uczestnika Rajdu. W przypadku konieczności zmiany danych uczestnika
          Rajdu możliwe jest wykonanie korekty do dnia 31 maja 2025 r.
        </li>
        <li>
          Jeśli w grupie znajdują się osoby niepełnoletnie prosimy w formularzu
          podać imię i nazwisko{' '}
          <span className="text-red-600">opiekuna/opiekunów prawnych</span>
          &nbsp; (opiekun prawny musi być uczestnikiem Rajdu).
        </li>
        <li>
          Prosimy o wyznaczenie kierownika grupy (należy zaznaczyć opcję przy
          wybranej osobie) i podanie numeru telefonu komórkowego kierownika
          (jeśli kierownik nie posiada telefonu prosimy o podanie numeru osoby
          należącej do grupy) - dotyczy również trasy rowerowej (w przypadku,
          gdy zgłaszana jest jedna osoba, należy zaznaczyć ją jako kierownika
          grupy).
        </li>
        <li>
          Ze względu na bezpieczeństwo uczestników Rajdu na teren mety
          wpuszczane będą jedynie osoby posiadające aktualny znaczek Rajdowy.
        </li>
        <li>
          <strong className="font-bold">
            W przypadku rezygnacji z kontynuowania Rajdu przed dotarciem na metę
            kierownik drużyny ma obowiązek zgłosić taką sytuację organizatorom
            telefonicznie (numer w opisie trasy).
          </strong>
        </li>
        <li>
          W celu zakupu koszulek Rajdowych należy w formularzu zaznaczyć taką
          opcję (przy każdym uczestniku Rajdu osobno) i z opcji wybrać rodzaj
          koszulki i rozmiar. Szczegóły w zakładce &nbsp;
          <a
            href="https://emeryk.pttk.pl/rajd/koszulki"
            target="_blank"
            title="Koszulki"
            className="font-bold text-blue-600 underline"
          >
            KOSZULKI
          </a>
          . Od dnia 11 maja 2025 r. korekcie nie podlega ilość, rodzaj oraz
          rozmiar zamówionych koszulek.
        </li>
        <li>
          Osoby zainteresowane transportem powrotnym (trasa Zalew Lipowica – 
          Kielce Główne PKP) mogą wybrać opcję transportu w formularzu zgłoszeniowym 
          (dla każdego uczestnika osobno – trasa, godzina odjazdu). 
          Koszt transportu wynosi 15 zł za osobę. 
          Liczba miejsc ograniczona. Decyduje kolejność zgłoszeń. 
        </li>
        <li>
          Wszystkie pola oznaczone <span className="text-red-600">*</span> są
          wymagane.
        </li>
        <li>
          <strong className="font-bold">
            Każde zgłoszenie jest potwierdzane na adres e-mail podany w
            zgłoszeniu. W przypadku nieotrzymania wiadomości w ciągu 30 min od
            prawidłowo wysłanego zgłoszenia prosimy o sprawdzenie folderu SPAM.
            W razie problemów prosimy o kontakt mailowy: &nbsp;
            <a
              className="text-blue-600 underline"
              href="mailto:kontakt@emeryk.pttk.pl"
            >
              kontakt@emeryk.pttk.pl
            </a>
          </strong>
        </li>
      </ul>
      <CreateGroupWrapper isFormEnabled={isFormEnabled} />
    </main>
  );
}

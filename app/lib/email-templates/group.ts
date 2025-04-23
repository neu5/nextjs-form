export const groupCreateMail = ({
  chefGroupPhoneNumber,
  creationTime,
  email,
  leavingHour,
  members,
  name,
  password,
  pathName,
  pathType,
  shirts,

//może dodać tutaj docelowo transports.name i transports_leaving_hours - jeśli trasa nie rowerowa
  
}: {
  chefGroupPhoneNumber: string;
  creationTime: string;
  email: string;
  leavingHour: string;
  members: { name: string; birthdayDate: string; PTTKCardNumber: string }[];
  name: string;
  password: string;
  pathName: string;
  pathType: string;
  shirts: { shirtType: string; shirtSize: string }[];

  //może dodać tutaj docelowo transports.name i transports_leaving_hours
  
}) => `<!doctype html>
<html lang="PL-pl">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Rajd Nocny Świętego Emeryka</title>
    <style media="all" type="text/css">
    body {
      font-family: Helvetica, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;
      line-height: 1.3;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    
    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    
    table td {
      font-family: Helvetica, sans-serif;
      font-size: 16px;
      vertical-align: top;
    }
    
    body {
      background-color: #f4f5f6;
      margin: 0;
      padding: 0;
    }

    p {
      font-family: Helvetica, sans-serif;
      font-size: 16px;
      font-weight: normal;
      margin: 0;
      margin-bottom: 16px;
    }
    
    a {
      color: #0867ec;
      text-decoration: underline;
    }
    </style>
    </head>
    <body>
Dziękujemy za zgłoszenie grupy!
<br><br>  
Możesz edytować swoje zgłoszenie logując się na
https://emeryk.pttk.pl/formularz
<br>
Twoim loginem jest adres email: ${email}<br>
Hasło: ${password}
<br>
Hasło możesz zmienić w panelu po zalogowaniu.
<br><br>

<h2>Podsumowanie zgłoszenia</h2>
Data zgłoszenia: ${creationTime}<br>
Nazwa drużyny: ${name}<br>
Wybrana trasa: ${pathName}<br>
Email zgłaszającego: ${email}<br>
Telefon kierownika grupy: ${chefGroupPhoneNumber}<br>
Planowana godzina startu: ${leavingHour}<br>

<br>
Lista uczestników:
<table>
<tr>
<td>Lp.1</td>
<td>Imię i nazwisko</td>
<td>Data urodzenia</td>
<td>Nr leg. PTTK</td>

//<td>Transport - trasa</td>
//<td>Transport - godzina</td>

</tr>
${members
  .map(({ name, birthdayDate, PTTKCardNumber }, idx) => {
    return `<tr>
  <td>${idx + 1}</td>
  <td>${name}</td>
  <td>${birthdayDate}</td>
  <td>${PTTKCardNumber}</td>
  
//jw transport i godzina
  
  </tr>`;
  })
  .join('')}
</table>
<br>
Akceptuję <a href="https://emeryk.pttk.pl/rajd/dokumenty">regulamin</a> Rajdu. Oświadczam, że wszyscy zgłoszeni uczestnicy Rajdu zapoznali się z regulaminem Rajdu
<br>
Oświadczam, że wszyscy zgłaszani uczestnicy Rajdu wyrażają zgodę na przetwarzanie danych osobowych zgodnie z art. 6 ust. 1 pkt a) rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO), w celach niezbędnych do przeprowadzenia Ogólnopolskiego Rajdu Nocnego św. Emeryka organizowanego przez Oddział Międzyszkolny PTTK w Starachowicach. <a href="https://emeryk.pttk.pl/images/Ogolnopolski-Rajd-Nocny-Swietego-Emeryka-RODO.pdf">Klauzula informacyjna ochrony danych osobowych</a>
<br>

<h2>WAŻNE INFORMACJE</h2>
<h3>TERMIN RAJDU:</h3>
<ul><li>start w sobotę wieczorem 7 czerwca 2025 r.</li>
<li>zakończenie w niedzielę rano 8 czerwca 2025 r. – teren przy Zalewie Lipowica - gm. Chęciny.</li>
</ul>

${
  pathType === 'rowerowa'
    ? `<br>Od uczestników trasy rowerowej wymagamy <b>kompletnego oświetlenia roweru</b>. W miarę możliwości prosimy zabrać również kamizelki odblaskowe.<br>Po drogach publicznych należy poruszać się w grupach maksymalnie 15 osobowych. Następna grupa jedzie w odstępie min. 200 metrów od poprzedzającej.<br>Osoby zdobywające kolarską odznakę turystyczną proszone są o zabranie książeczek KOT PTTK.`
    : ``
}
<br>
<h3>(*) WPŁATY:</h3>
<ul><li>Opłata za jednego uczestnika w drużynie - 40 zł</li>
<li>Opłata od przewodników turystycznych, przodowników turystyki kwalifikowanej, członków kół (klubów) PTTK - 30 zł (tylko uczestnicy zaznaczeni w zgłoszeniu z opłaconymi składkami PTTK za 2025 r. - prosimy o zabranie legitymacji PTTK na start w celu weryfikacji - brak aktualnego znaczka potwierdzającego opłacenie składki członkowskiej za 2025 r. spowoduje skreślenie z listy uczestników Rajdu.)</li>
<li>Opłata od członków SKKT przy Oddziale Międzyszkolnym PTTK w Starachowicach - 20 zł (tylko uczestnicy zaznaczeni w zgłoszeniu z opłaconymi składkami PTTK za 2025 r. - prosimy o zabranie legitymacji PTTK na start w celu weryfikacji - brak aktualnego znaczka potwierdzającego opłacenie składki członkowskiej za 2025 r. spowoduje skreślenie z listy uczestników Rajdu.)</li>
<li>Opłata od opiekunów grup młodzieży szkolnej (1 opiekun na 10 uczestników w wieku 10-17 lat) - nie jest pobierana.</li>
<li>Korektę danych uczestnika/ów Rajdu można wykonać do 31 maja 2025 r. – po 11 maja 2025 r. korekcie nie podlega ilość, rodzaj oraz rozmiar zamówionych koszulek.</li>
</ul>
<br>
Wpłat prosimy dokonywać na konto Oddziału Międzyszkolnego PTTK w Starachowicach <b><u>do dnia 14 maja 2025 r. (zgłoszenia bez dokonanej wpłaty nie zostaną uwzględnione):</u></b>
<br>
<div>PKO BP O/Ostrowiec Św. 64 1020 2674 0000 2102 0043 1437</div>
<div>PTTK O/Międzyszkolny w Starachowicach</div>
<div>al. Armii Krajowej 1, 27-200 Starachowice</div>

W tytule przelewu prosimy wpisać:
<div><b>Wpisowe Emeryk 2025 - zgłoszenie drużyny ${name} ${
  pathType === 'rowerowa' ? `na trasę rowerową,` : ``
} osób ${members.length}</b></div>

${
  shirts.length
    ? `
<h3>KOSZULKI</h3>
Zamówiono koszulek: <b>${shirts.length}</b><br>
<ol>${shirts
        .map(({ shirtType, shirtSize }) => {
          return `<li>koszulka ${shirtType}, rozmiar ${shirtSize}</li>`;
        })
        .join('')}</ol>
<br>
Każda koszulka kosztuje <b><u>25 zł</u></b>, zatem do przelewu należy doliczyć <b><u>${
        shirts.length * 25
      } zł</b></u>.`
    : ``
}

//może coś na tej zasadzie ? - z wyłączeniem rowerowych 
//${
//  transport.length
//    ? `
//<h3>TRANSPORT</h3>
//Zarezerwowano transport dla <b>${transports.length}</b> osób<br>
//Koszt transportu to <b><u>15 zł</u></b>, zatem do przelewu należy doliczyć <b><u>${
//        transport.length * 15
//      } zł</b></u>.`
//    : ``
//}

<br>
<h3>KONTAKT:</h3>
<div>tel. 515 045 475 (Komendant Rajdu)</div>
<div>e-mail: kontakt@emeryk.pttk.pl</div>
<br>
<div><a href="kontakt@emeryk.pttk.pl">kontakt@emeryk.pttk.pl</a> - oficjalny adres email Rajdu</div>
<div><a href="www.emeryk.pttk.pl">www.emeryk.pttk.pl</a> - oficjalna strona Rajdu</div>
<div><a href="facebook.com/emeryk.pttk">facebook.com/emeryk.pttk</a> - oficjalny profil FB Rajdu</div>

<br>
(*) Rajd nie ma charakteru komercyjnego i jest imprezą non profit przygotowaną na zasadzie samoorganizacji. Osoby uczestniczące w Rajdzie dokonują wpłat na pokrycie kosztów jego organizacji.
<br>
Pozdrawiamy,
emeryk.pttk.pl
</body></html>
`;

export const groupCreateMailAdmin = ({
  chefGroupPhoneNumber,
  creationTime,
  email,
  leavingHour,
  members,
  name,
  password,
  pathName,
  pathType,
  shirts,
}: {
  chefGroupPhoneNumber: string;
  creationTime: string;
  email: string;
  leavingHour: string;
  members: { name: string; birthdayDate: string; PTTKCardNumber: string }[];
  name: string;
  password: string;
  pathName: string;
  pathType: string;
  shirts: { shirtType: string; shirtSize: string }[];
}) => `<!doctype html>
<html lang="PL-pl">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Rajd Nocny Świętego Emeryka</title>
    <style media="all" type="text/css">
    body {
      font-family: Helvetica, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;
      line-height: 1.3;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    
    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    
    table td {
      font-family: Helvetica, sans-serif;
      font-size: 16px;
      vertical-align: top;
    }
    
    body {
      background-color: #f4f5f6;
      margin: 0;
      padding: 0;
    }

    p {
      font-family: Helvetica, sans-serif;
      font-size: 16px;
      font-weight: normal;
      margin: 0;
      margin-bottom: 16px;
    }
    
    a {
      color: #0867ec;
      text-decoration: underline;
    }
    </style>
    </head>
    <body>
Adminie! Nowa grupa została zgłoszona.
<br><br>  
Możesz edytować swoje zgłoszenie logując się na
https://emeryk.pttk.pl/formularz
<br>
Twoim loginem jest adres email: ${email}<br>
Hasło: ${password}
<br>
Hasło możesz zmienić w panelu po zalogowaniu.
<br><br>

<h2>Podsumowanie zgłoszenia</h2>
Data zgłoszenia: ${creationTime}<br>
Nazwa drużyny: ${name}<br>
Wybrana trasa: ${pathName}<br>
Email zgłaszającego: ${email}<br>
Telefon kierownika grupy: ${chefGroupPhoneNumber}<br>
Planowana godzina startu: ${leavingHour}<br>

<br>
Lista uczestników:
<table>
<tr>
<td>Lp.1</td>
<td>Imię i nazwisko</td>
<td>Data urodzenia</td>
<td>Nr leg. PTTK</td>
</tr>
${members
  .map(({ name, birthdayDate, PTTKCardNumber }, idx) => {
    return `<tr>
  <td>${idx + 1}</td>
  <td>${name}</td>
  <td>${birthdayDate}</td>
  <td>${PTTKCardNumber}</td>
  </tr>`;
  })
  .join('')}
</table>
<br>
Akceptuję <a href="https://emeryk.pttk.pl/rajd/dokumenty">regulamin</a> Rajdu. Oświadczam, że wszyscy zgłoszeni uczestnicy Rajdu zapoznali się z regulaminem Rajdu
<br>
Oświadczam, że wszyscy zgłaszani uczestnicy Rajdu wyrażają zgodę na przetwarzanie danych osobowych zgodnie z art. 6 ust. 1 pkt a) rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO), w celach niezbędnych do przeprowadzenia Ogólnopolskiego Rajdu Nocnego św. Emeryka organizowanego przez Oddział Międzyszkolny PTTK w Starachowicach. <a href="https://emeryk.pttk.pl/images/Ogolnopolski-Rajd-Nocny-Swietego-Emeryka-RODO.pdf">Klauzula informacyjna ochrony danych osobowych</a>
<br>

<h2>WAŻNE INFORMACJE</h2>
<h3>TERMIN RAJDU:</h3>
<ul><li>start w sobotę wieczorem 7 czerwca 2025 r.</li>
<li>zakończenie w niedzielę rano 8 czerwca 2025 r. – teren przy Zalewie Lipowica - gm. Chęciny.</li>
</ul>

${
  pathType === 'rowerowa'
    ? `<br>Od uczestników trasy rowerowej wymagamy <b>kompletnego oświetlenia roweru</b>. W miarę możliwości prosimy zabrać również kamizelki odblaskowe.<br>Po drogach publicznych należy poruszać się w grupach maksymalnie 15 osobowych. Następna grupa jedzie w odstępie min. 200 metrów od poprzedzającej.<br>Osoby zdobywające kolarską odznakę turystyczną proszone są o zabranie książeczek KOT PTTK.`
    : ``
}
<br>
<h3>(*) WPŁATY:</h3>
<ul><li>Opłata za jednego uczestnika w drużynie - 40 zł</li>
<li>Opłata od przewodników turystycznych, przodowników turystyki kwalifikowanej, członków kół (klubów) PTTK - 30 zł (tylko uczestnicy zaznaczeni w zgłoszeniu z opłaconymi składkami PTTK za 2025 r. - prosimy o zabranie legitymacji PTTK na start w celu weryfikacji - brak aktualnego znaczka potwierdzającego opłacenie składki członkowskiej za 2025 r. spowoduje skreślenie z listy uczestników Rajdu.)</li>
<li>Opłata od członków SKKT przy Oddziale Międzyszkolnym PTTK w Starachowicach - 20 zł (tylko uczestnicy zaznaczeni w zgłoszeniu z opłaconymi składkami PTTK za 2025 r. - prosimy o zabranie legitymacji PTTK na start w celu weryfikacji - brak aktualnego znaczka potwierdzającego opłacenie składki członkowskiej za 2025 r. spowoduje skreślenie z listy uczestników Rajdu.)</li>
<li>Opłata od opiekunów grup młodzieży szkolnej (1 opiekun na 10 uczestników w wieku 10-17 lat) - nie jest pobierana.</li>
<li>Korektę danych uczestnika/ów Rajdu można wykonać do 31 maja 2025 r. – po 11 maja 2025 r. korekcie nie podlega ilość, rodzaj oraz rozmiar zamówionych koszulek.</li>
</ul>
<br>
Wpłat prosimy dokonywać na konto Oddziału Międzyszkolnego PTTK w Starachowicach <b><u>do dnia 14 maja 2025 r. (zgłoszenia bez dokonanej wpłaty nie zostaną uwzględnione):</u></b>
<br>
<div>PKO BP O/Ostrowiec Św. 64 1020 2674 0000 2102 0043 1437</div>
<div>PTTK O/Międzyszkolny w Starachowicach</div>
<div>al. Armii Krajowej 1, 27-200 Starachowice</div>

W tytule przelewu prosimy wpisać:
<div><b>Wpisowe Emeryk 2025 - zgłoszenie drużyny ${name} ${
  pathType === 'rowerowa' ? `na trasę rowerową,` : ``
} osób ${members.length}</b></div>

${
  shirts.length
    ? `
<h3>KOSZULKI</h3>
Zamówiono koszulek: <b>${shirts.length}</b><br>
<ol>${shirts
        .map(({ shirtType, shirtSize }) => {
          return `<li>koszulka ${shirtType}, rozmiar ${shirtSize}</li>`;
        })
        .join('')}</ol>
<br>
Każda koszulka kosztuje <b><u>25 zł</u></b>, zatem do przelewu należy doliczyć <b><u>${
        shirts.length * 25
      } zł</b></u>.`
    : ``
}

//może coś na tej zasadzie ? - z wyłączeniem rowerowych
//${
//  transport.length
//    ? `
//<h3>TRANSPORT</h3>
//Zarezerwowano transport dla <b>${transports.length}</b> osób<br>
//Koszt transportu to <b><u>15 zł</u></b>, zatem do przelewu należy doliczyć <b><u>${
//        transport.length * 15
//      } zł</b></u>.`
//    : ``
//}


<br>
<h3>KONTAKT:</h3>
<div>tel. 515 045 475 (Komendant Rajdu)</div>
<div>e-mail: kontakt@emeryk.pttk.pl</div>
<br>
<div><a href="kontakt@emeryk.pttk.pl">kontakt@emeryk.pttk.pl</a> - oficjalny adres email Rajdu</div>
<div><a href="www.emeryk.pttk.pl">www.emeryk.pttk.pl</a> - oficjalna strona Rajdu</div>
<div><a href="facebook.com/emeryk.pttk">facebook.com/emeryk.pttk</a> - oficjalny profil FB Rajdu</div>

<br>
(*) Rajd nie ma charakteru komercyjnego i jest imprezą non profit przygotowaną na zasadzie samoorganizacji. Osoby uczestniczące w Rajdzie dokonują wpłat na pokrycie kosztów jego organizacji.
<br>
Pozdrawiamy,
emeryk.pttk.pl
</body></html>
`;

export const groupUpdateMailAdmin = ({ name }: { name: string }) => `Adminie!
Grupa
${name}
została uaktualniona.

`;

export const groupDeleteMail = ({ name }: { name: string }) => `Grupa:
${name}

została usunięta.

Pozdrawiamy,
emeryk.pttk.pl
`;

export const groupCreateMail = ({
  chefGroupPhoneNumber,
  creationTime,
  email,
  leavingHour,
  name,
  password,
  pathName,
}: {
  chefGroupPhoneNumber: string;
  creationTime: string;
  email: string;
  leavingHour: string;
  name: string;
  password: string;
  pathName: string;
}) => `Dziękujemy za zgłoszenie grupy!
  
Możesz edytować swoje zgłoszenie logując się na
https://formularz-test.emeryk.pttk.pl

Twoim loginem jest adres email: ${email}
Hasło: ${password}

Hasło możesz zmienić w panelu po zalogowaniu.


<h2>Podsumowanie zgłoszenia</h2>
Data zgłoszenia: ${creationTime}
Nazwa drużyny: ${name}
Wybrana trasa: ${pathName}
Email zgłaszającego: ${email}
Telefon zgłaszającego: ${chefGroupPhoneNumber}
Planowana godzina startu: ${leavingHour}
  
Pozdrawiamy,
emeryk.pttk.pl
`;

export const groupCreateMailAdmin = ({ name }: { name: string }) => `Adminie!
Zostało dodane nowe zgłoszenie:

Nazwa grupy: ${name}

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

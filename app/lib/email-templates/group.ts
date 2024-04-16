export const groupCreateMail = ({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) => `Dziękujemy za zgłoszenie grupy!
  
Możesz edytować swoje zgłoszenie logując się na
https://formularz-test.emeryk.pttk.pl

Twoim loginem jest adres email: ${email}
Hasło: ${password}

Hasło możesz zmienić w panelu po zalogowaniu.


Podsumowanie zgłoszenia
Nazwa grupy: ${name}
  
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

export const createGroupMail = ({
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

export const createGroupMailAdmin = ({
  name,
  type = 'create',
}: {
  name: string;
  type: 'create' | 'update';
}) => `Adminie!
Zostało ${type === 'create' ? 'dodane nowe' : 'uaktualnione'} zgłoszenie:

Nazwa grupy: ${name}

`;

export const createUserMail = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => `Na ten adres email zostało utworzone konto do panelu zarządzania.
  
  Twoim loginem jest adres email: ${email}
  Hasło: ${password}
  
  Hasło możesz zmienić w panelu
  https://formularz-test.emeryk.pttk.pl
  
  emeryk.pttk.pl
  `;

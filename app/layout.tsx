import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Rajd Świętego Emeryka',
    default: 'Rajd Świętego Emeryka',
  },
  description: 'Formularz zgłoszeniowy do rajdu Świętego Emeryka',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}

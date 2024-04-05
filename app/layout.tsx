import React from 'react';
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
    <html lang="en" className="bg-white">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

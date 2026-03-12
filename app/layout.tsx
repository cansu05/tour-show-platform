import type {Metadata} from 'next';
import './globals.css';
import {AppProviders} from '@/lib/providers/app-providers';

export const metadata: Metadata = {
  title: 'Tour Tablet MVP',
  description: 'Tablet-friendly tourism tour presentation app'
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="de">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}


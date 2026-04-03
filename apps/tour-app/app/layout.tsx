import type {Metadata} from 'next';
import './globals.css';
import {AppProviders} from '@/lib/providers/app-providers';

export const metadata: Metadata = {
  title: 'Tour Show Platform',
  description: 'Tablet-friendly tourism tour presentation platform'
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


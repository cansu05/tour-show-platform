import type {Metadata} from 'next';
import './globals.css';
import {AppProviders} from '@/lib/providers/app-providers';

export const metadata: Metadata = {
  title: 'Tour Dashboard',
  description: 'Tur yönetim paneli'
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="tr">
      <body className="bg-app text-ink">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

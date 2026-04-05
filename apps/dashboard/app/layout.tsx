import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tour Dashboard',
  description: 'Tur yönetim paneli'
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="tr">
      <body className="bg-app text-ink">{children}</body>
    </html>
  );
}

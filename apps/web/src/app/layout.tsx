import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'SaaSPro — All-in-One Business Platform',
  description: 'Manage clients, automate workflows, track analytics, and grow your business — all in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={geistSans.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

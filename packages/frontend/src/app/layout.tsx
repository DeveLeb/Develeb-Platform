import './globals.css';

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import Footer from '@/components/molecules/Footer';
import Header from '@/components/molecules/Header';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'DeveLeb Platform',
  description: 'Platform for developers to connect',
};
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Header />
        {children}
        <Footer />
        <div id="portal"></div>
      </body>
    </html>
  );
}

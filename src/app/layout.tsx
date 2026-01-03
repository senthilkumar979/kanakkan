import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kanakkan',
  description: 'Kanakkan application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}


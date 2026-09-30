import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'foooo',
  description: 'Free-to-play football draft game experience built for the browser.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

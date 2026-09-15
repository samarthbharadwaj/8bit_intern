import './globals.css';
import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Portfolio Pulse | Investment Dashboard',
  description: 'A clear view of your portfolio performance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>{children}</body>
    </html>
  );
}

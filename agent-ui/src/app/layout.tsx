// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

// Load fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Roya | Data Vision Assistant',
  description: 'Roya - Your intelligent data science assistant that provides vision for your data',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>{children}</body>
    </html>
  );
}
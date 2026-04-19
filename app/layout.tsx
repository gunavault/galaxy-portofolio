import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Guna Dharma — Portfolio',
  description: 'Cybersecurity Engineer & Software Developer based in Jakarta',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

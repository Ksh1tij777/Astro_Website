import type { Metadata } from 'next';
import './globals.css';
import ScrollProvider from '@/components/ScrollProvider';
import SpaceBackground from '@/components/SpaceBackground';
import Nav from '@/components/Nav';
import CelestialGauge from '@/components/CelestialGauge';

export const metadata: Metadata = {
  title: 'Astronomy Club, LNMIIT',
  description: 'A cinematic journey through the cosmos — the LNMIIT astronomy collective.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Geist:wght@400;500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollProvider>
          {/* Shared shell — lives once, wraps every page */}
          <SpaceBackground />
          <div className="vignette" aria-hidden />
          <Nav />
          <CelestialGauge />
          <main className="main">{children}</main>
        </ScrollProvider>
      </body>
    </html>
  );
}

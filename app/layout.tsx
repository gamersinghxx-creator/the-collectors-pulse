import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Space_Mono } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';
import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

const spaceMono = Space_Mono({ subsets: ['latin'], variable: '--font-space-mono', weight: ['400', '700'] });

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#07070D' };

export const metadata: Metadata = {
  title: "The Collector's Pulse | AI-Curated News for Collectors",
  description: "The world's first AI-curated news feed for hobby collectors — trading cards, anime figures, and luxury watches.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;
  return (
    <html lang="en" suppressHydrationWarning className={spaceMono.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen" style={{ background: 'var(--obsidian)' }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {GA_ID && (<><Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /><Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script></>)}
          {ADSENSE_ID && (<Script id="adsbygoogle-init" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`} strategy="afterInteractive" crossOrigin="anonymous" />)}
          <Suspense fallback={null}><Header /></Suspense>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

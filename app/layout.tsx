import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter, Outfit } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#121212',
};

export const metadata: Metadata = {
  title: "The Collector's Pulse | Premium TCG, Figures & Watch Drops",
  description: "Real-time AI-curated news aggregator for One Piece TCG, Pokémon, S.H.Figuarts, Rolex, and luxury collectibles. Live drop alerts and hype tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen bg-fixed bg-gradient-to-br from-[var(--color-vault-bg)] via-[var(--color-vault-bg)] to-[var(--color-vault-bg-alt)]">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* Google Analytics 4 */}
          {GA_ID && (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
              <Script id="ga-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `}
              </Script>
            </>
          )}

          {/* Google AdSense */}
          {ADSENSE_ID && (
            <Script 
              id="adsbygoogle-init" 
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`} 
              strategy="afterInteractive" 
              crossOrigin="anonymous" 
            />
          )}

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

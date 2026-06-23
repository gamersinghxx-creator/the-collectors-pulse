import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-[var(--color-vault-border)]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-vault-bg-alt)]/50 to-[var(--color-vault-bg-alt)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-outfit text-base font-black tracking-tight text-gray-900 dark:text-white leading-none">
                  THE COLLECTOR&apos;S
                </span>
                <span className="font-outfit text-[10px] font-bold tracking-[0.35em] text-amber-600 dark:text-amber-400 leading-none">
                  PULSE
                </span>
              </div>
            </Link>
            <p className="font-inter text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              AI-curated news and drop alerts for TCG, collectible figures, and luxury watches. Never miss a drop.
            </p>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-outfit text-xs font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {['TCG', 'Figures', 'Watches'].map((cat) => (
                <li key={cat}>
                  <Link 
                    href={`/?category=${cat.toLowerCase()}`} 
                    className="font-inter text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-outfit text-xs font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-4">About</h3>
            <ul className="space-y-2.5">
              <li>
                <span className="font-inter text-sm text-gray-600 dark:text-gray-400">
                  Powered by Gemini AI
                </span>
              </li>
              <li>
                <span className="font-inter text-sm text-gray-600 dark:text-gray-400">
                  Data from Reddit, RSS, & more
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-vault-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-inter text-xs text-gray-400 dark:text-gray-600">
            © {currentYear} The Collector&apos;s Pulse. All rights reserved.
          </span>
          <span className="font-inter text-xs text-gray-400 dark:text-gray-600">
            Built with Next.js + Supabase + Gemini
          </span>
        </div>
      </div>
    </footer>
  );
}

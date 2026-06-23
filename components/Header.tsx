'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Zap, Menu, X } from 'lucide-react';
import { CATEGORIES } from '../lib/constants';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category')?.toUpperCase() || 'ALL';

  return (
    <header className="relative z-40 w-full">
      <div className="bg-[var(--color-vault-card)]/70 backdrop-blur-2xl border-b border-[var(--color-vault-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
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

            {/* Desktop Category Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={cat === 'ALL' ? '/' : `/?category=${cat.toLowerCase()}`}
                  className={`font-outfit text-xs font-bold tracking-[0.15em] px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    currentCategory === cat
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg bg-[var(--color-vault-card)] border border-[var(--color-vault-border)] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--color-vault-border)] bg-[var(--color-vault-card)]/90 backdrop-blur-2xl">
            <nav className="flex flex-col p-4 gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={cat === 'ALL' ? '/' : `/?category=${cat.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className={`font-outfit text-sm font-bold tracking-[0.15em] px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-200 ${
                    currentCategory === cat
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

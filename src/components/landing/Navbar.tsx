import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

interface NavbarProps {
  isAuthenticated: boolean;
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onNavigateLogin,
  onNavigateDashboard,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '#hero-visual' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'AI Assistant', href: '#ai-assistant' },
    { label: 'Security', href: '#security' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08]'
          : 'bg-white/80 dark:bg-black/80 backdrop-blur-xs border-b border-slate-200/50 dark:border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs tracking-tight shadow-2xs">
            OS
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Outreach<span className="text-indigo-600 dark:text-indigo-400 font-bold">OS</span>
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-slate-600 dark:text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Area (Desktop) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />

          {isAuthenticated ? (
            <button
              id="navbar-dashboard-btn"
              onClick={onNavigateDashboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                id="navbar-sign-in-btn"
                onClick={onNavigateLogin}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                id="navbar-get-started-btn"
                onClick={onNavigateLogin}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Action Controls Area */}
        <div className="flex md:hidden items-center gap-1.5">
          <ThemeToggle />
          {isAuthenticated && (
            <button
              onClick={onNavigateDashboard}
              className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold"
            >
              App
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/[0.06] bg-white/95 dark:bg-[#050505]/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-[#121212] hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateDashboard();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateLogin();
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#121212]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateLogin();
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


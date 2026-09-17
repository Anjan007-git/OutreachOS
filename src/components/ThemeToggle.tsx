import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/theme';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabels = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabels && (
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 select-none">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
      <button
        type="button"
        id="theme-toggle-switch"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to pure black theme'}
        onClick={toggleTheme}
        className="relative inline-flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 dark:border-white/[0.08] bg-slate-100/90 hover:bg-slate-200/80 dark:bg-[#0c0c0c] dark:hover:bg-[#161616] text-slate-700 hover:text-slate-950 dark:text-zinc-300 dark:hover:text-white shadow-2xs transition-all duration-200 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
      >
        {/* Sun Icon (Visible in Light Mode, smooth rotation & crossfade out in Dark) */}
        <Sun
          className={`w-4 h-4 transition-all duration-300 ease-out transform ${
            isDark
              ? 'opacity-0 rotate-90 scale-50 pointer-events-none absolute'
              : 'opacity-100 rotate-0 scale-100 text-amber-600 dark:text-amber-400'
          }`}
        />

        {/* Moon Icon (Visible in Dark Mode, smooth rotation & crossfade out in Light) */}
        <Moon
          className={`w-4 h-4 transition-all duration-300 ease-out transform ${
            isDark
              ? 'opacity-100 rotate-0 scale-100 text-zinc-200'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none absolute'
          }`}
        />
      </button>
    </div>
  );
};

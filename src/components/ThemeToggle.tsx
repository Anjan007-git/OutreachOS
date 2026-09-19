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
        className="relative inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 dark:border-[#1F1F1F] bg-slate-100 hover:bg-slate-200/80 dark:bg-[#0A0A0A] dark:hover:bg-[#111111] text-slate-700 hover:text-slate-900 dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF] transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
      >
        {/* Sun Icon (Visible in Light Mode) */}
        <Sun
          className={`w-4 h-4 transition-all duration-200 ease-out transform ${
            isDark
              ? 'opacity-0 scale-75 pointer-events-none absolute'
              : 'opacity-100 scale-100 text-amber-600'
          }`}
        />

        {/* Moon Icon (Visible in Dark Mode) */}
        <Moon
          className={`w-4 h-4 transition-all duration-200 ease-out transform ${
            isDark
              ? 'opacity-100 scale-100 text-[#FFFFFF]'
              : 'opacity-0 scale-75 pointer-events-none absolute'
          }`}
        />
      </button>
    </div>
  );
};

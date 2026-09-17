import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
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
        title={isDark ? 'Switch to light theme' : 'Switch to dark (black) theme'}
        onClick={toggleTheme}
        className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
          isDark
            ? 'bg-black border border-zinc-700 shadow-inner'
            : 'bg-slate-200/90 hover:bg-slate-300/80 border border-slate-300/70'
        }`}
      >
        {/* Background icon indicators inside the track */}
        <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
          <Sun
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'opacity-30 text-zinc-500' : 'opacity-80 text-amber-500'
            }`}
          />
          <Moon
            className={`w-3.5 h-3.5 transition-opacity duration-200 ${
              isDark ? 'opacity-90 text-zinc-300' : 'opacity-25 text-slate-400'
            }`}
          />
        </div>

        {/* Sliding Thumb */}
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-colors duration-200 ${
            isDark
              ? 'translate-x-6 bg-zinc-800 text-zinc-100 border border-zinc-600'
              : 'translate-x-0 bg-white text-amber-500 border border-amber-200/50'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-zinc-200" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
          )}
        </motion.span>
      </button>
    </div>
  );
};

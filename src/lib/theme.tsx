import React, { createContext, useContext, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Global subscribers for components that consume `useTheme()`
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((callback) => callback());
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Reads directly from the DOM documentElement class list.
 * This guarantees class-based DOM truth with zero state desynchronization.
 */
export function getThemeSnapshot(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

let transitionTimer: number | null = null;

/**
 * Direct class-based toggle on documentElement.
 * Synchronously updates documentElement classes and localStorage,
 * triggering 'theme-transitioning' for exactly 200ms without triggering React re-renders.
 */
export function applyThemeClass(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Activate transition state on documentElement
  if (!prefersReducedMotion) {
    root.classList.add('theme-transitioning');
    if (transitionTimer !== null) {
      window.clearTimeout(transitionTimer);
    }
    // Clean up 'theme-transitioning' after exactly 200ms to maintain 60fps performance
    transitionTimer = window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
      transitionTimer = null;
    }, 200);
  }

  // 2. Class-based toggle on documentElement
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // 3. Persist user preference
  try {
    localStorage.setItem('outreachos_theme', theme);
  } catch (e) {
    // Gracefully handle storage quota or privacy mode restrictions
  }

  // 4. Notify subscribers (only specific consumers like ThemeToggle re-evaluate, NOT the entire React tree)
  notifySubscribers();
}

export function toggleThemeClass(): void {
  const current = getThemeSnapshot();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyThemeClass(next);
}

// Stable static context actions so Provider never creates new object references
const themeContextActions = {
  toggleTheme: toggleThemeClass,
  setTheme: applyThemeClass,
};

const ThemeContext = createContext<typeof themeContextActions>(themeContextActions);

/**
 * ThemeProvider wraps the application without holding state.
 * Because it has no useState, toggling the theme NEVER re-renders ThemeProvider or its children,
 * eliminating all React reconciliation overhead during theme transitions.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Listen for system theme changes if user hasn't explicitly set an override
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem('outreachos_theme');
        if (!saved) {
          applyThemeClass(e.matches ? 'dark' : 'light');
        }
      } catch (e) {}
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  return <ThemeContext.Provider value={themeContextActions}>{children}</ThemeContext.Provider>;
};

/**
 * Hook for consuming components (e.g. ThemeToggle).
 * Uses useSyncExternalStore to subscribe directly to documentElement's class state.
 */
export const useTheme = (): ThemeContextType => {
  const currentTheme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);

  return {
    theme: currentTheme,
    isDark: currentTheme === 'dark',
    toggleTheme: toggleThemeClass,
    setTheme: applyThemeClass,
  };
};

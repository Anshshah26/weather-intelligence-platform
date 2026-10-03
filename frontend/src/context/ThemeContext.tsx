import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemePreference;
  activeTheme: ActiveTheme;
  setTheme: (newTheme: ThemePreference) => void;
}

const STORAGE_KEY = 'weather_theme';

const VALID_THEMES: ThemePreference[] = ['light', 'dark', 'system'];

function normalizeTheme(val: string | null): ThemePreference {
  if (!val) return 'dark';
  const lower = val.toLowerCase().trim();
  if (VALID_THEMES.includes(lower as ThemePreference)) {
    return lower as ThemePreference;
  }
  return 'dark';
}

function getSystemTheme(): ActiveTheme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

function applyThemeToDocument(active: ActiveTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (active === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return normalizeTheme(stored);
    } catch {
      return 'dark';
    }
  });

  const [activeTheme, setActiveTheme] = useState<ActiveTheme>(() => {
    const pref = normalizeTheme(typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null);
    if (pref === 'system') {
      return getSystemTheme();
    }
    return pref;
  });

  const applyTheme = useCallback((pref: ThemePreference) => {
    let resolved: ActiveTheme;
    if (pref === 'system') {
      resolved = getSystemTheme();
    } else {
      resolved = pref;
    }
    setActiveTheme(resolved);
    applyThemeToDocument(resolved);
  }, []);

  const setTheme = (newTheme: ThemePreference) => {
    const valid = normalizeTheme(newTheme);
    setThemeState(valid);
    try {
      localStorage.setItem(STORAGE_KEY, valid);
    } catch (e) {
      console.error('Failed to save theme to localStorage', e);
    }
    applyTheme(valid);
  };

  // Sync initial theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // System theme change listener (ONLY active when theme === 'system')
  useEffect(() => {
    if (theme !== 'system') return;
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolved: ActiveTheme = e.matches ? 'dark' : 'light';
      setActiveTheme(newResolved);
      applyThemeToDocument(newResolved);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Legacy browser support
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  // Storage listener for cross-tab synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const updated = normalizeTheme(e.newValue);
        setThemeState(updated);
        applyTheme(updated);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

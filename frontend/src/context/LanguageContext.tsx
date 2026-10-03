import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SupportedLanguage,
  translations,
  TranslationDictionary,
  translateWeatherCondition,
} from '../i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDictionary, fallback?: string) => string;
  translateCondition: (condition: string | undefined | null) => string;
}

const STORAGE_KEY = 'weather_language';

const VALID_LANGUAGES: SupportedLanguage[] = ['english', 'gujarati', 'hindi'];

function normalizeLanguage(val: string | null): SupportedLanguage {
  if (!val) return 'english';
  const lower = val.toLowerCase().trim();
  if (VALID_LANGUAGES.includes(lower as SupportedLanguage)) {
    return lower as SupportedLanguage;
  }
  return 'english';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return normalizeLanguage(stored);
    } catch {
      return 'english';
    }
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    const valid = normalizeLanguage(lang);
    setLanguageState(valid);
    try {
      localStorage.setItem(STORAGE_KEY, valid);
    } catch (e) {
      console.error('Failed to save language to localStorage', e);
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setLanguageState(normalizeLanguage(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const t = useCallback(
    (key: keyof TranslationDictionary, fallback?: string): string => {
      const activeDict = translations[language] || translations.english;
      if (activeDict && activeDict[key]) {
        return activeDict[key];
      }
      const defaultDict = translations.english;
      if (defaultDict && defaultDict[key]) {
        return defaultDict[key];
      }
      return fallback || key;
    },
    [language]
  );

  const translateCondition = useCallback(
    (condition: string | undefined | null): string => {
      return translateWeatherCondition(condition, language);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateCondition }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

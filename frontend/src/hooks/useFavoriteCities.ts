import { useState, useEffect, useCallback } from 'react';
import { FavoriteCity } from '../types/weather';

export const FAVORITES_STORAGE_KEY = 'weather-intelligence-favorite-cities';
export const MAX_FAVORITES = 8;

const EVENT_NAME = 'weather_favorites_updated';

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function getStoredFavorites(): FavoriteCity[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is FavoriteCity => Boolean(item && typeof item === 'object' && typeof item.name === 'string' && item.name.trim()))
      .slice(0, MAX_FAVORITES);
  } catch (err) {
    console.warn('Invalid favorite cities in localStorage, resetting to empty array:', err);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
    } catch {
      // Ignore write error
    }
    return [];
  }
}

function saveFavorites(cities: FavoriteCity[]) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const sanitized = cities.slice(0, MAX_FAVORITES);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: sanitized }));
  } catch (err) {
    console.error('Failed to save favorite cities to localStorage:', err);
  }
}

export type AddFavoriteResult = 
  | { success: true; action: 'added' }
  | { success: false; action: 'limit_reached' | 'duplicate' };

export type ToggleFavoriteResult = 
  | { success: true; action: 'added' | 'removed' }
  | { success: false; action: 'limit_reached' };

export function useFavoriteCities() {
  const [favoriteCities, setFavoriteCities] = useState<FavoriteCity[]>(getStoredFavorites);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Sync state from localStorage on external updates or storage events
  const syncFromStorage = useCallback(() => {
    setFavoriteCities(getStoredFavorites());
  }, []);

  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<FavoriteCity[]>;
      if (custom.detail && Array.isArray(custom.detail)) {
        setFavoriteCities(custom.detail);
      } else {
        syncFromStorage();
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener(EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [syncFromStorage]);

  // Auto-clear feedback messages after 3.5 seconds
  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  const isFavorite = useCallback(
    (cityName: string): boolean => {
      if (!cityName) return false;
      const target = normalizeName(cityName);
      return favoriteCities.some((c) => normalizeName(c.name) === target);
    },
    [favoriteCities]
  );

  const addFavorite = useCallback(
    (city: FavoriteCity | (Partial<FavoriteCity> & { name: string })): AddFavoriteResult => {
      if (!city || !city.name || !city.name.trim()) {
        return { success: false, action: 'duplicate' };
      }

      const target = normalizeName(city.name);
      const current = getStoredFavorites();

      if (current.some((c) => normalizeName(c.name) === target)) {
        return { success: false, action: 'duplicate' };
      }

      if (current.length >= MAX_FAVORITES) {
        setFeedbackMessage('limit_reached');
        return { success: false, action: 'limit_reached' };
      }

      const newCity: FavoriteCity = {
        name: city.name.trim(),
        country: city.country,
        state: city.state,
        latitude: city.latitude,
        longitude: city.longitude,
        id: city.id || `${city.name}-${Date.now()}`,
        temperature: city.temperature,
        condition: city.condition,
      };

      const updated = [...current, newCity];
      saveFavorites(updated);
      setFavoriteCities(updated);
      setFeedbackMessage('added');
      return { success: true, action: 'added' };
    },
    []
  );

  const removeFavorite = useCallback((cityName: string): boolean => {
    if (!cityName) return false;
    const target = normalizeName(cityName);
    const current = getStoredFavorites();
    const updated = current.filter((c) => normalizeName(c.name) !== target);

    if (updated.length !== current.length) {
      saveFavorites(updated);
      setFavoriteCities(updated);
      setFeedbackMessage('removed');
      return true;
    }
    return false;
  }, []);

  const toggleFavorite = useCallback(
    (city: FavoriteCity | (Partial<FavoriteCity> & { name: string })): ToggleFavoriteResult => {
      if (!city || !city.name) return { success: false, action: 'limit_reached' };

      if (isFavorite(city.name)) {
        removeFavorite(city.name);
        return { success: true, action: 'removed' };
      } else {
        const res = addFavorite(city);
        if (res.success) {
          return { success: true, action: 'added' };
        }
        return { success: false, action: 'limit_reached' };
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const updateCityWeather = useCallback(
    (cityName: string, temp?: number, condition?: string) => {
      if (!cityName) return;
      const target = normalizeName(cityName);
      const current = getStoredFavorites();
      let changed = false;

      const updated = current.map((c) => {
        if (normalizeName(c.name) === target) {
          if (c.temperature !== temp || c.condition !== condition) {
            changed = true;
            return {
              ...c,
              temperature: temp !== undefined ? temp : c.temperature,
              condition: condition !== undefined ? condition : c.condition,
            };
          }
        }
        return c;
      });

      if (changed) {
        saveFavorites(updated);
        setFavoriteCities(updated);
      }
    },
    []
  );

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
    setFavoriteCities([]);
  }, []);

  return {
    favoriteCities,
    count: favoriteCities.length,
    maxFavorites: MAX_FAVORITES,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    updateCityWeather,
    clearFavorites,
    feedbackMessage,
    clearFeedback: () => setFeedbackMessage(null),
  };
}

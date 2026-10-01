import { UserSettings, DEFAULT_USER_SETTINGS, TemperatureUnit, WindUnit, PressureUnit } from '../types/settings';

const STORAGE_KEY = 'user_weather_settings';

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_SETTINGS;
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}

export function resetUserSettings(): UserSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset settings', err);
  }
  return DEFAULT_USER_SETTINGS;
}

// Unit conversion helpers
export function formatTemp(tempC: number, unit: TemperatureUnit = 'celsius'): string {
  if (unit === 'fahrenheit') {
    const tempF = Math.round((tempC * 9) / 5 + 32);
    return `${tempF}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatWind(windKmh: number, unit: WindUnit = 'kmh'): string {
  if (unit === 'mph') {
    const windMph = Math.round(windKmh * 0.621371);
    return `${windMph} mph`;
  }
  return `${Math.round(windKmh)} km/h`;
}

export function formatPressure(pressureHpa: number, unit: PressureUnit = 'hpa'): string {
  if (unit === 'inhg') {
    const pressureInhg = (pressureHpa * 0.02953).toFixed(2);
    return `${pressureInhg} inHg`;
  }
  return `${Math.round(pressureHpa)} hPa`;
}

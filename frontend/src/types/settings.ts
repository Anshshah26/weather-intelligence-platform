export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph';
export type PressureUnit = 'hpa' | 'inhg';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserSettings {
  tempUnit: TemperatureUnit;
  windUnit: WindUnit;
  pressureUnit: PressureUnit;
  theme: ThemeMode;
  weatherAlerts: boolean;
  rainAlerts: boolean;
  umbrellaAlerts: boolean;
  defaultLocation: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  pressureUnit: 'hpa',
  theme: 'dark',
  weatherAlerts: true,
  rainAlerts: true,
  umbrellaAlerts: true,
  defaultLocation: 'Mumbai',
};

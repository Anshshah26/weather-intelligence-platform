export interface WeatherLocation {
  city: string;
  state?: string | null;
  country: string;
  latitude: number;
  longitude: number;
  source?: 'search' | 'gps' | string | null;
}

export interface CitySuggestion {
  name: string;
  state?: string | null;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  visibility: number;
  condition: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
}

export interface HourlyItem {
  time: string;
  timestamp: number;
  temperature: number;
  feels_like: number;
  condition: string;
  description: string;
  icon: string;
  precipitation_probability: number;
  wind_speed: number;
  humidity: number;
  date?: string;
}

export interface HourlyForecastResponse {
  location: {
    city: string;
    country: string;
  };
  hourly: HourlyItem[];
}

export interface DailyItem {
  date: string;
  day: string;
  temperature: {
    min: number;
    max: number;
  };
  condition: string;
  description: string;
  icon: string;
  precipitation_probability: number;
  humidity: number;
  wind_speed: number;
}

export interface DailyForecastResponse {
  location: {
    city: string;
    country: string;
  };
  daily: DailyItem[];
}

export interface CurrentWeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  uvDescription: string;
  highTemp: number;
  lowTemp: number;
  updatedAt: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'partly-cloudy' | 'rain' | 'storm';
  rainProbability: number;
  iconName: string;
}

export interface ActivityScoreItem {
  id: string;
  name: string;
  score: number; // 0 to 100
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  icon: string;
}

export interface RainAlertData {
  title: string;
  message: string;
  recommendation: string;
  probabilityIncreaseTime: string;
  severity: 'low' | 'medium' | 'high';
}

export interface WeatherSummaryData {
  title: string;
  headline: string;
  description: string;
  highlights: string[];
}

export interface RadarFrame {
  timestamp: number;
  displayTime: string;
  type: 'historical' | 'current' | 'forecast';
  tileUrl: string;
}

export interface RadarResponse {
  status: string;
  available: boolean;
  provider: string;
  message: string;
  frames: RadarFrame[];
}

export interface AirQualityMetrics {
  aqi: number;
  category: string;
  description: string;
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
}

export interface AirQualityResponse {
  location: {
    city: string;
    country: string;
  };
  air_quality: AirQualityMetrics;
}

export interface FavoriteCity {
  name: string;
  country?: string;
  state?: string | null;
  latitude?: number;
  longitude?: number;
  id?: string | number;
  temperature?: number;
  condition?: string;
}


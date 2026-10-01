const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
import { getAuthHeader } from './authApi';

export interface CityComparisonRequest {
  cities: string[];
  activity?: string;
  forecast_day?: string;
}

export interface CityMetrics {
  name: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  rain_probability: number;
  wind_speed: number;
  pressure: number;
  visibility: number;
  condition: string;
  description: string;
  icon: string;
  activity_score?: number;
  activity_category?: string;
  is_available: boolean;
  error_message?: string;
}

export interface CityComparisonResponse {
  cities: CityMetrics[];
  activity?: string;
  ai_summary?: string;
  disclaimer: string;
}

export async function compareWeatherCities(
  request: CityComparisonRequest
): Promise<CityComparisonResponse> {
  const response = await fetch(`${API_BASE_URL}/api/weather/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.detail || 'Unable to compare city weather right now. Please try again.';
    throw new Error(message);
  }

  return response.json();
}

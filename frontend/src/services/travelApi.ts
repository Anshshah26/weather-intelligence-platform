const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
import { getAuthHeader } from './authApi';


export interface TravelPlannerRequest {
  destination: string;
  start_date: string;
  end_date: string;
}

export interface TravelDestination {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface TravelDailyForecast {
  date: string;
  day: string;
  condition: string;
  icon: string;
  min_temp: number;
  max_temp: number;
  precipitation_probability: number;
  wind_speed: number;
  humidity: number;
  is_available: boolean;
  note?: string;
}

export interface TravelRainAnalysis {
  highest_rain_day?: string;
  lowest_rain_day?: string;
  rain_risk_days: string[];
}

export interface TravelTemperatureAnalysis {
  warmest_day?: string;
  coolest_day?: string;
  average_temperature: number;
}

export interface TravelPlannerResponse {
  destination: TravelDestination;
  start_date: string;
  end_date: string;
  available_forecast_days: number;
  trip_summary: string;
  daily_forecasts: TravelDailyForecast[];
  rain_analysis: TravelRainAnalysis;
  temperature_analysis: TravelTemperatureAnalysis;
  packing_suggestions: string[];
  personalized_activity_note?: string;
  ai_summary?: string;
}

export async function analyzeTripWeather(
  request: TravelPlannerRequest
): Promise<TravelPlannerResponse> {
  const response = await fetch(`${API_BASE_URL}/api/travel/weather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.detail || 'Unable to analyze the trip right now. Please try again.';
    throw new Error(message);
  }

  return response.json();
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
import { getAuthHeader } from './authApi';

export interface ActivityWeatherSummary {
  city: string;
  time: string;
  temperature: number;
  condition: string;
  precipitation_probability: number;
  wind_speed: number;
  humidity: number;
}

export interface ActivityScoreResponse {
  activity: string;
  score: number;
  category: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Very Poor';
  reasons: string[];
  warnings: string[];
  weather_summary: ActivityWeatherSummary;
  ai_explanation?: string;
}

export async function getActivityScore(
  activity: string,
  city: string,
  date: string = 'today',
  time?: string
): Promise<ActivityScoreResponse> {
  const response = await fetch(`${API_BASE_URL}/api/activity-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      activity: activity.toLowerCase().replace(/\s+/g, '_'),
      city: city.trim(),
      date,
      time,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.detail || 'Unable to calculate activity suitability score.';
    throw new Error(message);
  }

  return response.json();
}

export async function getAllActivityScores(city: string): Promise<ActivityScoreResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/activities/all-scores?city=${encodeURIComponent(city.trim())}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  if (!response.ok) {
    throw new Error('Unable to retrieve activity scores.');
  }
  return response.json();
}

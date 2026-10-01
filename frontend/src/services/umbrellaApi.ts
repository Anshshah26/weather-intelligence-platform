const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface UmbrellaAlertResponse {
  location: string;
  checked_at: string;
  status: 'low' | 'medium' | 'high';
  needed: boolean;
  severity: 'low' | 'medium' | 'high';
  message: string;
  rain_probability: number;
  expected_time?: string;
  expires_at?: string;
}

export async function getUmbrellaAlert(city: string): Promise<UmbrellaAlertResponse> {
  const response = await fetch(`${API_BASE_URL}/api/weather/umbrella-alert?city=${encodeURIComponent(city.trim())}`);
  if (!response.ok) {
    throw new Error('Unable to retrieve smart umbrella recommendation.');
  }
  return response.json();
}

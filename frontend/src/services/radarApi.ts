import { RadarResponse } from '../types/weather';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

let cachedRadarResponse: RadarResponse | null = null;
let lastFetchTimestamp = 0;
const RADAR_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes client-side cache

export async function getRadarData(refresh = false): Promise<RadarResponse> {
  const now = Date.now();
  if (!refresh && cachedRadarResponse && now - lastFetchTimestamp < RADAR_CACHE_TTL_MS) {
    return cachedRadarResponse;
  }

  const url = `${API_BASE_URL}/api/weather/radar${refresh ? '?refresh=true' : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch radar service status: HTTP ${response.status}`);
  }
  const data: RadarResponse = await response.json();
  cachedRadarResponse = data;
  lastFetchTimestamp = Date.now();
  return data;
}

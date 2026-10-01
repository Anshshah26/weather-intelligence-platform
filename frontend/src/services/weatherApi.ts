import { CurrentWeatherResponse, HourlyForecastResponse, DailyForecastResponse, AirQualityResponse, CitySuggestion } from '../types/weather';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function getCitySuggestions(query: string, signal?: AbortSignal): Promise<CitySuggestion[]> {
  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/city-suggestions?q=${encodeURIComponent(cleanQuery)}`, { signal });
    if (!response.ok) {
      return [];
    }
    const data: CitySuggestion[] = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    return [];
  }
}

export async function getCurrentWeather(city: string): Promise<CurrentWeatherResponse> {
  const cleanCity = city.trim();
  if (!cleanCity) {
    throw new Error('Please enter a valid city name.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/current?city=${encodeURIComponent(cleanCity)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Unable to find weather data for "${cleanCity}". Please check the spelling.`);
      }
      if (response.status === 400) {
        throw new Error('Invalid city search parameter.');
      }
      if (response.status >= 500) {
        throw new Error('Weather service is currently experiencing technical difficulties. Please try again.');
      }
      throw new Error('Unable to retrieve weather data for this location.');
    }

    const data: CurrentWeatherResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error. Unable to connect to backend server.');
  }
}

export async function getWeatherByCoordinates(lat: number, lon: number): Promise<CurrentWeatherResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/coordinates?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error('Unable to retrieve weather data for your GPS location.');
    }
    const data: CurrentWeatherResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error. Unable to fetch GPS location weather.');
  }
}

export async function getHourlyForecast(city: string): Promise<HourlyForecastResponse> {
  const cleanCity = city.trim();
  if (!cleanCity) {
    throw new Error('Please enter a valid city name.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/hourly?city=${encodeURIComponent(cleanCity)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Unable to find forecast data for "${cleanCity}".`);
      }
      if (response.status === 400) {
        throw new Error('Invalid city parameter for forecast.');
      }
      if (response.status >= 500) {
        throw new Error('Forecast service is currently unavailable.');
      }
      throw new Error('Unable to retrieve hourly forecast data.');
    }

    const data: HourlyForecastResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error connecting to forecast service.');
  }
}

export async function getDailyForecast(city: string): Promise<DailyForecastResponse> {
  const cleanCity = city.trim();
  if (!cleanCity) {
    throw new Error('Please enter a valid city name.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/daily?city=${encodeURIComponent(cleanCity)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Unable to find daily forecast for "${cleanCity}".`);
      }
      if (response.status === 400) {
        throw new Error('Invalid city parameter for daily forecast.');
      }
      if (response.status >= 500) {
        throw new Error('Daily forecast service is currently unavailable.');
      }
      throw new Error('Unable to retrieve daily forecast data.');
    }

    const data: DailyForecastResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error connecting to daily forecast service.');
  }
}

export async function getAirQuality(city: string): Promise<AirQualityResponse> {
  const cleanCity = city.trim();
  if (!cleanCity) {
    throw new Error('Please enter a valid city name.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/air-quality?city=${encodeURIComponent(cleanCity)}`);
    if (!response.ok) {
      throw new Error('Air quality data is temporarily unavailable.');
    }
    return response.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Unable to connect to air quality service.');
  }
}

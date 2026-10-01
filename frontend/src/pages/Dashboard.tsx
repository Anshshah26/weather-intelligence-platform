import { CurrentWeatherCard } from '../components/weather/CurrentWeatherCard';
import { HourlyForecast } from '../components/forecast/HourlyForecast';
import { WeatherOverview } from '../components/weather/WeatherOverview';
import { ActivityScore } from '../components/activities/ActivityScore';
import { WeatherSummaryCard } from '../components/weather/WeatherSummaryCard';
import {
  CurrentWeatherResponse,
  HourlyForecastResponse,
  DailyForecastResponse,
} from '../types/weather';
import {
  mockActivityScores,
  mockWeatherSummary,
} from '../data/mockWeather';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DashboardProps {
  weatherData: CurrentWeatherResponse | null;
  loading: boolean;
  error: string | null;
  hourlyData: HourlyForecastResponse | null;
  hourlyLoading: boolean;
  hourlyError: string | null;
  dailyData: DailyForecastResponse | null;
  dailyLoading: boolean;
  dailyError: string | null;
  backendConnected: boolean | null;
  onRefresh: () => void;
}

export const Dashboard = ({
  weatherData,
  loading,
  error,
  hourlyData,
  hourlyLoading,
  hourlyError,
  dailyData,
  dailyLoading,
  dailyError,
  backendConnected,
  onRefresh,
}: DashboardProps) => {
  // Mock fallback payload if backend is offline or before initial fetch
  const defaultFallbackPayload: CurrentWeatherResponse = {
    location: {
      city: 'Mumbai',
      country: 'IN',
      latitude: 19.0760,
      longitude: 72.8777,
    },
    current: {
      temperature: 29.0,
      feels_like: 31.0,
      humidity: 72,
      pressure: 1012,
      wind_speed: 14.0,
      visibility: 8.0,
      condition: 'Partly Cloudy',
      description: 'partly cloudy',
      icon: '03d',
    },
  };

  const activeWeatherData = weatherData || defaultFallbackPayload;
  const isAnyLoading = loading || hourlyLoading || dailyLoading;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* User-Friendly Error Alert Banner */}
      {error && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 text-amber-300 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Loading Overlay / Progress Indicator */}
      {isAnyLoading && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center gap-2 text-cyan-300 text-xs font-mono animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Fetching live atmospheric telemetry from FastAPI server...</span>
        </div>
      )}

      {/* Main Current Weather Card */}
      <div>
        <CurrentWeatherCard
          data={activeWeatherData}
          isRealData={!!weatherData}
        />
      </div>

      {/* Hourly Forecast Section */}
      <HourlyForecast
        items={hourlyData?.hourly || []}
        loading={hourlyLoading}
        error={hourlyError}
        isRealData={!!hourlyData}
      />

      {/* Today's Overview Section */}
      <WeatherOverview
        humidity={activeWeatherData.current.humidity}
        windSpeed={activeWeatherData.current.wind_speed}
        pressure={activeWeatherData.current.pressure}
        visibility={activeWeatherData.current.visibility}
        isRealData={!!weatherData}
      />

      {/* Bottom Grid: Activity Score & Weather Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityScore items={mockActivityScores} />
        <WeatherSummaryCard summary={mockWeatherSummary} />
      </div>
    </div>
  );
};

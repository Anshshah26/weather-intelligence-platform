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
  backendConnected: _backendConnected,
  onRefresh: _onRefresh,
}: DashboardProps) => {
  // Fallback payload if backend is offline or before initial fetch
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
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* User-Friendly Error Alert Banner */}
      {error && (
        <div className="p-3.5 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg flex items-center gap-3 text-[#EB5757] text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#EB5757]" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Loading Progress Indicator */}
      {isAnyLoading && (
        <div className="p-2.5 bg-[#24313C] border border-[#2B3945] rounded-lg flex items-center justify-center gap-2 text-[#56CCF2] text-xs font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2F80ED]" />
          <span>Synchronizing meteorological telemetry feed...</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActivityScore items={mockActivityScores} />
        <WeatherSummaryCard summary={mockWeatherSummary} />
      </div>
    </div>
  );
};

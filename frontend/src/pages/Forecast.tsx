import { useState, useEffect, useCallback } from 'react';
import { DailyForecast } from '../components/forecast/DailyForecast';
import { HourlyForecast } from '../components/forecast/HourlyForecast';
import { AirQualityCard } from '../components/forecast/AirQualityCard';
import { WeatherTrendsGraph } from '../components/forecast/WeatherTrendsGraph';
import { getAirQuality } from '../services/weatherApi';
import {
  DailyForecastResponse,
  HourlyForecastResponse,
  AirQualityMetrics,
} from '../types/weather';
import { CalendarDays, RefreshCw, AlertCircle } from 'lucide-react';

interface ForecastPageProps {
  dailyData?: DailyForecastResponse | null;
  hourlyData?: HourlyForecastResponse | null;
  loading?: boolean;
  error?: string | null;
  onSearchCity?: (city: string) => void;
  onRefresh?: () => void;
  onEnsureForecastData?: (city: string) => void;
}

export const ForecastPage = ({
  dailyData,
  hourlyData,
  loading = false,
  error = null,
  onSearchCity,
  onRefresh,
  onEnsureForecastData,
}: ForecastPageProps) => {
  const dailyItems = dailyData?.daily || [];
  const cityName = dailyData?.location?.city || hourlyData?.location?.city || 'Mumbai';
  const countryName = dailyData?.location?.country || hourlyData?.location?.country || '';

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [airQuality, setAirQuality] = useState<AirQualityMetrics | null>(null);
  const [aqLoading, setAqLoading] = useState<boolean>(true);
  const [aqError, setAqError] = useState<string | null>(null);

  // Ensure forecast data (hourly & daily) is requested on demand when ForecastPage mounts
  useEffect(() => {
    if (onEnsureForecastData && cityName) {
      onEnsureForecastData(cityName);
    }
  }, [cityName, onEnsureForecastData]);

  // Fetch Air Quality data whenever city changes
  const fetchAirQualityData = useCallback(async (city: string) => {
    setAqLoading(true);
    setAqError(null);
    try {
      const res = await getAirQuality(city);
      setAirQuality(res.air_quality);
    } catch (err: unknown) {
      setAqError(err instanceof Error ? err.message : 'Air quality data is temporarily unavailable.');
    } finally {
      setAqLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cityName) {
      fetchAirQualityData(cityName);
    }
  }, [cityName, fetchAirQualityData]);

  // Default select Today (first day) when dailyData loads
  useEffect(() => {
    if (dailyItems.length > 0) {
      if (!selectedDate || !dailyItems.some((item) => item.date === selectedDate)) {
        setSelectedDate(dailyItems[0].date);
      }
    }
  }, [dailyItems, selectedDate]);

  const selectedIndex = dailyItems.findIndex((item) => item.date === selectedDate);
  const selectedDailyItem = dailyItems[selectedIndex >= 0 ? selectedIndex : 0];
  const selectedDateLabel = selectedDailyItem
    ? `${selectedDailyItem.day} (${selectedDailyItem.date})`
    : selectedDate || 'Today';

  // Filter hourly items for the selected date
  const filteredHourlyItems = (hourlyData?.hourly || []).filter((hItem) => {
    if (!hItem.date) return true;
    return hItem.date === selectedDate;
  });

  const displayHourlyItems =
    filteredHourlyItems.length > 0
      ? filteredHourlyItems
      : (hourlyData?.hourly || []).slice(
        (selectedIndex >= 0 ? selectedIndex : 0) * 8,
        ((selectedIndex >= 0 ? selectedIndex : 0) + 1) * 8
      );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Forecast Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <CalendarDays className="w-3.5 h-3.5" /> Meteorological & Atmospheric Analysis
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Forecast Center — {cityName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {cityName
              ? `Daily forecast summaries, live air quality telemetry, and trend graphs for ${cityName}${countryName ? `, ${countryName}` : ''}`
              : 'Multi-day atmospheric trend analysis'}
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={() => {
              onRefresh();
              fetchAirQualityData(cityName);
            }}
            disabled={loading || aqLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-cyan-300 text-xs font-semibold transition-all disabled:opacity-50 shrink-0"
            title="Refresh forecast & air quality data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || aqLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Main Forecast Error Alert */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-300 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <span className="font-semibold block">Unable to load forecast data.</span>
              <span className="text-xs text-rose-400">{error}</span>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold transition-colors shrink-0"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Daily Extended Forecast Component */}
      <DailyForecast
        items={dailyItems}
        loading={loading}
        error={null}
        isRealData={!!dailyData}
      />

      {/* Air Quality & Weather Trends Graph Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AirQualityCard
          airQuality={airQuality}
          city={cityName}
          loading={aqLoading}
          error={aqError}
          onRetry={() => fetchAirQualityData(cityName)}
        />
        <WeatherTrendsGraph
          items={displayHourlyItems}
          selectedDateLabel={selectedDateLabel}
          loading={loading}
          error={error}
          onRetry={onRefresh}
        />
      </div>

      {/* Hourly Weather Section */}
      <HourlyForecast
        items={displayHourlyItems}
        loading={loading}
        error={null}
        isRealData={!!hourlyData}
      />
    </div>
  );
};

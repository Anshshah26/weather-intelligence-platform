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
import { useLanguage } from '../context/LanguageContext';

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
  onSearchCity: _onSearchCity,
  onRefresh,
  onEnsureForecastData,
}: ForecastPageProps) => {
  const { t } = useLanguage();
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
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Forecast Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18232D] border border-[#2B3945] p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#56CCF2] mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-[#2F80ED]" /> Meteorological & Atmospheric Analysis
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">
            {t('forecast', 'Forecast Station')} — {cityName}
          </h1>
          <p className="text-xs text-[#9AA8B2] mt-0.5">
            {cityName
              ? `Multi-day atmospheric projections, air quality telemetry, and trend graphs for ${cityName}${countryName ? `, ${countryName}` : ''}`
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#24313C] hover:bg-[#2A3946] border border-[#2B3945] hover:border-[#3A4A57] text-[#F4F7F9] text-xs font-medium transition-colors disabled:opacity-50 shrink-0"
            title="Refresh forecast & air quality data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || aqLoading ? 'animate-spin text-[#2F80ED]' : 'text-[#56CCF2]'}`} />
            <span>{t('refreshTelemetry', 'Refresh Telemetry')}</span>
          </button>
        )}
      </div>

      {/* Main Forecast Error Alert */}
      {error && (
        <div className="p-3.5 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#EB5757] text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#EB5757]" />
            <div>
              <span className="font-semibold block">Unable to load forecast data.</span>
              <span className="text-xs text-[#EB5757]/80">{error}</span>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 rounded bg-[#EB5757]/20 hover:bg-[#EB5757]/30 border border-[#EB5757]/40 text-[#F4F7F9] text-xs font-medium transition-colors shrink-0"
            >
              {t('retry', 'Retry')}
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
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Air Quality & Weather Trends Graph Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

      {/* Hourly Weather Section for Selected Day */}
      <HourlyForecast
        items={displayHourlyItems}
        loading={loading}
        error={null}
        isRealData={!!hourlyData}
      />
    </div>
  );
};

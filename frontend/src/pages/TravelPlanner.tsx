import React, { useState, useEffect, FormEvent } from 'react';
import {
  Compass,
  Search,
  Calendar,
  MapPin,
  CloudRain,
  Thermometer,
  Wind,
  Umbrella,
  Luggage,
  Sparkles,
  AlertCircle,
  Clock,
  Droplets,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  analyzeTripWeather,
  TravelPlannerResponse,
} from '../services/travelApi';
import { useLanguage } from '../context/LanguageContext';
import {
  translateDayOfWeek,
  translatePackingSuggestion,
} from '../i18n';

interface TravelPlannerPageProps {
  initialCity?: string;
}

export const TravelPlannerPage: React.FC<TravelPlannerPageProps> = ({
  initialCity = 'Mumbai',
}) => {
  const { language, t, translateCondition } = useLanguage();

  // Today date formatted YYYY-MM-DD
  const today = new Date();
  const formatYMD = (d: Date) => d.toISOString().split('T')[0];

  const inFiveDays = new Date();
  inFiveDays.setDate(today.getDate() + 4);

  const [destination, setDestination] = useState<string>(initialCity);
  const [startDate, setStartDate] = useState<string>(formatYMD(today));
  const [endDate, setEndDate] = useState<string>(formatYMD(inFiveDays));

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TravelPlannerResponse | null>(null);

  const handleAnalyze = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!destination.trim()) {
      setError(t('evaluateCityPlaceholder', 'Please select a valid destination.'));
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select valid travel dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await analyzeTripWeather({
        destination: destination.trim(),
        start_date: startDate,
        end_date: endDate,
      });

      setResult(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('unableToAnalyze', 'Unable to analyze the trip right now. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Run initial analysis on mount
  useEffect(() => {
    handleAnalyze();
  }, []);

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18232D] border border-[#2B3945] rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#24313C] border border-[#2B3945] rounded-lg text-[#2F80ED]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-[#56CCF2] mb-0.5">
              {t('itineraryAssessment', 'Itinerary Atmospheric Assessment')}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">
              {t('travelPlannerTitle', 'Smart Travel Weather Planner')}
            </h1>
            <p className="text-xs text-[#9AA8B2] mt-0.5">
              {t('travelPlannerSubtitle', 'Multi-day destination forecasts and luggage packing advisories')}
            </p>
          </div>
        </div>
      </div>

      {/* Input controls form */}
      <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 shadow-sm">
        <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          {/* Destination */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#2F80ED]" /> {t('destination', 'Destination')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg px-3.5 py-2 pl-9 text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none transition-colors text-xs sm:text-sm"
              />
              <Search className="w-4 h-4 text-[#9AA8B2] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Start Date */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#56CCF2]" /> {t('departure', 'Departure')}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg px-3 py-2 text-[#F4F7F9] focus:outline-none transition-colors text-xs sm:text-sm"
            />
          </div>

          {/* End Date */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#27AE9B]" /> {t('returnDate', 'Return')}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg px-3 py-2 text-[#F4F7F9] focus:outline-none transition-colors text-xs sm:text-sm"
            />
          </div>

          {/* Analyze Button */}
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2F80ED] hover:bg-[#2570d4] text-white font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[38px]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t('analyze', 'Analyze')
              )}
            </button>
          </div>
        </form>

        {/* Forecast horizon notice */}
        <div className="mt-3.5 flex items-center gap-2 text-xs text-[#9AA8B2] bg-[#101820] px-3 py-2 rounded-lg border border-[#2B3945]">
          <Info className="w-4 h-4 text-[#2F80ED] shrink-0" />
          <span>
            {t('forecastHorizonNotice', 'Detailed weather forecast telemetry is available for up to 5 days ahead. Dates beyond provider availability will be marked accordingly.')}
          </span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg p-3.5 flex items-center gap-2.5 text-[#EB5757] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Loading state message */}
      {loading && (
        <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-8 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#2F80ED]/30 border-t-[#2F80ED] rounded-full animate-spin mx-auto" />
          <p className="text-[#F4F7F9] font-medium text-sm">
            {t('evaluatingItinerary', 'Evaluating itinerary weather profile...')}
          </p>
          <p className="text-[#9AA8B2] text-xs font-mono">
            {t('synthesizingForecasts', 'Synthesizing multi-day forecasts and packing requirements.')}
          </p>
        </div>
      )}

      {/* Results content */}
      {!loading && result && (
        <div className="space-y-5">
          {/* Trip Overview Card */}
          <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 pb-5 border-b border-[#2B3945]">
              <div>
                <div className="flex items-center gap-1.5 text-[#56CCF2] text-xs font-mono uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-[#2F80ED]" /> {t('destinationSummary', 'Destination Summary')}
                </div>
                <h2 className="text-2xl font-bold text-[#F4F7F9] mt-1">
                  {result.destination.city}, {result.destination.country}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#9AA8B2]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2F80ED]" />
                    {result.start_date} → {result.end_date}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#9AA8B2]" />
                    {t('zoneLabel', 'Zone:')} {result.destination.timezone}
                  </span>
                  <span className="flex items-center gap-1 text-[#27AE9B] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {result.available_forecast_days} {t('daysObserved', 'Days Observed')}
                  </span>
                </div>
              </div>

              {/* Overview Metrics pill box */}
              <div className="grid grid-cols-3 gap-2 bg-[#24313C] p-3 rounded-lg border border-[#2B3945] min-w-[260px]">
                <div className="text-center">
                  <div className="text-[#9AA8B2] text-[10px] flex items-center justify-center gap-1 font-mono">
                    <Thermometer className="w-3 h-3 text-[#F2C94C]" /> {t('averageTempLabel', 'Average')}
                  </div>
                  <div className="text-[#F4F7F9] font-bold text-sm font-mono mt-0.5">
                    {result.temperature_analysis.average_temperature}°C
                  </div>
                </div>
                <div className="text-center border-x border-[#2B3945] px-2">
                  <div className="text-[#9AA8B2] text-[10px] flex items-center justify-center gap-1 font-mono">
                    <CloudRain className="w-3 h-3 text-[#56CCF2]" /> {t('rainRiskLabel', 'Rain Risk')}
                  </div>
                  <div className="text-[#F4F7F9] font-bold text-sm mt-0.5 font-mono">
                    {result.rain_analysis.rain_risk_days.length > 0 ? t('riskPossible', 'Possible') : t('riskLow', 'Low')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[#9AA8B2] text-[10px] flex items-center justify-center gap-1 font-mono">
                    <Umbrella className="w-3 h-3 text-[#27AE9B]" /> {t('gearLabel', 'Gear')}
                  </div>
                  <div className="text-[#F4F7F9] font-bold text-xs mt-1 truncate font-mono">
                    {result.rain_analysis.rain_risk_days.length > 0 ? t('gearUmbrella', 'Umbrella') : t('gearStandard', 'Standard')}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Natural Language Summary */}
            {result.ai_summary && (
              <div className="mt-4 bg-[#24313C] border border-[#2B3945] rounded-lg p-3.5 flex items-start gap-3">
                <div className="p-1.5 bg-[#18232D] rounded text-[#2F80ED] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#56CCF2] font-mono uppercase tracking-wider mb-0.5">
                    {t('travelAdvisorySynthesis', 'Travel Advisory Synthesis')}
                  </div>
                  <p className="text-[#F4F7F9] text-xs sm:text-sm leading-relaxed">
                    "{result.ai_summary}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Daily Forecast Cards */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#2F80ED]" /> {t('dailyTravelForecast', 'Daily Travel Forecast')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {result.daily_forecasts.map((dayItem, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 border transition-colors ${
                    dayItem.is_available
                      ? 'bg-[#18232D] border-[#2B3945] shadow-sm'
                      : 'bg-[#18232D] border-[#2B3945]/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#2B3945]">
                    <div>
                      <div className="text-xs text-[#9AA8B2] font-medium font-mono uppercase">
                        {translateDayOfWeek(dayItem.day, language)}
                      </div>
                      <div className="text-xs font-bold text-[#F4F7F9] font-mono">{dayItem.date}</div>
                    </div>
                    {dayItem.is_available && (
                      <img
                        src={`https://openweathermap.org/img/wn/${dayItem.icon}.png`}
                        alt={dayItem.condition}
                        className="w-9 h-9 object-contain"
                      />
                    )}
                  </div>

                  {dayItem.is_available ? (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium text-[#F4F7F9] capitalize truncate">
                        {translateCondition(dayItem.condition)}
                      </div>

                      <div className="text-lg font-bold text-[#F4F7F9] font-mono flex items-baseline gap-1">
                        {Math.round(dayItem.max_temp)}°C
                        <span className="text-xs font-normal text-[#9AA8B2]">
                          / {Math.round(dayItem.min_temp)}°C
                        </span>
                      </div>

                      <div className="space-y-1 pt-2 text-xs border-t border-[#2B3945]">
                        <div className="flex items-center justify-between text-[#F4F7F9]">
                          <span className="flex items-center gap-1 text-[#56CCF2] text-[11px]">
                            <CloudRain className="w-3 h-3" /> {t('rainMetric', 'Rain')}
                          </span>
                          <span className="font-semibold font-mono">{dayItem.precipitation_probability}%</span>
                        </div>

                        <div className="flex items-center justify-between text-[#F4F7F9]">
                          <span className="flex items-center gap-1 text-[#27AE9B] text-[11px]">
                            <Wind className="w-3 h-3" /> {t('windMetric', 'Wind')}
                          </span>
                          <span className="font-semibold font-mono">{dayItem.wind_speed} km/h</span>
                        </div>

                        <div className="flex items-center justify-between text-[#F4F7F9]">
                          <span className="flex items-center gap-1 text-[#9AA8B2] text-[11px]">
                            <Droplets className="w-3 h-3" /> {t('humidity', 'Humidity')}
                          </span>
                          <span className="font-semibold font-mono">{dayItem.humidity}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-center space-y-1.5 py-3">
                      <Clock className="w-5 h-5 text-[#9AA8B2] mx-auto" />
                      <div className="text-[11px] font-mono text-[#9AA8B2]">
                        {dayItem.note || t('beyondHorizon', 'Projection beyond horizon.')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis & Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rain Analysis */}
            <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#56CCF2] text-xs font-semibold uppercase tracking-wider font-mono">
                <CloudRain className="w-3.5 h-3.5" /> {t('precipitationRisk', 'Precipitation Risk')}
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945]">
                  <span className="text-[#9AA8B2]">{t('highestRiskWindow', 'Highest Risk Window:')}</span>
                  <span className="text-[#F4F7F9] font-medium font-mono">
                    {result.rain_analysis.highest_rain_day || 'None'}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945]">
                  <span className="text-[#9AA8B2]">{t('lowestRiskWindow', 'Lowest Risk Window:')}</span>
                  <span className="text-[#F4F7F9] font-medium font-mono">
                    {result.rain_analysis.lowest_rain_day || 'None'}
                  </span>
                </div>

                <div className="bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945] space-y-1">
                  <span className="text-[#9AA8B2] block">{t('umbrellaRecommendedDays', 'Umbrella Recommended Days:')}</span>
                  {result.rain_analysis.rain_risk_days.length > 0 ? (
                    <ul className="space-y-1 pt-1">
                      {result.rain_analysis.rain_risk_days.map((dayStr, idx) => (
                        <li key={idx} className="text-[#F2C94C] font-medium flex items-center gap-1.5 font-mono">
                          <Umbrella className="w-3 h-3 text-[#F2C94C]" /> {dayStr}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[#27AE9B] font-medium font-mono">{t('noHeavyRainExpected', 'No heavy rain days expected')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Temperature Analysis */}
            <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#F2C94C] text-xs font-semibold uppercase tracking-wider font-mono">
                <Thermometer className="w-3.5 h-3.5" /> {t('thermalProfile', 'Thermal Profile')}
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945]">
                  <span className="text-[#9AA8B2]">{t('warmestWindow', 'Warmest Available Window:')}</span>
                  <span className="text-[#F4F7F9] font-medium font-mono">
                    {result.temperature_analysis.warmest_day || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945]">
                  <span className="text-[#9AA8B2]">{t('coolestWindow', 'Coolest Available Window:')}</span>
                  <span className="text-[#F4F7F9] font-medium font-mono">
                    {result.temperature_analysis.coolest_day || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945]">
                  <span className="text-[#9AA8B2]">{t('meanTemperature', 'Mean Temperature:')}</span>
                  <span className="text-[#F2C94C] font-bold font-mono">
                    {result.temperature_analysis.average_temperature}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Packing Suggestions */}
            <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#27AE9B] text-xs font-semibold uppercase tracking-wider font-mono">
                <Luggage className="w-3.5 h-3.5" /> {t('packingChecklist', 'Packing Checklist')}
              </div>

              {/* Common recommended packing item chips */}
              <div className="space-y-1.5 pb-1">
                <span className="text-[11px] font-mono text-[#9AA8B2] block">
                  {t('recommendedItems', 'Recommended Items')}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#24313C] border border-[#2B3945] text-[#9AA8B2]">
                    {t('itemUmbrella', 'Umbrella')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#24313C] border border-[#2B3945] text-[#9AA8B2]">
                    {t('itemLightJacket', 'Light Jacket')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#24313C] border border-[#2B3945] text-[#9AA8B2]">
                    {t('itemSunglasses', 'Sunglasses')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#24313C] border border-[#2B3945] text-[#9AA8B2]">
                    {t('itemWaterBottle', 'Water Bottle')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {result.packing_suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945] text-xs text-[#F4F7F9]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE9B] shrink-0 mt-0.5" />
                    <span>{translatePackingSuggestion(suggestion, language)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

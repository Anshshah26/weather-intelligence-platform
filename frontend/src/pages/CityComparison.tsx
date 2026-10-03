import React, { useState, useEffect, FormEvent } from 'react';
import {
  GitCompare,
  Plus,
  Trash2,
  Search,
  MapPin,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Clock,
  Activity,
  Sparkles,
  AlertCircle,
  Info,
  XCircle,
} from 'lucide-react';
import {
  compareWeatherCities,
  CityComparisonResponse,
} from '../services/comparisonApi';
import { useLanguage } from '../context/LanguageContext';
import {
  translateActivityName,
  translateCategoryName,
} from '../i18n';

interface CityComparisonPageProps {
  initialCity?: string;
}

const SUPPORTED_ACTIVITIES = [
  { id: 'running', name: 'Running', icon: '🏃' },
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'walking', name: 'Walking', icon: '🚶' },
  { id: 'cycling', name: 'Cycling', icon: '🚴' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'hiking', name: 'Hiking', icon: '🥾' },
  { id: 'outdoor_workout', name: 'Outdoor Workout', icon: '🏋️' },
  { id: 'picnic', name: 'Picnic', icon: '🧺' },
];

export const CityComparisonPage: React.FC<CityComparisonPageProps> = ({
  initialCity = 'Mumbai',
}) => {
  const { language, t, translateCondition } = useLanguage();

  const [cityInputs, setCityInputs] = useState<string[]>([
    initialCity,
    'Delhi',
    'Bangalore',
  ]);
  const [selectedActivity, setSelectedActivity] = useState<string>('running');
  const [forecastDay, setForecastDay] = useState<string>('current');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CityComparisonResponse | null>(null);

  const handleCityInputChange = (index: number, value: string) => {
    const updated = [...cityInputs];
    updated[index] = value;
    setCityInputs(updated);
  };

  const handleAddCity = () => {
    if (cityInputs.length >= 4) return;
    setCityInputs([...cityInputs, '']);
  };

  const handleRemoveCity = (index: number) => {
    if (cityInputs.length <= 2) return;
    const updated = cityInputs.filter((_, idx) => idx !== index);
    setCityInputs(updated);
  };

  const handleCompare = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    const cleaned = cityInputs.map((c) => c.trim()).filter(Boolean);

    // Validate duplicate check
    const lowerSeen = new Set<string>();
    for (const c of cleaned) {
      if (lowerSeen.has(c.toLowerCase())) {
        setError(`This city ('${c}') has already been added.`);
        return;
      }
      lowerSeen.add(c.toLowerCase());
    }

    if (cleaned.length < 2) {
      setError('Select at least two cities to compare weather.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await compareWeatherCities({
        cities: cleaned,
        activity: selectedActivity,
        forecast_day: forecastDay,
      });
      setResult(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('unableToAnalyze', 'Unable to compare weather right now. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Run initial comparison on mount
  useEffect(() => {
    handleCompare();
  }, []);

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18232D] border border-[#2B3945] rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#24313C] border border-[#2B3945] rounded-lg text-[#2F80ED]">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-[#56CCF2] mb-0.5">
              {t('comparativeAnalysisEngine', 'Comparative Analysis Engine')}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">
              {t('cityComparisonTitle', 'City Weather Comparison')}
            </h1>
            <p className="text-xs text-[#9AA8B2] mt-0.5">
              {t('cityComparisonSubtitle', 'Side-by-side meteorological metrics and activity suitability evaluation')}
            </p>
          </div>
        </div>
      </div>

      {/* Input Selection Card */}
      <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 shadow-sm space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#2F80ED]" /> {t('targetLocations', 'Target Locations (2 to 4 Cities)')}
            </label>
            {cityInputs.length < 4 && (
              <button
                type="button"
                onClick={handleAddCity}
                className="text-xs font-medium text-[#56CCF2] hover:text-[#F4F7F9] flex items-center gap-1 bg-[#24313C] hover:bg-[#2A3946] border border-[#2B3945] px-2.5 py-1 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> {t('addLocation', 'Add Location')}
              </button>
            )}
          </div>

          {/* Dynamic City Input Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {cityInputs.map((cityVal, idx) => (
              <div key={idx} className="relative flex items-center">
                <input
                  type="text"
                  value={cityVal}
                  onChange={(e) => handleCityInputChange(idx, e.target.value)}
                  placeholder={`${t('destination', 'City')} ${idx + 1}`}
                  className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg px-3 py-2 pl-9 pr-9 text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none transition-colors text-xs sm:text-sm"
                />
                <Search className="w-4 h-4 text-[#9AA8B2] absolute left-3" />
                {cityInputs.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(idx)}
                    title={t('close', 'Remove')}
                    aria-label={t('close', 'Remove')}
                    className="absolute right-2.5 text-[#9AA8B2] hover:text-[#EB5757] transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Forecast options bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 border-t border-[#2B3945] items-end">
          {/* Activity Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5 text-[#56CCF2]" /> {t('activityCriterion', 'Activity Criterion')}
            </label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg px-3 py-2 text-[#F4F7F9] focus:outline-none transition-colors text-xs sm:text-sm"
            >
              {SUPPORTED_ACTIVITIES.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.icon} {translateActivityName(act.name, language)}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe option */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#27AE9B]" /> {t('analysisTimeframe', 'Analysis Timeframe')}
            </label>
            <select
              value={forecastDay}
              onChange={(e) => setForecastDay(e.target.value)}
              className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg px-3 py-2 text-[#F4F7F9] focus:outline-none transition-colors text-xs sm:text-sm"
            >
              <option value="current">{t('timeframeCurrent', 'Current Telemetry')}</option>
              <option value="today">{t('timeframeToday', "Today's Aggregation")}</option>
              <option value="tomorrow">{t('timeframeTomorrow', "Tomorrow's Projection")}</option>
            </select>
          </div>

          {/* Compare Button */}
          <div className="md:col-span-3">
            <button
              type="button"
              onClick={() => handleCompare()}
              disabled={loading}
              className="w-full bg-[#2F80ED] hover:bg-[#2570d4] text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t('executeComparison', 'Execute Comparison')
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error notification */}
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
            {t('processingMatrices', 'Processing telemetry matrices...')}
          </p>
          <p className="text-[#9AA8B2] text-xs font-mono">
            {t('aggregatingVariables', 'Aggregating atmospheric variables and normalizing comparative scales.')}
          </p>
        </div>
      )}

      {/* Results view */}
      {!loading && result && (
        <div className="space-y-5">
          {/* Factual AI Summary */}
          {result.ai_summary && (
            <div className="bg-[#18232D] border border-[#2B3945] border-l-4 border-l-[#2F80ED] rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <div className="p-2 bg-[#24313C] rounded-lg text-[#2F80ED] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase text-[#56CCF2] tracking-wider mb-1 font-semibold">
                  {t('comparativeAnalysisSynthesis', 'Comparative Analysis Synthesis')}
                </h3>
                <p className="text-[#F4F7F9] text-xs sm:text-sm leading-relaxed">
                  "{result.ai_summary}"
                </p>
              </div>
            </div>
          )}

          {/* City Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {result.cities.map((cityData, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-5 border transition-colors ${
                  cityData.is_available
                    ? 'bg-[#18232D] border-[#2B3945] shadow-sm'
                    : 'bg-[#18232D] border-[#EB5757]/30 opacity-70'
                }`}
              >
                {cityData.is_available ? (
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-[#56CCF2] uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#2F80ED]" /> {cityData.country}
                        </div>
                        <h2 className="text-xl font-bold text-[#F4F7F9] mt-0.5">
                          {cityData.name}
                        </h2>
                        <div className="text-[11px] text-[#9AA8B2] flex items-center gap-1 mt-0.5 font-mono">
                          <Clock className="w-3 h-3 text-[#9AA8B2]" />
                          <span>{cityData.timezone}</span>
                        </div>
                      </div>
                      <img
                        src={`https://openweathermap.org/img/wn/${cityData.icon}@2x.png`}
                        alt={cityData.condition}
                        className="w-12 h-12 object-contain -mr-1 -mt-1"
                      />
                    </div>

                    {/* Temp & Condition */}
                    <div className="pt-2 border-t border-[#2B3945]">
                      <div className="text-2xl font-bold text-[#F4F7F9] font-mono">
                        {cityData.temperature}°C
                      </div>
                      <div className="text-xs text-[#9AA8B2] mt-0.5">
                        {t('feelsLike', 'Feels like')} <span className="text-[#F4F7F9] font-medium font-mono">{cityData.feels_like}°C</span> &bull; {translateCondition(cityData.description || cityData.condition)}
                      </div>
                    </div>

                    {/* Key Telemetry Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#2B3945]">
                      <div className="bg-[#24313C] p-2 rounded-lg border border-[#2B3945] space-y-0.5">
                        <span className="text-[#9AA8B2] text-[10px] flex items-center gap-1 font-mono">
                          <CloudRain className="w-3 h-3 text-[#56CCF2]" /> {t('rainMetric', 'Rain')}
                        </span>
                        <span className="text-[#F4F7F9] font-bold block text-xs font-mono">
                          {cityData.rain_probability}%
                        </span>
                      </div>

                      <div className="bg-[#24313C] p-2 rounded-lg border border-[#2B3945] space-y-0.5">
                        <span className="text-[#9AA8B2] text-[10px] flex items-center gap-1 font-mono">
                          <Wind className="w-3 h-3 text-[#27AE9B]" /> {t('windMetric', 'Wind')}
                        </span>
                        <span className="text-[#F4F7F9] font-bold block text-xs font-mono">
                          {cityData.wind_speed} km/h
                        </span>
                      </div>

                      <div className="bg-[#24313C] p-2 rounded-lg border border-[#2B3945] space-y-0.5">
                        <span className="text-[#9AA8B2] text-[10px] flex items-center gap-1 font-mono">
                          <Droplets className="w-3 h-3 text-[#56CCF2]" /> {t('humidity', 'Humidity')}
                        </span>
                        <span className="text-[#F4F7F9] font-bold block text-xs font-mono">
                          {cityData.humidity}%
                        </span>
                      </div>

                      <div className="bg-[#24313C] p-2 rounded-lg border border-[#2B3945] space-y-0.5">
                        <span className="text-[#9AA8B2] text-[10px] flex items-center gap-1 font-mono">
                          <Gauge className="w-3 h-3 text-[#F2C94C]" /> {t('pressure', 'Pressure')}
                        </span>
                        <span className="text-[#F4F7F9] font-bold block text-xs font-mono">
                          {cityData.pressure} hPa
                        </span>
                      </div>
                    </div>

                    {/* Activity Score Pill */}
                    {cityData.activity_score !== undefined && cityData.activity_score !== null && (
                      <div className="pt-2.5 border-t border-[#2B3945] flex items-center justify-between bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945]">
                        <div className="text-xs text-[#9AA8B2] capitalize font-mono">
                          {translateActivityName(selectedActivity, language)}
                        </div>
                        <div className="text-xs font-bold text-[#F4F7F9] flex items-center gap-1.5 font-mono">
                          <span>{cityData.activity_score}/100</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#18232D] border border-[#2B3945] text-[#56CCF2]">
                            {translateCategoryName(cityData.activity_category, language)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <XCircle className="w-6 h-6 text-[#EB5757] mx-auto" />
                    <h3 className="text-sm font-semibold text-[#F4F7F9]">{cityData.name}</h3>
                    <p className="text-xs text-[#EB5757]">{cityData.error_message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Side-by-Side Comparison Table */}
          <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-[#F4F7F9] flex items-center gap-2 font-mono">
              <GitCompare className="w-4 h-4 text-[#2F80ED]" /> {t('parameterMatrix', 'Parameter Comparison Matrix')}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2B3945] text-[#9AA8B2] uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3 font-semibold">{t('parameterLabel', 'Parameter')}</th>
                    {result.cities.map((c, i) => (
                      <th key={i} className="py-2.5 px-3 font-semibold text-right text-[#F4F7F9]">
                        {c.name} ({c.country})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B3945] text-[#F4F7F9]">
                  <tr>
                    <td className="py-2.5 px-3 text-[#9AA8B2] flex items-center gap-2">
                      <Thermometer className="w-3.5 h-3.5 text-[#F2C94C]" /> {t('temperature', 'Temperature')}
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-2.5 px-3 text-right font-bold font-mono">
                        {c.is_available ? `${c.temperature}°C` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-[#9AA8B2] flex items-center gap-2">
                      <Thermometer className="w-3.5 h-3.5 text-[#F2994A]" /> {t('feelsLike', 'Feels Like')}
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-2.5 px-3 text-right font-medium font-mono text-[#9AA8B2]">
                        {c.is_available ? `${c.feels_like}°C` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-[#9AA8B2] flex items-center gap-2">
                      <CloudRain className="w-3.5 h-3.5 text-[#56CCF2]" /> {t('rainProbability', 'Rain Probability')}
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-2.5 px-3 text-right font-medium font-mono text-[#56CCF2]">
                        {c.is_available ? `${c.rain_probability}%` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-[#9AA8B2] flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-[#27AE9B]" /> {t('windSpeed', 'Wind Speed')}
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-2.5 px-3 text-right font-medium font-mono">
                        {c.is_available ? `${c.wind_speed} km/h` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-[#9AA8B2] flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-[#56CCF2]" /> {t('humidity', 'Humidity')}
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-2.5 px-3 text-right font-medium font-mono">
                        {c.is_available ? `${c.humidity}%` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-[#9AA8B2] flex items-center gap-2">
                      <Gauge className="w-3.5 h-3.5 text-[#27AE9B]" /> {t('barometricPressure', 'Barometric Pressure')}
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-2.5 px-3 text-right font-medium font-mono">
                        {c.is_available ? `${c.pressure} hPa` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-[#9AA8B2] flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-[#9AA8B2]" /> {t('visibility', 'Visibility')}
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-2.5 px-3 text-right font-medium font-mono">
                        {c.is_available ? `${c.visibility} km` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 text-[#9AA8B2] flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-[#56CCF2]" /> {t('suitabilityLabel', 'Suitability')} ({translateActivityName(selectedActivity, language)})
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-2.5 px-3 text-right font-bold font-mono text-[#56CCF2]">
                        {c.is_available && c.activity_score !== undefined
                          ? `${c.activity_score}/100 (${translateCategoryName(c.activity_category, language)})`
                          : 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Non-ranking disclaimer banner */}
            <div className="mt-3 flex items-center gap-2 text-xs text-[#9AA8B2] bg-[#101820] p-2.5 rounded-lg border border-[#2B3945]">
              <Info className="w-3.5 h-3.5 text-[#2F80ED] shrink-0" />
              <span>{result.disclaimer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

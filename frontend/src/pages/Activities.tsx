import { useState, useEffect, FormEvent } from 'react';
import { getActivityScore, getAllActivityScores, ActivityScoreResponse } from '../services/activitiesApi';
import { CurrentWeatherResponse } from '../types/weather';
import {
  Activity,
  MapPin,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Sparkles,
} from 'lucide-react';

interface ActivitiesPageProps {
  currentCityWeather?: CurrentWeatherResponse | null;
}

export const ActivitiesPage = ({ currentCityWeather }: ActivitiesPageProps) => {
  const defaultCity = currentCityWeather?.location.city || 'Mumbai';

  const [searchQuery, setSearchQuery] = useState<string>(defaultCity);
  const [activeCity, setActiveCity] = useState<string>(defaultCity);
  const [selectedActivity, setSelectedActivity] = useState<string>('running');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'now' | 'today' | 'tomorrow' | '07:00' | '18:00'>('now');

  const [scoreData, setScoreData] = useState<ActivityScoreResponse | null>(null);
  const [allScores, setAllScores] = useState<ActivityScoreResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activities = [
    { id: 'running', name: 'Running', icon: '🏃' },
    { id: 'football', name: 'Football', icon: '⚽' },
    { id: 'walking', name: 'Walking', icon: '🚶' },
    { id: 'cycling', name: 'Cycling', icon: '🚴' },
    { id: 'cricket', name: 'Cricket', icon: '🏏' },
    { id: 'hiking', name: 'Hiking', icon: '🥾' },
    { id: 'outdoor_workout', name: 'Outdoor Workout', icon: '🏋️' },
    { id: 'picnic', name: 'Picnic', icon: '🧺' },
  ];

  // Sync if parent prop updates
  useEffect(() => {
    if (currentCityWeather) {
      setActiveCity(currentCityWeather.location.city);
      setSearchQuery(currentCityWeather.location.city);
    }
  }, [currentCityWeather]);

  // Fetch active score & overview scores when city, activity, or time changes
  useEffect(() => {
    fetchActivityScore(activeCity, selectedActivity, selectedTimeFilter);
    fetchAllScores(activeCity);
  }, [activeCity, selectedActivity, selectedTimeFilter]);

  const fetchActivityScore = async (city: string, activity: string, timeFilter: string) => {
    setLoading(true);
    setError(null);
    try {
      let dateParam = 'today';
      let timeParam: string | undefined = undefined;

      if (timeFilter === 'tomorrow') {
        dateParam = 'tomorrow';
      } else if (timeFilter === '07:00' || timeFilter === '18:00') {
        timeParam = timeFilter;
      }

      const res = await getActivityScore(activity, city, dateParam, timeParam);
      setScoreData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to calculate activity score.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllScores = async (city: string) => {
    try {
      const list = await getAllActivityScores(city);
      setAllScores(list);
    } catch {
      // Non-critical fallback
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveCity(searchQuery.trim());
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Excellent':
        return 'text-[#27AE9B] bg-[#27AE9B]/10 border-[#27AE9B]/30';
      case 'Good':
        return 'text-[#56CCF2] bg-[#2F80ED]/10 border-[#2F80ED]/30';
      case 'Moderate':
        return 'text-[#F2C94C] bg-[#F2C94C]/10 border-[#F2C94C]/30';
      case 'Poor':
        return 'text-[#F2994A] bg-[#F2994A]/10 border-[#F2994A]/30';
      case 'Very Poor':
        return 'text-[#EB5757] bg-[#EB5757]/10 border-[#EB5757]/30';
      default:
        return 'text-[#56CCF2] bg-[#24313C] border-[#2B3945]';
    }
  };

  const getRingColor = (score: number) => {
    if (score >= 80) return '#27AE9B';
    if (score >= 60) return '#2F80ED';
    if (score >= 40) return '#F2C94C';
    if (score >= 20) return '#F2994A';
    return '#EB5757';
  };

  const isExtremeWeather =
    (scoreData?.weather_summary.temperature ?? 0) >= 38.0 ||
    (scoreData?.weather_summary.precipitation_probability ?? 0) >= 80 ||
    (scoreData?.weather_summary.wind_speed ?? 0) >= 45.0;

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18232D] border border-[#2B3945] p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#56CCF2] mb-0.5">
            <Activity className="w-3.5 h-3.5 text-[#2F80ED]" /> Suitability Telemetry Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">
            Activity Weather Intelligence
          </h1>
          <p className="text-xs text-[#9AA8B2] mt-0.5">
            Quantitative outdoor plan suitability computed from atmospheric variables
          </p>
        </div>

        {/* City Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80" role="search">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9AA8B2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Evaluate city..."
              aria-label="Search city for activity scores"
              className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none min-h-[38px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            aria-label="Execute activity city search"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2F80ED] hover:bg-[#2570d4] text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-40 shrink-0 min-h-[38px]"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
            <span>Go</span>
          </button>
        </form>
      </div>

      {/* Error Alert if Search Failed */}
      {error && (
        <div className="p-3 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg flex items-center gap-2 text-[#EB5757] text-xs shrink-0" role="alert">
          <AlertCircle className="w-4 h-4 text-[#EB5757] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Extreme Weather Warning Alert */}
      {isExtremeWeather && (
        <div className="p-3.5 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-xl flex items-center gap-3 text-[#EB5757] text-xs font-mono">
          <AlertTriangle className="w-5 h-5 text-[#EB5757] shrink-0" />
          <div>
            <strong className="text-[#EB5757] block font-semibold">Severe conditions present:</strong>
            <span>Extreme temperature, heavy precipitation, or strong gusts. Outdoor activity is not recommended.</span>
          </div>
        </div>
      )}

      {/* Activity Cards Selection Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9AA8B2] font-mono">Select Activity Plan</h2>
          <span className="text-[11px] font-mono text-[#9AA8B2]">8 Supported Modules</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {activities.map((act) => {
            const isSelected = act.id === selectedActivity;
            const itemScore = allScores.find((s) => s.activity.toLowerCase() === act.name.toLowerCase())?.score;

            return (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act.id)}
                className={`p-3 rounded-lg border transition-colors text-left flex sm:flex-col items-center sm:items-start justify-between min-h-[52px] sm:min-h-[80px] ${
                  isSelected
                    ? 'bg-[#24313C] border-2 border-[#2F80ED] text-[#F4F7F9] shadow-sm font-semibold'
                    : 'bg-[#18232D] border border-[#2B3945] text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 sm:gap-0">
                    <span className="text-lg sm:text-xl">{act.icon}</span>
                    <span className="text-xs font-medium sm:hidden">{act.name}</span>
                  </div>
                  {itemScore !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#101820] border border-[#2B3945] text-[#56CCF2] font-semibold">
                      {itemScore}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium tracking-tight hidden sm:block mt-2 truncate w-full">{act.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slice Filter Toolbar */}
      <div className="flex items-center gap-1.5 bg-[#18232D] border border-[#2B3945] p-1.5 rounded-lg w-fit">
        <span className="text-[10px] font-mono text-[#9AA8B2] uppercase tracking-wider px-2 border-r border-[#2B3945] hidden sm:inline">
          Time Slot
        </span>
        {[
          { id: 'now', label: 'Now' },
          { id: 'today', label: 'Today' },
          { id: 'tomorrow', label: 'Tomorrow' },
          { id: '07:00', label: '7:00 AM' },
          { id: '18:00', label: '6:00 PM' },
        ].map((tf) => (
          <button
            key={tf.id}
            onClick={() => setSelectedTimeFilter(tf.id as any)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              selectedTimeFilter === tf.id
                ? 'bg-[#24313C] border border-[#2B3945] text-[#56CCF2]'
                : 'text-[#9AA8B2] hover:text-[#F4F7F9]'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Active Activity Evaluation Dashboard */}
      {scoreData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Visual Score Gauge Card */}
          <div className="bg-[#18232D] border border-[#2B3945] p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-xs font-mono text-[#9AA8B2] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2F80ED]" /> Suitability Index
            </div>

            {/* Circular Ring Gauge Meter */}
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#24313C"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={getRingColor(scoreData.score)}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * scoreData.score) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#F4F7F9] font-mono leading-none">
                  {scoreData.score}
                </span>
                <span className="text-xs font-mono text-[#9AA8B2] mt-1">/ 100</span>
              </div>
            </div>

            {/* Category Badge */}
            <div className={`mt-3 px-3 py-1 rounded border text-xs font-bold uppercase font-mono ${getCategoryColor(scoreData.category)}`}>
              {scoreData.category}
            </div>

            <p className="text-xs text-[#9AA8B2] mt-2 font-mono">
              Evaluated for <strong>{scoreData.activity}</strong> in {scoreData.weather_summary.city}
            </p>
          </div>

          {/* Weather Telemetry Summary & Factors */}
          <div className="lg:col-span-2 space-y-4">
            {/* Weather Telemetry Used */}
            <div className="bg-[#18232D] border border-[#2B3945] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F4F7F9]">
                <span className="flex items-center gap-1.5 font-mono text-[#56CCF2]">
                  <Clock className="w-3.5 h-3.5 text-[#2F80ED]" /> Condition Variables
                </span>
                <span className="text-[11px] font-mono text-[#9AA8B2]">
                  {scoreData.weather_summary.city} &bull; {scoreData.weather_summary.time}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-[#24313C] border border-[#2B3945] p-2.5 rounded-lg flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-[#F2C94C] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#9AA8B2] font-mono block">Temp</span>
                    <span className="text-sm font-bold text-[#F4F7F9] font-mono">{scoreData.weather_summary.temperature}°C</span>
                  </div>
                </div>

                <div className="bg-[#24313C] border border-[#2B3945] p-2.5 rounded-lg flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-[#56CCF2] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#9AA8B2] font-mono block">Rain Prob</span>
                    <span className="text-sm font-bold text-[#F4F7F9] font-mono">{scoreData.weather_summary.precipitation_probability}%</span>
                  </div>
                </div>

                <div className="bg-[#24313C] border border-[#2B3945] p-2.5 rounded-lg flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#27AE9B] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#9AA8B2] font-mono block">Wind</span>
                    <span className="text-sm font-bold text-[#F4F7F9] font-mono">{scoreData.weather_summary.wind_speed} km/h</span>
                  </div>
                </div>

                <div className="bg-[#24313C] border border-[#2B3945] p-2.5 rounded-lg flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#56CCF2] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#9AA8B2] font-mono block">Humidity</span>
                    <span className="text-sm font-bold text-[#F4F7F9] font-mono">{scoreData.weather_summary.humidity}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Positive Reasons (✓) & Warnings (⚠) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Positive Factors */}
              <div className="bg-[#18232D] border border-[#2B3945] border-l-2 border-l-[#27AE9B] p-4 rounded-xl space-y-2">
                <h3 className="text-xs font-semibold text-[#27AE9B] font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#27AE9B]" /> Favorable Factors
                </h3>
                <ul className="space-y-1.5 text-xs text-[#F4F7F9]">
                  {scoreData.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#27AE9B] font-bold shrink-0">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                  {scoreData.reasons.length === 0 && (
                    <li className="text-[#9AA8B2] italic">No strong positive weather factors present.</li>
                  )}
                </ul>
              </div>

              {/* Warnings / Cautions */}
              <div className="bg-[#18232D] border border-[#2B3945] border-l-2 border-l-[#F2994A] p-4 rounded-xl space-y-2">
                <h3 className="text-xs font-semibold text-[#F2994A] font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#F2994A]" /> Weather Advisories
                </h3>
                <ul className="space-y-1.5 text-xs text-[#F4F7F9]">
                  {scoreData.warnings.map((warn, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#F2994A] font-bold shrink-0">⚠</span>
                      <span>{warn}</span>
                    </li>
                  ))}
                  {scoreData.warnings.length === 0 && (
                    <li className="text-[#27AE9B] text-xs">No adverse weather warnings observed for this window.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* AI Explanation Box */}
            {scoreData.ai_explanation && (
              <div className="bg-[#18232D] border border-[#2B3945] p-4 rounded-xl text-xs text-[#F4F7F9] leading-relaxed shadow-sm">
                <div className="flex items-center gap-1.5 text-[#56CCF2] font-mono font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#2F80ED]" /> Meteorological Evaluation Synthesis:
                </div>
                <p className="text-[#9AA8B2]">{scoreData.ai_explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

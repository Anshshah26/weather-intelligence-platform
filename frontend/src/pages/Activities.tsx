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
  const country = currentCityWeather?.location.country || 'IN';

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
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Good':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Moderate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Poor':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Very Poor':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  const getRingColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Emerald
    if (score >= 60) return '#06b6d4'; // Cyan
    if (score >= 40) return '#f59e0b'; // Amber
    if (score >= 20) return '#f97316'; // Orange
    return '#f43f5e'; // Rose
  };

  const isExtremeWeather =
    (scoreData?.weather_summary.temperature ?? 0) >= 38.0 ||
    (scoreData?.weather_summary.precipitation_probability ?? 0) >= 80 ||
    (scoreData?.weather_summary.wind_speed ?? 0) >= 45.0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-0.5">
            <Activity className="w-4 h-4 text-cyan-400" /> Weather Intelligence • Suitability Engine
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Activity Weather
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            See how suitable the weather is for your outdoor plans.
          </p>
        </div>

        {/* City Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80" role="search">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Evaluate city..."
              aria-label="Search city for activity scores"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            aria-label="Execute activity city search"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold rounded-xl transition-colors disabled:opacity-40 shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
            <span>Go</span>
          </button>
        </form>
      </div>

      {/* Error Alert if Search Failed */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300 text-xs shrink-0" role="alert">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Extreme Weather Warning Alert */}
      {isExtremeWeather && (
        <div className="p-4 bg-rose-950/80 border border-rose-800/80 rounded-2xl flex items-center gap-3 text-rose-200 text-xs shadow-xl font-mono">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <strong className="text-rose-300 block">Severe weather conditions detected:</strong>
            <span>Extreme temperature, heavy precipitation, or strong winds present. Consider postponing outdoor activity.</span>
          </div>
        </div>
      )}

      {/* Activity Cards Selection Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Select Activity</h2>
          <span className="text-[11px] font-mono text-slate-400">8 Supported Sports & Outdoor Plans</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {activities.map((act) => {
            const isSelected = act.id === selectedActivity;
            const itemScore = allScores.find((s) => s.activity.toLowerCase() === act.name.toLowerCase())?.score;

            return (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act.id)}
                className={`p-3 rounded-2xl border transition-all text-left flex sm:flex-col items-center sm:items-start justify-between h-auto sm:h-24 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[48px] ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-slate-100 ring-1 ring-cyan-500/30 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 sm:gap-0">
                    <span className="text-xl sm:text-2xl">{act.icon}</span>
                    <span className="text-xs font-semibold tracking-tight sm:hidden">{act.name}</span>
                  </div>
                  {itemScore !== undefined && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                      Score: {itemScore}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold tracking-tight hidden sm:block">{act.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slice Filter Toolbar */}
      <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2 rounded-2xl w-fit">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2 border-r border-slate-800 hidden sm:inline">
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
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectedTimeFilter === tf.id
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Active Activity Evaluation Dashboard */}
      {scoreData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Score Gauge Card */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Suitability Rating
            </div>

            {/* Circular Ring Gauge Meter */}
            <div className="relative w-40 h-40 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#1e293b"
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
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-100 tracking-tight leading-none">
                  {scoreData.score}
                </span>
                <span className="text-xs font-mono text-slate-400 mt-1">/ 100</span>
              </div>
            </div>

            {/* Category Badge */}
            <div className={`mt-4 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase font-mono ${getCategoryColor(scoreData.category)}`}>
              {scoreData.category}
            </div>

            <p className="text-xs text-slate-400 mt-3 font-mono">
              Evaluated for <strong>{scoreData.activity}</strong> in {scoreData.weather_summary.city}
            </p>
          </div>

          {/* Weather Telemetry Summary & Factors */}
          <div className="lg:col-span-2 space-y-4">
            {/* Weather Telemetry Used */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5 font-mono text-cyan-400">
                  <Clock className="w-3.5 h-3.5" /> Evaluated Weather Conditions
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  📍 {scoreData.weather_summary.city} • 🕕 {scoreData.weather_summary.time}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex items-center gap-2.5">
                  <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Temp</span>
                    <span className="text-sm font-bold text-slate-100">{scoreData.weather_summary.temperature}°C</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex items-center gap-2.5">
                  <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Rain</span>
                    <span className="text-sm font-bold text-slate-100">{scoreData.weather_summary.precipitation_probability}%</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex items-center gap-2.5">
                  <Wind className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Wind</span>
                    <span className="text-sm font-bold text-slate-100">{scoreData.weather_summary.wind_speed} km/h</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Humidity</span>
                    <span className="text-sm font-bold text-slate-100">{scoreData.weather_summary.humidity}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Positive Reasons (✓) & Warnings (⚠) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Positive Factors */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                <h3 className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Positive Weather Factors
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {scoreData.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                  {scoreData.reasons.length === 0 && (
                    <li className="text-slate-500 italic">No strong positive weather factors present.</li>
                  )}
                </ul>
              </div>

              {/* Warnings / Cautions */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                <h3 className="text-xs font-semibold text-amber-400 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Warnings & Cautions
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {scoreData.warnings.map((warn, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">⚠</span>
                      <span>{warn}</span>
                    </li>
                  ))}
                  {scoreData.warnings.length === 0 && (
                    <li className="text-emerald-400/80 text-xs">No adverse weather warnings for this plan!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* AI Explanation Box */}
            {scoreData.ai_explanation && (
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 leading-relaxed shadow-md">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Synthesis:
                </div>
                <p className="text-slate-300 font-sans">{scoreData.ai_explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

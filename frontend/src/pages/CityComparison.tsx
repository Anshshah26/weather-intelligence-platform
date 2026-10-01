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
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  compareWeatherCities,
  CityComparisonResponse,
  CityMetrics,
} from '../services/comparisonApi';

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
        setError('Unable to compare weather right now. Please try again.');
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              City Weather Comparison
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Compare weather conditions across cities.
            </p>
          </div>
        </div>
      </div>

      {/* Input Selection Card */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" /> Compare Cities (2 to 4 Cities)
            </label>
            {cityInputs.length < 4 && (
              <button
                type="button"
                onClick={handleAddCity}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add City
              </button>
            )}
          </div>

          {/* Dynamic City Input Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityInputs.map((cityVal, idx) => (
              <div key={idx} className="relative flex items-center">
                <input
                  type="text"
                  value={cityVal}
                  onChange={(e) => handleCityInputChange(idx, e.target.value)}
                  placeholder={`City ${idx + 1}`}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                {cityInputs.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(idx)}
                    title="Remove City"
                    className="absolute right-3 text-slate-400 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Forecast options bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-slate-800/80 items-end">
          {/* Activity Selector */}
          <div className="md:col-span-6 space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" /> Compare Activity Score
            </label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
            >
              {SUPPORTED_ACTIVITIES.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.icon} {act.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe option */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" /> Timeframe
            </label>
            <select
              value={forecastDay}
              onChange={(e) => setForecastDay(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
            >
              <option value="current">Current Weather</option>
              <option value="today">Today's Forecast</option>
              <option value="tomorrow">Tomorrow's Forecast</option>
            </select>
          </div>

          {/* Compare Button */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => handleCompare()}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Compare Weather'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Loading state message */}
      {loading && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-300 font-medium text-base">Comparing weather...</p>
          <p className="text-slate-500 text-xs">Fetching real weather telemetry and computing comparative metrics.</p>
        </div>
      )}

      {/* Results view */}
      {!loading && result && (
        <div className="space-y-6">
          {/* Factual AI Summary */}
          {result.ai_summary && (
            <div className="bg-slate-900/80 border border-blue-800/40 rounded-2xl p-5 flex items-start gap-3 shadow-xl">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
                  AI Weather Comparison Summary
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  "{result.ai_summary}"
                </p>
              </div>
            </div>
          )}

          {/* City Cards Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(result.cities.length, 4)} gap-4`}>
            {result.cities.map((cityData, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 border transition-all relative overflow-hidden ${
                  cityData.is_available
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700 shadow-xl'
                    : 'bg-slate-950/50 border-red-900/30 opacity-70'
                }`}
              >
                {cityData.is_available ? (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {cityData.country}
                        </div>
                        <h2 className="text-2xl font-bold text-white mt-0.5">
                          {cityData.name}
                        </h2>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <code className="text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded">{cityData.timezone}</code>
                        </div>
                      </div>
                      <img
                        src={`https://openweathermap.org/img/wn/${cityData.icon}@2x.png`}
                        alt={cityData.condition}
                        className="w-14 h-14 object-contain -mr-2 -mt-2"
                      />
                    </div>

                    {/* Temp & Condition */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-3xl font-extrabold text-white">
                        {cityData.temperature}°C
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Feels like <span className="text-slate-200 font-medium">{cityData.feels_like}°C</span> • {cityData.description}
                      </div>
                    </div>

                    {/* Key Telemetry Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800/80">
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rain
                        </span>
                        <span className="text-white font-bold block text-sm">
                          {cityData.rain_probability}%
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Wind className="w-3.5 h-3.5 text-teal-400" /> Wind
                        </span>
                        <span className="text-white font-bold block text-sm">
                          {cityData.wind_speed} km/h
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-indigo-400" /> Humidity
                        </span>
                        <span className="text-white font-bold block text-sm">
                          {cityData.humidity}%
                        </span>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-amber-400" /> Pressure
                        </span>
                        <span className="text-white font-bold block text-sm">
                          {cityData.pressure} hPa
                        </span>
                      </div>
                    </div>

                    {/* Activity Score Pill */}
                    {cityData.activity_score !== undefined && cityData.activity_score !== null && (
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between bg-purple-950/20 p-3 rounded-xl border-purple-800/30">
                        <div className="text-xs text-purple-300 font-medium capitalize">
                          {selectedActivity} Score
                        </div>
                        <div className="text-sm font-bold text-purple-200 flex items-center gap-1.5">
                          <span>{cityData.activity_score}/100</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 font-semibold">
                            {cityData.activity_category}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <XCircle className="w-8 h-8 text-red-400 mx-auto" />
                    <h3 className="text-sm font-bold text-white">{cityData.name}</h3>
                    <p className="text-xs text-red-400">{cityData.error_message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Side-by-Side Comparison Table */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-400" /> Detailed Comparative Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                    <th className="py-3 px-4 font-semibold">Weather Parameter</th>
                    {result.cities.map((c, i) => (
                      <th key={i} className="py-3 px-4 font-semibold text-right text-white">
                        {c.name} ({c.country})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-amber-400" /> Temperature
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-3 px-4 text-right font-bold text-white">
                        {c.is_available ? `${c.temperature}°C` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-400" /> Feels Like
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-3 px-4 text-right font-medium">
                        {c.is_available ? `${c.feels_like}°C` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-blue-400" /> Rain Probability
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-3 px-4 text-right font-medium text-blue-300">
                        {c.is_available ? `${c.rain_probability}%` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                      <Wind className="w-4 h-4 text-teal-400" /> Wind Speed
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-3 px-4 text-right font-medium">
                        {c.is_available ? `${c.wind_speed} km/h` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-indigo-400" /> Humidity
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-3 px-4 text-right font-medium">
                        {c.is_available ? `${c.humidity}%` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-amber-400" /> Barometric Pressure
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-3 px-4 text-right font-medium">
                        {c.is_available ? `${c.pressure} hPa` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-400" /> Visibility
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-3 px-4 text-right font-medium">
                        {c.is_available ? `${c.visibility} km` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" /> Activity ({selectedActivity})
                    </td>
                    {result.cities.map((c, i) => (
                      <td key={i} className="py-3 px-4 text-right font-bold text-purple-300">
                        {c.is_available && c.activity_score !== undefined
                          ? `${c.activity_score}/100 (${c.activity_category})`
                          : 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Non-ranking disclaimer banner */}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{result.disclaimer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

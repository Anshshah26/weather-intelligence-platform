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
  Activity,
  Droplets,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  analyzeTripWeather,
  TravelPlannerResponse,
} from '../services/travelApi';

interface TravelPlannerPageProps {
  initialCity?: string;
}

export const TravelPlannerPage: React.FC<TravelPlannerPageProps> = ({
  initialCity = 'Mumbai',
}) => {
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
      setError('Please select a valid destination.');
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
        setError('Unable to analyze the trip right now. Please try again.');
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Smart Travel Weather Planner
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Check the weather before you travel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input controls form */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Destination */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" /> Destination
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Start Date */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm color-scheme-dark"
            />
          </div>

          {/* End Date */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" /> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm color-scheme-dark"
            />
          </div>

          {/* Analyze Button */}
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </form>

        {/* Forecast horizon notice */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/60">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            Detailed weather forecast telemetry is available for up to 5 days ahead. Dates beyond provider availability will be explicitly marked.
          </span>
        </div>
      </div>

      {/* Error state */}
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
          <p className="text-slate-300 font-medium text-base">Analyzing your trip...</p>
          <p className="text-slate-500 text-xs">Fetching real weather telemetry and computing trip insights.</p>
        </div>
      )}

      {/* Results content */}
      {!loading && result && (
        <div className="space-y-6">
          {/* Trip Overview Card */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" /> Destination Overview
                </div>
                <h2 className="text-3xl font-extrabold text-white mt-1">
                  ✈️ {result.destination.city}, {result.destination.country}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {result.start_date} → {result.end_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Timezone: <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">{result.destination.timezone}</code>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {result.available_forecast_days} Days Forecast Available
                  </span>
                </div>
              </div>

              {/* Overview Metrics pill box */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 min-w-[280px]">
                <div className="text-center">
                  <div className="text-slate-400 text-xs flex items-center justify-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Overall
                  </div>
                  <div className="text-white font-bold text-sm mt-1">
                    {result.temperature_analysis.average_temperature}°C
                  </div>
                </div>
                <div className="text-center border-x border-slate-800 px-2">
                  <div className="text-slate-400 text-xs flex items-center justify-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rain
                  </div>
                  <div className="text-white font-bold text-sm mt-1">
                    {result.rain_analysis.rain_risk_days.length > 0 ? 'Possible' : 'Low'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 text-xs flex items-center justify-center gap-1">
                    <Umbrella className="w-3.5 h-3.5 text-indigo-400" /> Packing
                  </div>
                  <div className="text-white font-bold text-xs mt-1 truncate">
                    {result.rain_analysis.rain_risk_days.length > 0 ? 'Umbrella' : 'Standard'}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Natural Language Summary */}
            {result.ai_summary && (
              <div className="mt-6 bg-blue-950/30 border border-blue-800/40 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
                    AI Travel Weather Forecast Summary
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    "{result.ai_summary}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Daily Forecast Cards */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" /> Daily Forecast Cards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {result.daily_forecasts.map((dayItem, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border transition-all ${
                    dayItem.is_available
                      ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700 shadow-md'
                      : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">{dayItem.day}</div>
                      <div className="text-sm font-bold text-white">{dayItem.date}</div>
                    </div>
                    {dayItem.is_available && (
                      <img
                        src={`https://openweathermap.org/img/wn/${dayItem.icon}.png`}
                        alt={dayItem.condition}
                        className="w-10 h-10 object-contain"
                      />
                    )}
                  </div>

                  {dayItem.is_available ? (
                    <div className="mt-4 space-y-2.5">
                      <div className="text-sm font-medium text-slate-200 capitalize truncate">
                        {dayItem.condition}
                      </div>

                      <div className="text-xl font-extrabold text-white flex items-baseline gap-1">
                        {Math.round(dayItem.max_temp)}°C
                        <span className="text-xs font-normal text-slate-400">
                          / {Math.round(dayItem.min_temp)}°C
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs border-t border-slate-800/60">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1 text-blue-400">
                            <CloudRain className="w-3.5 h-3.5" /> Rain
                          </span>
                          <span className="font-semibold">{dayItem.precipitation_probability}%</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1 text-teal-400">
                            <Wind className="w-3.5 h-3.5" /> Wind
                          </span>
                          <span className="font-semibold">{dayItem.wind_speed} km/h</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1 text-indigo-400">
                            <Droplets className="w-3.5 h-3.5" /> Humidity
                          </span>
                          <span className="font-semibold">{dayItem.humidity}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 text-center space-y-2 py-4">
                      <Clock className="w-6 h-6 text-slate-500 mx-auto" />
                      <div className="text-xs font-medium text-slate-400">
                        {dayItem.note || 'Forecast not yet available for this date.'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis & Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rain Analysis */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider">
                <CloudRain className="w-4 h-4" /> Rain Analysis
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-xs">Highest Rain Risk:</span>
                  <span className="text-white font-medium text-xs">
                    {result.rain_analysis.highest_rain_day || 'None'}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-xs">Lowest Rain Risk:</span>
                  <span className="text-white font-medium text-xs">
                    {result.rain_analysis.lowest_rain_day || 'None'}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 text-xs block">Umbrella Recommended Days:</span>
                  {result.rain_analysis.rain_risk_days.length > 0 ? (
                    <ul className="space-y-1">
                      {result.rain_analysis.rain_risk_days.map((dayStr, idx) => (
                        <li key={idx} className="text-amber-300 font-medium text-xs flex items-center gap-1.5">
                          <Umbrella className="w-3 h-3 text-amber-400" /> {dayStr}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-emerald-400 font-medium text-xs">No heavy rain days expected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Temperature Analysis */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-wider">
                <Thermometer className="w-4 h-4" /> Temperature Analysis
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-xs">Warmest Available Day:</span>
                  <span className="text-white font-medium text-xs">
                    {result.temperature_analysis.warmest_day || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-xs">Coolest Available Day:</span>
                  <span className="text-white font-medium text-xs">
                    {result.temperature_analysis.coolest_day || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-xs">Average Trip Temp:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {result.temperature_analysis.average_temperature}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Packing Suggestions */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold uppercase tracking-wider">
                <Luggage className="w-4 h-4" /> Packing Suggestions
              </div>

              <div className="space-y-2.5">
                {result.packing_suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trip Summary Overview */}
        </div>
      )}
    </div>
  );
};

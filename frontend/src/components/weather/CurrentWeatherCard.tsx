import { CurrentWeatherResponse } from '../../types/weather';
import { MapPin, CloudSun, Wind, Droplets, Gauge, Eye, Sun, Cloud, CloudRain, Navigation, Search } from 'lucide-react';
import { formatTemp, formatWind, formatPressure } from '../../services/settingsService';

interface CurrentWeatherCardProps {
  data: CurrentWeatherResponse;
  isRealData?: boolean;
}

export const CurrentWeatherCard = ({ data, isRealData = true }: CurrentWeatherCardProps) => {
  const { location, current } = data;

  const getWeatherIcon = (iconCode: string, condition: string) => {
    const main = condition.toLowerCase();
    if (main.includes('rain') || main.includes('drizzle') || main.includes('thunder')) {
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    }
    if (main.includes('cloud')) {
      return <CloudSun className="w-8 h-8 text-cyan-400" />;
    }
    if (main.includes('clear') || main.includes('sun')) {
      return <Sun className="w-8 h-8 text-amber-400" />;
    }
    if (iconCode.includes('d')) {
      return <Sun className="w-8 h-8 text-amber-400" />;
    }
    return <Cloud className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between w-full max-w-full">
      {/* Background Accent Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header: Location & Update badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="min-w-0 max-w-full">
          <div className="flex flex-wrap items-center gap-2 text-slate-300 font-semibold text-lg max-w-full">
            {location.source === 'gps' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shrink-0">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                📍 GPS Location
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                🔎 Searched Location
              </span>
            )}
            <span className="text-white text-lg sm:text-xl font-bold truncate max-w-full">
              {location.city}
              {location.state ? `, ${location.state}` : ''}
              {location.country ? `, ${location.country}` : ''}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            Coordinates: {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isRealData && (
            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-md">
              LIVE DATA
            </span>
          )}
          <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-medium flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 shrink-0" />
            <span>{current.condition}</span>
          </div>
        </div>
      </div>

      {/* Main Temperature Hero Display */}
      <div className="my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight">
              {formatTemp(current.temperature)}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
            <span>Feels like <strong className="text-slate-200">{formatTemp(current.feels_like)}</strong></span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="text-slate-300 capitalize">{current.description}</span>
          </div>
        </div>

        {/* Condition Icon Hero Graphic */}
        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            {getWeatherIcon(current.icon, current.condition)}
          </div>
          <div>
            <div className="text-xs text-slate-400">Atmospheric State</div>
            <div className="text-sm font-semibold text-slate-200 capitalize">{current.description}</div>
          </div>
        </div>
      </div>

      {/* Grid of Key Current Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Humidity</span>
          </div>
          <div className="text-base font-bold text-slate-100">{current.humidity}%</div>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wind</span>
          </div>
          <div className="text-base font-bold text-slate-100">{formatWind(current.wind_speed)}</div>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pressure</span>
          </div>
          <div className="text-base font-bold text-slate-100">{formatPressure(current.pressure)}</div>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Visibility</span>
          </div>
          <div className="text-base font-bold text-slate-100">{current.visibility} km</div>
        </div>
      </div>
    </div>
  );
};

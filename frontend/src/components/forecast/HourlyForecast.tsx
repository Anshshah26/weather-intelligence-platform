import { HourlyItem } from '../../types/weather';
import { Sun, Cloud, CloudSun, CloudRain, Umbrella, Wind } from 'lucide-react';
import { formatTemp, formatWind } from '../../services/settingsService';

interface HourlyForecastProps {
  items?: HourlyItem[];
  loading?: boolean;
  error?: string | null;
  isRealData?: boolean;
}

export const HourlyForecast = ({
  items = [],
  loading = false,
  error = null,
  isRealData = false,
}: HourlyForecastProps) => {

  const getWeatherIcon = (condition: string, iconCode: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunder')) {
      return <CloudRain className="w-6 h-6 text-blue-400" />;
    }
    if (cond.includes('cloud')) {
      return <CloudSun className="w-6 h-6 text-cyan-400" />;
    }
    if (cond.includes('clear') || cond.includes('sun')) {
      return <Sun className="w-6 h-6 text-amber-400" />;
    }
    if (iconCode.includes('d')) {
      return <Sun className="w-6 h-6 text-amber-400" />;
    }
    return <Cloud className="w-6 h-6 text-slate-400" />;
  };

  const formatLocalTime = (timestamp: number, rawTime: string) => {
    if (!timestamp) return rawTime;
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return rawTime;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Hourly Forecast</h2>
          <p className="text-xs text-slate-400">Atmospheric trend over upcoming 3-hour intervals</p>
        </div>
        <div className="flex items-center gap-2">
          {isRealData && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              LIVE 3H SLOTS
            </span>
          )}
          <div className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            Next 24 Hours
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium mb-3">
          {error}
        </div>
      )}

      {/* Skeleton Loading State */}
      {loading ? (
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 no-scrollbar pb-1 sm:pb-0">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col items-center justify-between h-36 min-w-[110px] sm:min-w-0 animate-pulse shrink-0 sm:shrink"
            >
              <div className="w-12 h-3 bg-slate-800 rounded"></div>
              <div className="w-8 h-8 bg-slate-800 rounded-full my-3"></div>
              <div className="w-10 h-4 bg-slate-800 rounded mb-1"></div>
              <div className="w-14 h-3 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Real Hourly Cards */
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 no-scrollbar pb-1 sm:pb-0">
          {items.slice(0, 8).map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center justify-between hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all group relative min-w-[110px] sm:min-w-0 shrink-0 sm:shrink"
            >
              <span className="text-xs font-semibold text-slate-300 group-hover:text-cyan-300">
                {formatLocalTime(item.timestamp, item.time)}
              </span>

              <div className="my-2 transition-transform group-hover:scale-110">
                {getWeatherIcon(item.condition, item.icon)}
              </div>

              <div className="text-center w-full space-y-1">
                <span className="text-base font-bold text-slate-100 block">
                  {formatTemp(item.temperature)}
                </span>

                <div className="flex items-center justify-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 py-0.5 px-1 rounded-md border border-blue-500/20">
                  <Umbrella className="w-3 h-3 shrink-0" />
                  <span>{item.precipitation_probability}%</span>
                </div>

                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                  <Wind className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                  <span>{formatWind(item.wind_speed)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

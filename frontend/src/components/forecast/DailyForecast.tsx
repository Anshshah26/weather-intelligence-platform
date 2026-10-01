import { DailyItem } from '../../types/weather';
import { Sun, Cloud, CloudSun, CloudRain, Umbrella, Wind, Calendar } from 'lucide-react';
import { formatTemp, formatWind } from '../../services/settingsService';

interface DailyForecastProps {
  items?: DailyItem[];
  loading?: boolean;
  error?: string | null;
  isRealData?: boolean;
}

export const DailyForecast = ({
  items = [],
  loading = false,
  error = null,
  isRealData = false,
}: DailyForecastProps) => {

  const getWeatherIcon = (condition: string, iconCode: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunder')) {
      return <CloudRain className="w-7 h-7 text-blue-400" />;
    }
    if (cond.includes('cloud')) {
      return <CloudSun className="w-7 h-7 text-cyan-400" />;
    }
    if (cond.includes('clear') || cond.includes('sun')) {
      return <Sun className="w-7 h-7 text-amber-400" />;
    }
    if (iconCode.includes('d')) {
      return <Sun className="w-7 h-7 text-amber-400" />;
    }
    return <Cloud className="w-7 h-7 text-slate-400" />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            5-Day Extended Forecast
          </h2>
          <p className="text-xs text-slate-400">Daily meteorological projections & thermal range</p>
        </div>
        {isRealData && (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            LIVE DAILY AGGREGATION
          </span>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium mb-3">
          {error}
        </div>
      )}

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 no-scrollbar pb-1 sm:pb-0">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-between h-44 min-w-[130px] sm:min-w-0 animate-pulse shrink-0 sm:shrink"
            >
              <div className="w-16 h-4 bg-slate-800 rounded"></div>
              <div className="w-10 h-10 bg-slate-800 rounded-full my-3"></div>
              <div className="w-20 h-5 bg-slate-800 rounded mb-2"></div>
              <div className="w-16 h-3 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Real Daily Cards */
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 no-scrollbar pb-1 sm:pb-0">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-between hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all group min-w-[130px] sm:min-w-0 shrink-0 sm:shrink"
            >
              <div className="text-center">
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 block">
                  {item.day}
                </span>
                <span className="text-[10px] text-slate-500">{item.date}</span>
              </div>

              <div className="my-3 transition-transform group-hover:scale-110">
                {getWeatherIcon(item.condition, item.icon)}
              </div>

              <div className="text-center w-full space-y-1.5">
                <div className="text-sm font-semibold text-slate-200 capitalize">
                  {item.condition}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="font-bold text-slate-100">{formatTemp(item.temperature.max)}</span>
                  <span className="text-slate-500 font-light">/</span>
                  <span className="text-slate-400">{formatTemp(item.temperature.min)}</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-800/80 text-[10px]">
                  <div className="flex items-center gap-1 text-blue-400">
                    <Umbrella className="w-3 h-3" />
                    <span>{item.precipitation_probability}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Wind className="w-3 h-3 text-cyan-400" />
                    <span>{formatWind(item.wind_speed)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

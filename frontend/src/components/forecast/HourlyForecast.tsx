import { HourlyItem } from '../../types/weather';
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning, Umbrella, Wind, Clock } from 'lucide-react';
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
    if (cond.includes('thunder') || cond.includes('storm')) {
      return <CloudLightning className="w-5 h-5 text-[#F2994A]" />;
    }
    if (cond.includes('rain') || cond.includes('drizzle')) {
      return <CloudRain className="w-5 h-5 text-[#56CCF2]" />;
    }
    if (cond.includes('cloud')) {
      return <CloudSun className="w-5 h-5 text-[#9AA8B2]" />;
    }
    if (cond.includes('clear') || cond.includes('sun') || iconCode.includes('d')) {
      return <Sun className="w-5 h-5 text-[#F2C94C]" />;
    }
    return <Cloud className="w-5 h-5 text-[#9AA8B2]" />;
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
    <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#F4F7F9] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2F80ED]" />
            Hourly Progression
          </h2>
          <p className="text-xs text-[#9AA8B2]">Atmospheric conditions over upcoming intervals</p>
        </div>
        <div className="flex items-center gap-2">
          {isRealData && (
            <span className="text-[10px] font-mono text-[#27AE9B] bg-[#27AE9B]/10 px-2 py-0.5 rounded border border-[#27AE9B]/30 font-medium">
              Live Interval Feed
            </span>
          )}
          <div className="text-xs text-[#9AA8B2] font-mono bg-[#24313C] px-2.5 py-1 rounded border border-[#2B3945]">
            Next 24 Hours
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg text-[#EB5757] text-xs font-medium mb-3">
          {error}
        </div>
      )}

      {/* Skeleton Loading State */}
      {loading ? (
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 no-scrollbar pb-1 sm:pb-0">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3 flex flex-col items-center justify-between h-36 min-w-[110px] sm:min-w-0 animate-pulse shrink-0 sm:shrink"
            >
              <div className="w-12 h-3 bg-[#18232D] rounded"></div>
              <div className="w-6 h-6 bg-[#18232D] rounded-full my-3"></div>
              <div className="w-10 h-4 bg-[#18232D] rounded mb-1"></div>
              <div className="w-14 h-3 bg-[#18232D] rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Real Hourly Cards */
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 no-scrollbar pb-1 sm:pb-0">
          {items.slice(0, 8).map((item, idx) => (
            <div
              key={idx}
              className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3 flex flex-col items-center justify-between hover:border-[#3A4A57] hover:bg-[#2A3946] transition-colors min-w-[110px] sm:min-w-0 shrink-0 sm:shrink"
            >
              <span className="text-xs font-semibold text-[#9AA8B2] font-mono">
                {formatLocalTime(item.timestamp, item.time)}
              </span>

              <div className="my-2">
                {getWeatherIcon(item.condition, item.icon)}
              </div>

              <div className="text-center w-full space-y-1">
                <span className="text-sm font-bold text-[#F4F7F9] font-mono block">
                  {formatTemp(item.temperature)}
                </span>

                <div className="flex items-center justify-center gap-1 text-[10px] text-[#56CCF2] bg-[#2F80ED]/10 py-0.5 px-1 rounded border border-[#2F80ED]/20 font-mono">
                  <Umbrella className="w-3 h-3 shrink-0" />
                  <span>{item.precipitation_probability}%</span>
                </div>

                <div className="flex items-center justify-center gap-1 text-[10px] text-[#9AA8B2] font-mono">
                  <Wind className="w-2.5 h-2.5 text-[#9AA8B2] shrink-0" />
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

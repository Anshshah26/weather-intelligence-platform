import { DailyItem } from '../../types/weather';
import { Sun, Cloud, CloudSun, CloudRain, Umbrella, Wind, Calendar, CloudLightning } from 'lucide-react';
import { formatTemp, formatWind } from '../../services/settingsService';
import { useLanguage } from '../../context/LanguageContext';

interface DailyForecastProps {
  items?: DailyItem[];
  loading?: boolean;
  error?: string | null;
  isRealData?: boolean;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

export const DailyForecast = ({
  items = [],
  loading = false,
  error = null,
  isRealData = false,
  selectedDate,
  onSelectDate,
}: DailyForecastProps) => {
  const { t, translateCondition } = useLanguage();

  const getWeatherIcon = (condition: string, iconCode: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('thunder') || cond.includes('storm')) {
      return <CloudLightning className="w-6 h-6 text-[#F2994A]" />;
    }
    if (cond.includes('rain') || cond.includes('drizzle')) {
      return <CloudRain className="w-6 h-6 text-[#56CCF2]" />;
    }
    if (cond.includes('cloud')) {
      return <CloudSun className="w-6 h-6 text-[#9AA8B2]" />;
    }
    if (cond.includes('clear') || cond.includes('sun') || iconCode.includes('d')) {
      return <Sun className="w-6 h-6 text-[#F2C94C]" />;
    }
    return <Cloud className="w-6 h-6 text-[#9AA8B2]" />;
  };

  return (
    <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#F4F7F9] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2F80ED]" />
            {t('extendedForecast', 'Extended Forecast Timeline')}
          </h2>
          <p className="text-xs text-[#9AA8B2]">{t('forecast', 'Meteorological projections and thermal ranges')}</p>
        </div>
        {isRealData && (
          <span className="text-[10px] font-mono text-[#27AE9B] bg-[#27AE9B]/10 px-2 py-0.5 rounded border border-[#27AE9B]/30 font-medium">
            {t('dailyProjection', 'Daily Projection')}
          </span>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg text-[#EB5757] text-xs font-medium mb-3">
          {error}
        </div>
      )}

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 no-scrollbar pb-1 sm:pb-0">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[#24313C] border border-[#2B3945] rounded-lg p-4 flex flex-col items-center justify-between h-44 min-w-[130px] sm:min-w-0 animate-pulse shrink-0 sm:shrink"
            >
              <div className="w-16 h-3 bg-[#18232D] rounded"></div>
              <div className="w-8 h-8 bg-[#18232D] rounded-full my-3"></div>
              <div className="w-20 h-4 bg-[#18232D] rounded mb-2"></div>
              <div className="w-16 h-3 bg-[#18232D] rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Real Daily Timeline Cards */
        <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 no-scrollbar pb-1 sm:pb-0">
          {items.map((item, idx) => {
            const isSelected = selectedDate ? item.date === selectedDate : idx === 0;

            return (
              <div
                key={idx}
                onClick={() => onSelectDate && onSelectDate(item.date)}
                className={`bg-[#24313C] rounded-lg p-3.5 flex flex-col items-center justify-between transition-colors min-w-[130px] sm:min-w-0 shrink-0 sm:shrink cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#2F80ED] bg-[#293744] shadow-sm'
                    : 'border border-[#2B3945] hover:border-[#3A4A57] hover:bg-[#2A3946]'
                }`}
              >
                <div className="text-center w-full">
                  <span className={`text-xs font-bold uppercase tracking-wider block ${
                    isSelected ? 'text-[#56CCF2]' : 'text-[#F4F7F9]'
                  }`}>
                    {item.day}
                  </span>
                  <span className="text-[10px] text-[#9AA8B2] font-mono">{item.date}</span>
                </div>

                <div className="my-2.5">
                  {getWeatherIcon(item.condition, item.icon)}
                </div>

                <div className="text-center w-full space-y-1.5">
                  <div className="text-xs font-medium text-[#F4F7F9] capitalize truncate">
                    {translateCondition(item.condition)}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono">
                    <span className="font-bold text-[#F4F7F9]">{formatTemp(item.temperature.max)}</span>
                    <span className="text-[#9AA8B2]">/</span>
                    <span className="text-[#9AA8B2]">{formatTemp(item.temperature.min)}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2.5 pt-2 border-t border-[#2B3945] text-[10px]">
                    <div className="flex items-center gap-1 text-[#56CCF2]">
                      <Umbrella className="w-3 h-3" />
                      <span>{item.precipitation_probability}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#9AA8B2]">
                      <Wind className="w-3 h-3 text-[#9AA8B2]" />
                      <span>{formatWind(item.wind_speed)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

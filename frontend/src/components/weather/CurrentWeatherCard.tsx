import { useEffect } from 'react';
import { CurrentWeatherResponse } from '../../types/weather';
import { CloudSun, Wind, Droplets, Gauge, Eye, Sun, Cloud, CloudRain, CloudLightning, Moon, Navigation, Search, Bookmark } from 'lucide-react';
import { formatTemp, formatWind, formatPressure } from '../../services/settingsService';
import { useLanguage } from '../../context/LanguageContext';
import { useFavoriteCities } from '../../hooks/useFavoriteCities';

interface CurrentWeatherCardProps {
  data: CurrentWeatherResponse;
  isRealData?: boolean;
}

export const CurrentWeatherCard = ({ data, isRealData = true }: CurrentWeatherCardProps) => {
  const { t, translateCondition } = useLanguage();
  const { isFavorite, toggleFavorite, updateCityWeather } = useFavoriteCities();
  const { location, current } = data;

  useEffect(() => {
    if (location?.city && current?.temperature !== undefined) {
      updateCityWeather(location.city, current.temperature, current.condition);
    }
  }, [location?.city, current?.temperature, current?.condition, updateCityWeather]);

  const isFav = isFavorite(location.city);

  const getConditionDetails = (iconCode: string, condition: string) => {
    const main = condition.toLowerCase();
    const isNight = iconCode.includes('n');

    if (main.includes('thunder') || main.includes('storm')) {
      return {
        icon: <CloudLightning className="w-8 h-8 text-[#F2994A]" />,
        badgeColor: 'bg-[#F2994A]/10 border-[#F2994A]/30 text-[#F2994A]',
        accentBorder: 'border-l-[#F2994A]',
      };
    }
    if (main.includes('rain') || main.includes('drizzle')) {
      return {
        icon: <CloudRain className="w-8 h-8 text-[#56CCF2]" />,
        badgeColor: 'bg-[#2F80ED]/10 border-[#2F80ED]/30 text-[#56CCF2]',
        accentBorder: 'border-l-[#56CCF2]',
      };
    }
    if (main.includes('clear') || main.includes('sun')) {
      if (isNight) {
        return {
          icon: <Moon className="w-8 h-8 text-[#56CCF2]" />,
          badgeColor: 'bg-[#24313C] border-[#2B3945] text-[#56CCF2]',
          accentBorder: 'border-l-[#56CCF2]',
        };
      }
      return {
        icon: <Sun className="w-8 h-8 text-[#F2C94C]" />,
        badgeColor: 'bg-[#F2C94C]/10 border-[#F2C94C]/30 text-[#F2C94C]',
        accentBorder: 'border-l-[#F2C94C]',
      };
    }
    if (main.includes('cloud')) {
      return {
        icon: isNight ? <Cloud className="w-8 h-8 text-[#9AA8B2]" /> : <CloudSun className="w-8 h-8 text-[#9AA8B2]" />,
        badgeColor: 'bg-[#24313C] border-[#3A4A57] text-[#F4F7F9]',
        accentBorder: 'border-l-[#9AA8B2]',
      };
    }
    return {
      icon: <Cloud className="w-8 h-8 text-[#9AA8B2]" />,
      badgeColor: 'bg-[#24313C] border-[#2B3945] text-[#9AA8B2]',
      accentBorder: 'border-l-[#2B3945]',
    };
  };

  const cond = getConditionDetails(current.icon, current.condition);

  return (
    <div className={`bg-[#18232D] border border-[#2B3945] ${cond.accentBorder} border-l-4 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between w-full max-w-full relative`}>
      {/* Top Station Header: Location metadata and Status badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2B3945]">
        <div className="min-w-0 max-w-full">
          <div className="flex flex-wrap items-center gap-2">
            {location.source === 'gps' ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#2F80ED]/10 border border-[#2F80ED]/30 text-[#56CCF2] text-xs font-medium shrink-0">
                <Navigation className="w-3 h-3 text-[#56CCF2]" />
                {t('gpsTelemetry', 'GPS Telemetry')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#24313C] border border-[#2B3945] text-[#9AA8B2] text-xs font-medium shrink-0">
                <Search className="w-3 h-3 text-[#9AA8B2]" />
                {t('observedStation', 'Observed Station')}
              </span>
            )}
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <h1 className="text-[#F4F7F9] text-lg sm:text-xl font-bold tracking-tight truncate max-w-full">
                {location.city}
                {location.state ? `, ${location.state}` : ''}
                {location.country ? `, ${location.country}` : ''}
              </h1>
              <button
                type="button"
                onClick={() =>
                  toggleFavorite({
                    name: location.city,
                    country: location.country,
                    state: location.state,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    temperature: current.temperature,
                    condition: current.condition,
                  })
                }
                aria-label={
                  isFav
                    ? `${t('removeFavoriteCity', 'Remove Favorite City')}: ${location.city}`
                    : `${t('addFavoriteCity', 'Add Favorite City')}: ${location.city}`
                }
                title={
                  isFav
                    ? `${t('removeFavoriteCity', 'Remove Favorite City')}: ${location.city}`
                    : `${t('addFavoriteCity', 'Add Favorite City')}: ${location.city}`
                }
                className="p-1 rounded-lg text-[#9AA8B2] hover:text-[#F2C94C] hover:bg-[#24313C] transition-colors"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isFav ? 'text-[#F2C94C] fill-[#F2C94C]' : 'text-[#9AA8B2] hover:text-[#F2C94C]'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="text-[11px] text-[#9AA8B2] mt-1 font-mono">
            Lat {location.latitude.toFixed(3)}° &bull; Lon {location.longitude.toFixed(3)}°
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isRealData && (
            <span className="px-2 py-0.5 bg-[#27AE9B]/10 border border-[#27AE9B]/30 text-[#27AE9B] text-[10px] font-mono font-medium rounded">
              {t('liveTelemetry', 'LIVE TELEMETRY')}
            </span>
          )}
          <div className={`px-2.5 py-1 rounded border text-xs font-medium flex items-center gap-1.5 ${cond.badgeColor}`}>
            <span>{translateCondition(current.condition)}</span>
          </div>
        </div>
      </div>

      {/* Main Temperature Hero Display */}
      <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl font-bold text-[#F4F7F9] tracking-tight font-sans">
              {formatTemp(current.temperature)}
            </span>
          </div>
          <div className="text-sm text-[#9AA8B2] mt-1 flex flex-wrap items-center gap-2">
            <span>{t('feelsLike', 'Feels like')} <strong className="text-[#F4F7F9] font-medium">{formatTemp(current.feels_like)}</strong></span>
            <span>&bull;</span>
            <span className="capitalize text-[#F4F7F9]">{translateCondition(current.description) || current.description}</span>
          </div>
        </div>

        {/* Condition Icon Hero Box */}
        <div className="flex items-center gap-3.5 bg-[#24313C] border border-[#2B3945] px-4 py-3 rounded-lg">
          <div className="p-2 bg-[#18232D] rounded border border-[#2B3945]">
            {cond.icon}
          </div>
          <div>
            <div className="text-[11px] text-[#9AA8B2] font-mono uppercase tracking-wider">{t('atmosphericState', 'Atmospheric State')}</div>
            <div className="text-sm font-semibold text-[#F4F7F9] capitalize">{translateCondition(current.description) || current.description}</div>
          </div>
        </div>
      </div>

      {/* Grid of Key Current Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#2B3945]">
        <div className="bg-[#24313C] p-3 rounded-lg border border-[#2B3945]">
          <div className="flex items-center gap-1.5 text-xs text-[#9AA8B2] mb-1">
            <Droplets className="w-3.5 h-3.5 text-[#56CCF2]" />
            <span>{t('humidity', 'Humidity')}</span>
          </div>
          <div className="text-lg font-bold text-[#F4F7F9] font-mono">{current.humidity}%</div>
        </div>

        <div className="bg-[#24313C] p-3 rounded-lg border border-[#2B3945]">
          <div className="flex items-center gap-1.5 text-xs text-[#9AA8B2] mb-1">
            <Wind className="w-3.5 h-3.5 text-[#56CCF2]" />
            <span>{t('wind', 'Wind')}</span>
          </div>
          <div className="text-lg font-bold text-[#F4F7F9] font-mono">{formatWind(current.wind_speed)}</div>
        </div>

        <div className="bg-[#24313C] p-3 rounded-lg border border-[#2B3945]">
          <div className="flex items-center gap-1.5 text-xs text-[#9AA8B2] mb-1">
            <Gauge className="w-3.5 h-3.5 text-[#27AE9B]" />
            <span>{t('pressure', 'Pressure')}</span>
          </div>
          <div className="text-lg font-bold text-[#F4F7F9] font-mono">{formatPressure(current.pressure)}</div>
        </div>

        <div className="bg-[#24313C] p-3 rounded-lg border border-[#2B3945]">
          <div className="flex items-center gap-1.5 text-xs text-[#9AA8B2] mb-1">
            <Eye className="w-3.5 h-3.5 text-[#9AA8B2]" />
            <span>{t('visibility', 'Visibility')}</span>
          </div>
          <div className="text-lg font-bold text-[#F4F7F9] font-mono">{current.visibility} km</div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Bookmark, ChevronRight, X } from 'lucide-react';
import { FavoriteCity } from '../../types/weather';
import { useLanguage } from '../../context/LanguageContext';

interface FavoriteCityItemProps {
  city: FavoriteCity;
  onSelect: (city: FavoriteCity) => void;
  onRemove: (cityName: string) => void;
}

export const FavoriteCityItem: React.FC<FavoriteCityItemProps> = ({
  city,
  onSelect,
  onRemove,
}) => {
  const { t, translateCondition } = useLanguage();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(city.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(city);
    }
  };

  const locationSubtitle = [city.state, city.country].filter(Boolean).join(', ');

  const weatherLabel = city.temperature !== undefined
    ? `${Math.round(city.temperature)}°C${city.condition ? ` · ${translateCondition(city.condition)}` : ''}`
    : t('weatherUnavailable', 'Weather unavailable');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(city)}
      onKeyDown={handleKeyDown}
      aria-label={`${city.name}, ${weatherLabel}. Press Enter to view weather.`}
      className="group relative flex items-center justify-between p-2.5 rounded-lg bg-[#101820] hover:bg-[#24313C] border border-[#2B3945] hover:border-[#3A4A57] transition-all cursor-pointer text-left"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
        <Bookmark className="w-4 h-4 text-[#F2C94C] fill-[#F2C94C] shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 truncate">
            <span className="text-xs sm:text-sm font-semibold text-[#F4F7F9] truncate group-hover:text-white">
              {city.name}
            </span>
            {locationSubtitle && (
              <span className="text-[10px] text-[#9AA8B2] truncate font-mono hidden sm:inline">
                ({locationSubtitle})
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#9AA8B2] group-hover:text-[#CBD5E1] truncate flex items-center gap-1 mt-0.5">
            <span className={city.temperature !== undefined ? 'text-[#56CCF2] font-medium' : 'text-[#9AA8B2]'}>
              {weatherLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`${t('removeFavoriteCity', 'Remove Favorite City')}: ${city.name}`}
          title={`${t('removeFavoriteCity', 'Remove Favorite City')}: ${city.name}`}
          className="p-1 rounded text-[#9AA8B2] hover:text-[#EB5757] hover:bg-[#EB5757]/15 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <ChevronRight className="w-4 h-4 text-[#9AA8B2] group-hover:text-[#2F80ED] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
      </div>
    </div>
  );
};

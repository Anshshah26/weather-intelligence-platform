import React, { useEffect, useRef } from 'react';
import { Bookmark, X, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useFavoriteCities, MAX_FAVORITES } from '../../hooks/useFavoriteCities';
import { FavoriteCityItem } from './FavoriteCityItem';
import { useLanguage } from '../../context/LanguageContext';
import { FavoriteCity } from '../../types/weather';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onSelectCity: (cityName: string) => void;
  onOpenSearch?: () => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  isOpen,
  onClose,
  triggerRef,
  onSelectCity,
  onOpenSearch,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    favoriteCities,
    count,
    maxFavorites,
    removeFavorite,
    feedbackMessage,
  } = useFavoriteCities();
  const { t } = useLanguage();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCitySelect = (city: FavoriteCity) => {
    onClose();
    onSelectCity(city.name);
  };

  const handleAddClick = () => {
    onClose();
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  const isFull = count >= maxFavorites;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#18232D] border border-[#2B3945] rounded-xl shadow-2xl z-50 p-4 space-y-3 text-left animate-in fade-in slide-in-from-top-2 duration-150 max-w-[calc(100vw-1.5rem)]"
      role="dialog"
      aria-label={t('favoriteCities', 'Favorite Cities')}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2B3945]">
        <div className="flex items-center gap-2 text-[#F4F7F9]">
          <Bookmark className="w-4 h-4 text-[#F2C94C] fill-[#F2C94C]" />
          <h2 className="text-sm font-bold tracking-tight">{t('favoriteCities', 'Favorite Cities')}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite Count Indicator: 0/8, 4/8, 8/8 */}
          <span
            aria-label={`${count} of ${MAX_FAVORITES} favorite cities saved`}
            className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${
              isFull
                ? 'bg-[#F2C94C]/15 border-[#F2C94C]/40 text-[#F2C94C]'
                : 'bg-[#101820] border-[#2B3945] text-[#56CCF2]'
            }`}
          >
            {count}/{maxFavorites}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C] transition-colors"
            aria-label={t('close', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Non-blocking feedback notice */}
      {feedbackMessage && (
        <div
          role="status"
          className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 border animate-in fade-in duration-200 ${
            feedbackMessage === 'limit_reached'
              ? 'bg-[#F2C94C]/10 border-[#F2C94C]/30 text-[#F2C94C]'
              : feedbackMessage === 'added'
              ? 'bg-[#27AE9B]/10 border-[#27AE9B]/30 text-[#27AE9B]'
              : 'bg-[#24313C] border-[#2B3945] text-[#9AA8B2]'
          }`}
        >
          {feedbackMessage === 'limit_reached' ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#F2C94C]" />
          ) : feedbackMessage === 'added' ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#27AE9B]" />
          ) : (
            <Bookmark className="w-3.5 h-3.5 shrink-0 text-[#9AA8B2]" />
          )}
          <span className="truncate">
            {feedbackMessage === 'limit_reached'
              ? t('maxFavoritesReached', 'You can save up to 8 favorite cities.')
              : feedbackMessage === 'added'
              ? t('favoriteCityAdded', 'Favorite city added')
              : t('favoriteCityRemoved', 'Favorite city removed')}
          </span>
        </div>
      )}

      {/* City List or Empty State */}
      <div className="space-y-1.5 max-h-72 overflow-y-auto no-scrollbar py-0.5">
        {favoriteCities.length === 0 ? (
          <div className="py-6 px-4 text-center rounded-lg bg-[#101820] border border-[#2B3945] flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#18232D] border border-[#2B3945] flex items-center justify-center text-[#9AA8B2]">
              <Bookmark className="w-5 h-5 text-[#9AA8B2]" />
            </div>
            <p className="text-xs font-semibold text-[#F4F7F9]">
              {t('noFavoriteCities', 'No favorite cities yet')}
            </p>
            <p className="text-[11px] text-[#9AA8B2] max-w-xs leading-relaxed">
              {t('noFavoritesDescription', 'Search for a city and click the bookmark icon to save it.')}
            </p>
          </div>
        ) : (
          favoriteCities.map((city) => (
            <FavoriteCityItem
              key={`${city.name}-${city.latitude || ''}-${city.longitude || ''}`}
              city={city}
              onSelect={handleCitySelect}
              onRemove={removeFavorite}
            />
          ))
        )}
      </div>

      {/* Footer / Add Action */}
      <div className="pt-2 border-t border-[#2B3945]">
        {isFull ? (
          <div className="text-center py-1 text-[11px] font-mono text-[#F2C94C] flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t('maxFavoritesReached', 'You can save up to 8 favorite cities.')}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddClick}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#24313C] hover:bg-[#2A3A47] border border-[#2B3945] hover:border-[#3A4A57] text-[#56CCF2] hover:text-[#F4F7F9] text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addFavoriteCity', 'Add Favorite City')}</span>
          </button>
        )}
      </div>
    </div>
  );
};

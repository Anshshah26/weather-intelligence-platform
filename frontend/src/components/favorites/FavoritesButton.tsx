import React, { useState, useRef } from 'react';
import { Bookmark } from 'lucide-react';
import { FavoritesPanel } from './FavoritesPanel';
import { useFavoriteCities, MAX_FAVORITES } from '../../hooks/useFavoriteCities';
import { useLanguage } from '../../context/LanguageContext';

interface FavoritesButtonProps {
  onSelectCity: (cityName: string) => void;
  onOpenSearch?: () => void;
  className?: string;
  showTextOnDesktop?: boolean;
}

export const FavoritesButton: React.FC<FavoritesButtonProps> = ({
  onSelectCity,
  onOpenSearch,
  className = '',
  showTextOnDesktop = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { count } = useFavoriteCities();
  const { t } = useLanguage();

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        id="favorites-menu-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`${t('favoriteCities', 'Favorite Cities')} (${count}/${MAX_FAVORITES})`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`${t('favoriteCities', 'Favorite Cities')} (${count}/${MAX_FAVORITES})`}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
          isOpen
            ? 'bg-[#24313C] border-[#2F80ED] text-[#F4F7F9]'
            : 'bg-[#18232D] hover:bg-[#24313C] border-[#2B3945] hover:border-[#3A4A57] text-[#9AA8B2] hover:text-[#F4F7F9]'
        } min-h-[38px] ${className}`}
      >
        <Bookmark
          className={`w-4 h-4 transition-transform duration-200 ${
            count > 0 ? 'text-[#F2C94C] fill-[#F2C94C]' : 'text-[#9AA8B2]'
          } ${isOpen ? 'scale-110' : ''}`}
        />

        {showTextOnDesktop && (
          <span className="hidden md:inline font-sans">{t('favorites', 'Favorites')}</span>
        )}

        {/* Count Pill */}
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
            count >= MAX_FAVORITES
              ? 'bg-[#F2C94C]/20 text-[#F2C94C]'
              : count > 0
              ? 'bg-[#2F80ED]/20 text-[#56CCF2]'
              : 'bg-[#101820] text-[#9AA8B2]'
          }`}
        >
          {count}/{MAX_FAVORITES}
        </span>
      </button>

      <FavoritesPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        onSelectCity={onSelectCity}
        onOpenSearch={onOpenSearch}
      />
    </div>
  );
};

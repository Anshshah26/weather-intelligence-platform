import React from 'react';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { useTheme, ThemePreference } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const themeOptions: {
    id: ThemePreference;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'light', label: t('themeLight', 'Light'), icon: Sun },
    { id: 'dark', label: t('themeDark', 'Dark'), icon: Moon },
    { id: 'system', label: t('themeSystem', 'System'), icon: Laptop },
  ];

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider font-mono flex items-center gap-1.5">
        <Palette className="w-3.5 h-3.5 text-[#56CCF2]" />
        <span>{t('theme')}</span>
      </label>

      <div
        className="grid grid-cols-3 gap-1.5 bg-[#101820] border border-[#2B3945] p-1 rounded-lg"
        role="group"
        aria-label="Theme Selection"
      >
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;

          // Selected styling:
          // - Dark: clearly visible dark/slate background, subtle visible border, high-contrast white text, bright cyan-blue moon icon
          // - Light & System: preserve current appearance and behavior
          let btnClasses = 'text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#18232D]';
          let iconColor = 'text-[#9AA8B2]';

          if (isSelected) {
            if (opt.id === 'dark') {
              btnClasses = 'bg-[#1E293B] border border-[#56CCF2]/50 text-white shadow-sm font-semibold';
              iconColor = 'text-[#56CCF2]';
            } else if (opt.id === 'light') {
              btnClasses = 'bg-[#24313C] border border-[#2B3945] text-[#F4F7F9] shadow-sm font-semibold';
              iconColor = 'text-[#F2C94C]';
            } else {
              btnClasses = 'bg-[#24313C] border border-[#2B3945] text-[#F4F7F9] shadow-sm font-semibold';
              iconColor = 'text-[#2F80ED]';
            }
          }

          return (
            <button
              key={opt.id}
              id={`theme-btn-${opt.id}`}
              type="button"
              onClick={() => setTheme(opt.id)}
              aria-pressed={isSelected}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-colors ${btnClasses}`}
            >
              <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
              <span className={`truncate ${isSelected && opt.id === 'dark' ? 'text-white' : ''}`}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

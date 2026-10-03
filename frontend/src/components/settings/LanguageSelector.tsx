import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../i18n';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const options: { value: SupportedLanguage; label: string; nativeLabel: string }[] = [
    { value: 'english', label: 'English', nativeLabel: 'English' },
    { value: 'hindi', label: 'Hindi', nativeLabel: 'हिन्दी' },
    { value: 'gujarati', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  ];

  return (
    <div className="space-y-1.5 text-left">
      <label
        htmlFor="settings-language-select"
        className="block text-xs font-semibold text-[#9AA8B2] uppercase tracking-wider font-mono flex items-center gap-1.5"
      >
        <Globe className="w-3.5 h-3.5 text-[#2F80ED]" />
        <span>{t('language')}</span>
      </label>

      <div className="relative">
        <select
          id="settings-language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="w-full bg-[#101820] border border-[#2B3945] hover:border-[#3A4A57] focus:border-[#2F80ED] text-[#F4F7F9] rounded-lg px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none transition-colors appearance-none cursor-pointer pr-8"
          aria-label="Select Language"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#18232D] text-[#F4F7F9]">
              {opt.label} ({opt.nativeLabel})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#9AA8B2]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

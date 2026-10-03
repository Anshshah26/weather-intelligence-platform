import React, { useState, useRef } from 'react';
import { Settings } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { useLanguage } from '../../context/LanguageContext';

interface SettingsButtonProps {
  className?: string;
  showTextOnDesktop?: boolean;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  className = '',
  showTextOnDesktop = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t('settings', 'Settings')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
          isOpen
            ? 'bg-[#24313C] border-[#2F80ED] text-[#F4F7F9]'
            : 'bg-[#18232D] hover:bg-[#24313C] border-[#2B3945] hover:border-[#3A4A57] text-[#9AA8B2] hover:text-[#F4F7F9]'
        } min-h-[38px] ${className}`}
      >
        <Settings className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45 text-[#2F80ED]' : ''}`} />
        {showTextOnDesktop && (
          <span className="hidden md:inline font-sans">{t('settings', 'Settings')}</span>
        )}
      </button>

      <SettingsPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
      />
    </div>
  );
};

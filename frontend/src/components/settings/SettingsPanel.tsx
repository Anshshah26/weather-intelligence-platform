import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Settings, X, LogIn, User } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  triggerRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
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

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#18232D] border border-[#2B3945] rounded-xl shadow-2xl z-50 p-4 space-y-4 text-left animate-in fade-in slide-in-from-top-2 duration-150"
      role="dialog"
      aria-label={t('settings', 'Settings')}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2B3945]">
        <div className="flex items-center gap-2 text-[#F4F7F9]">
          <Settings className="w-4 h-4 text-[#2F80ED]" />
          <h2 className="text-sm font-bold tracking-tight">{t('settings', 'Settings')}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C] transition-colors"
          aria-label={t('close', 'Close')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User Identity Banner (if logged in) */}
      {user ? (
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#101820] border border-[#2B3945]">
          <div className="w-7 h-7 rounded bg-[#2F80ED] flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-[#F4F7F9] truncate">{user.name}</div>
            <div className="text-[10px] text-[#9AA8B2] truncate font-mono">{user.email}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#101820] border border-[#2B3945] text-xs">
          <div className="flex items-center gap-1.5 text-[#9AA8B2]">
            <User className="w-3.5 h-3.5" />
            <span>{t('guestUser', 'Guest')}</span>
          </div>
          <Link
            to="/login"
            onClick={onClose}
            className="text-[#56CCF2] hover:text-[#F4F7F9] font-medium text-xs flex items-center gap-1"
          >
            <LogIn className="w-3 h-3" />
            <span>{t('signIn', 'Sign In')}</span>
          </Link>
        </div>
      )}

      {/* Language Selection */}
      <LanguageSelector />

      {/* Theme Selection */}
      <ThemeSelector />
    </div>
  );
};

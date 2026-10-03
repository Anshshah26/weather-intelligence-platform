import React, { useEffect } from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useLanguage();

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      <div
        className="w-full max-w-sm bg-[#18232D] border border-[#2B3945] rounded-xl p-5 shadow-2xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2B3945]">
          <div className="flex items-center gap-2 text-[#EB5757]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 id="logout-dialog-title" className="text-base font-bold text-[#F4F7F9]">
              {t('logoutConfirmTitle', 'Log out?')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C] transition-colors"
            aria-label={t('close', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-[#9AA8B2] leading-relaxed">
          {t('logoutConfirmMsg', 'Are you sure you want to log out?')}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-[#24313C] hover:bg-[#2A3946] border border-[#2B3945] text-xs font-medium text-[#F4F7F9] transition-colors"
          >
            {t('cancel', 'Cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#EB5757] hover:bg-[#d84848] text-xs font-medium text-white transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('confirm', 'Logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

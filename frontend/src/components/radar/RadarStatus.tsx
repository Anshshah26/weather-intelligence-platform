import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RadarStatusProps {
  available: boolean;
  provider: string;
  message?: string;
}

export const RadarStatus = ({ available, provider, message }: RadarStatusProps) => {
  const { t } = useLanguage();

  return (
    <div
      className="flex items-center justify-between gap-3 bg-[#18232D] border border-[#2B3945] px-3.5 py-2 rounded-xl shadow-sm text-xs"
      role="status"
      aria-label="Weather Radar Connectivity Status"
    >
      <div className="flex items-center gap-2 font-mono">
        <span className="text-[#9AA8B2]">{t('radarFeed', 'Radar Feed')}:</span>
        {available ? (
          <span className="flex items-center gap-1.5 text-[#27AE9B] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#27AE9B] inline-block" />
            {t('activeFeed', 'Active')} ({provider})
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#F2C94C] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#F2C94C] inline-block" />
            {t('standardMode', 'Standby / Standard Mode')}
          </span>
        )}
      </div>

      {!available && message && (
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#9AA8B2] font-mono border-l border-[#2B3945] pl-3">
          <AlertTriangle className="w-3.5 h-3.5 text-[#F2C94C] shrink-0" />
          <span className="truncate max-w-md">{message}</span>
        </div>
      )}
    </div>
  );
};

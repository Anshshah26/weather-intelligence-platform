import { CloudRain } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const RadarLegend = () => {
  const { t } = useLanguage();

  return (
    <div
      className="bg-[#18232D] border border-[#2B3945] p-3 rounded-xl shadow-xl text-left space-y-2 max-w-xs w-full"
      role="region"
      aria-label="Precipitation Radar Scale Legend"
    >
      <div className="flex items-center justify-between text-xs font-semibold text-[#F4F7F9]">
        <div className="flex items-center gap-1.5 text-[#56CCF2]">
          <CloudRain className="w-3.5 h-3.5" />
          <span>{t('radarReflectivity', 'Radar Reflectivity')}</span>
        </div>
        <span className="text-[10px] text-[#9AA8B2] font-mono">dBZ Scale</span>
      </div>

      {/* Discrete 4-Segment Meteorological Radar Scale */}
      <div className="grid grid-cols-4 gap-1 w-full">
        <div className="h-2 rounded-l bg-[#56CCF2]" title={t('lightRain', 'Light Rain')} />
        <div className="h-2 bg-[#2F80ED]" title={t('moderateRain', 'Moderate Rain')} />
        <div className="h-2 bg-[#F2994A]" title={t('heavyRain', 'Heavy Rain')} />
        <div className="h-2 rounded-r bg-[#EB5757]" title={t('severe', 'Severe')} />
      </div>

      {/* Clearly Readable Radar Category Labels */}
      <div className="grid grid-cols-4 text-[10px] font-mono text-[#9AA8B2] text-center leading-tight">
        <span>{t('lightRain', 'Light Rain')}</span>
        <span>{t('moderateRain', 'Moderate Rain')}</span>
        <span>{t('heavyRain', 'Heavy Rain')}</span>
        <span className="text-[#EB5757] font-semibold">{t('severe', 'Severe')}</span>
      </div>
    </div>
  );
};

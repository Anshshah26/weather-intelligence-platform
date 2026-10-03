import React from 'react';
import { AirQualityMetrics } from '../../types/weather';
import { Wind, AlertCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AirQualityCardProps {
  airQuality?: AirQualityMetrics | null;
  city?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({
  airQuality,
  city = '',
  loading = false,
  error = null,
  onRetry,
}) => {
  const { t } = useLanguage();

  const getLocalizedCategory = (cat: string = '') => {
    const lower = cat.toLowerCase();
    if (lower.includes('good')) return t('good', 'Good');
    if (lower.includes('moderate')) return t('moderate', 'Moderate');
    if (lower.includes('poor') || lower.includes('unhealthy')) return t('poor', 'Poor');
    if (lower.includes('hazardous')) return t('hazardous', 'Hazardous');
    return cat;
  };
  const getCategoryTheme = (cat: string = '') => {
    const categoryLower = cat.toLowerCase();
    if (categoryLower.includes('good')) {
      return {
        badge: 'bg-[#27AE9B]/10 text-[#27AE9B] border-[#27AE9B]/30',
        text: 'text-[#27AE9B]',
        bar: 'bg-[#27AE9B]',
      };
    }
    if (categoryLower.includes('moderate')) {
      return {
        badge: 'bg-[#F2C94C]/10 text-[#F2C94C] border-[#F2C94C]/30',
        text: 'text-[#F2C94C]',
        bar: 'bg-[#F2C94C]',
      };
    }
    if (categoryLower.includes('sensitive') || categoryLower.includes('unhealthy')) {
      return {
        badge: 'bg-[#F2994A]/10 text-[#F2994A] border-[#F2994A]/30',
        text: 'text-[#F2994A]',
        bar: 'bg-[#F2994A]',
      };
    }
    if (categoryLower.includes('hazardous') || categoryLower.includes('very')) {
      return {
        badge: 'bg-[#EB5757]/10 text-[#EB5757] border-[#EB5757]/30',
        text: 'text-[#EB5757]',
        bar: 'bg-[#EB5757]',
      };
    }
    return {
      badge: 'bg-[#24313C] text-[#56CCF2] border-[#2B3945]',
      text: 'text-[#56CCF2]',
      bar: 'bg-[#56CCF2]',
    };
  };

  const theme = getCategoryTheme(airQuality?.category);

  return (
    <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 sm:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#F4F7F9] flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#2F80ED]" />
              {t('airQualityIndex', 'Air Quality Index')} {city ? `— ${city}` : ''}
            </h2>
            <p className="text-xs text-[#9AA8B2]">{t('airQuality', 'Atmospheric particulate and gas telemetry')}</p>
          </div>
          {airQuality && (
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded border ${theme.badge}`}>
              {getLocalizedCategory(airQuality.category)}
            </span>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3.5 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg flex items-center justify-between gap-3 text-[#EB5757] text-xs my-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EB5757]" />
              <span>Air quality data is temporarily unavailable.</span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-2.5 py-1 bg-[#EB5757]/20 hover:bg-[#EB5757]/30 border border-[#EB5757]/40 text-[#F4F7F9] text-[11px] font-medium rounded transition-colors shrink-0"
              >
                {t('retry', 'Retry')}
              </button>
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-3.5 animate-pulse">
            <div className="flex items-center gap-4 bg-[#24313C] p-4 rounded-lg border border-[#2B3945]">
              <div className="w-16 h-12 bg-[#18232D] rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="w-24 h-4 bg-[#18232D] rounded"></div>
                <div className="w-48 h-3 bg-[#18232D] rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-[#24313C] p-3 rounded-lg border border-[#2B3945] h-16"></div>
              ))}
            </div>
          </div>
        ) : airQuality ? (
          /* Main Content */
          <div className="space-y-4">
            {/* AQI Overview Banner */}
            <div className="bg-[#24313C] border border-[#2B3945] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <div className={`text-4xl font-bold font-mono ${theme.text}`}>
                  {airQuality.aqi}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-[#9AA8B2]">{t('usAqiStandard', 'US AQI Standard')}</div>
                  <div className="text-xs text-[#F4F7F9] mt-0.5 leading-snug">
                    {airQuality.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#9AA8B2] bg-[#18232D] px-2.5 py-1.5 rounded border border-[#2B3945] shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#27AE9B] shrink-0" />
                <span>{t('liveTelemetry', 'Station Feed')}</span>
              </div>
            </div>

            {/* Pollutant Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3">
                <div className="text-[10px] font-mono text-[#9AA8B2] uppercase">PM2.5</div>
                <div className="text-sm font-bold text-[#F4F7F9] font-mono mt-0.5">{airQuality.pm2_5} <span className="text-[10px] text-[#9AA8B2] font-normal">µg/m³</span></div>
              </div>
              <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3">
                <div className="text-[10px] font-mono text-[#9AA8B2] uppercase">PM10</div>
                <div className="text-sm font-bold text-[#F4F7F9] font-mono mt-0.5">{airQuality.pm10} <span className="text-[10px] text-[#9AA8B2] font-normal">µg/m³</span></div>
              </div>
              <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3">
                <div className="text-[10px] font-mono text-[#9AA8B2] uppercase">NO₂</div>
                <div className="text-sm font-bold text-[#F4F7F9] font-mono mt-0.5">{airQuality.no2} <span className="text-[10px] text-[#9AA8B2] font-normal">µg/m³</span></div>
              </div>
              <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3">
                <div className="text-[10px] font-mono text-[#9AA8B2] uppercase">O₃</div>
                <div className="text-sm font-bold text-[#F4F7F9] font-mono mt-0.5">{airQuality.o3} <span className="text-[10px] text-[#9AA8B2] font-normal">µg/m³</span></div>
              </div>
              <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3">
                <div className="text-[10px] font-mono text-[#9AA8B2] uppercase">SO₂</div>
                <div className="text-sm font-bold text-[#F4F7F9] font-mono mt-0.5">{airQuality.so2} <span className="text-[10px] text-[#9AA8B2] font-normal">µg/m³</span></div>
              </div>
              <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3">
                <div className="text-[10px] font-mono text-[#9AA8B2] uppercase">CO</div>
                <div className="text-sm font-bold text-[#F4F7F9] font-mono mt-0.5">{airQuality.co} <span className="text-[10px] text-[#9AA8B2] font-normal">µg/m³</span></div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

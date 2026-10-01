import React from 'react';
import { AirQualityMetrics } from '../../types/weather';
import { Wind, AlertCircle, RefreshCw, ShieldCheck, Activity } from 'lucide-react';

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
  const getCategoryTheme = (cat: string = '') => {
    const categoryLower = cat.toLowerCase();
    if (categoryLower.includes('good')) {
      return {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        text: 'text-emerald-400',
        bar: 'bg-emerald-400',
      };
    }
    if (categoryLower.includes('moderate')) {
      return {
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        text: 'text-amber-400',
        bar: 'bg-amber-400',
      };
    }
    if (categoryLower.includes('sensitive')) {
      return {
        badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        text: 'text-orange-400',
        bar: 'bg-orange-400',
      };
    }
    if (categoryLower.includes('very unhealthy') || categoryLower.includes('hazardous')) {
      return {
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        text: 'text-purple-400',
        bar: 'bg-purple-400',
      };
    }
    if (categoryLower.includes('unhealthy')) {
      return {
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        text: 'text-rose-400',
        bar: 'bg-rose-400',
      };
    }
    return {
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      text: 'text-cyan-400',
      bar: 'bg-cyan-400',
    };
  };

  const theme = getCategoryTheme(airQuality?.category);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              Air Quality {city ? `— ${city}` : ''}
            </h2>
            <p className="text-xs text-slate-400">Atmospheric pollution telemetry & pollutant breakdown</p>
          </div>
          {airQuality && (
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${theme.badge}`}>
              {airQuality.category}
            </span>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3 text-rose-300 text-xs my-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Air quality data is temporarily unavailable.</span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-[11px] font-semibold rounded-md transition-colors shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="w-16 h-12 bg-slate-800 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="w-24 h-4 bg-slate-800 rounded"></div>
                <div className="w-48 h-3 bg-slate-800 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 h-16"></div>
              ))}
            </div>
          </div>
        ) : airQuality ? (
          /* Main Content */
          <div className="space-y-5">
            {/* AQI Overview Banner */}
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <div className={`text-4xl font-extrabold ${theme.text}`}>
                  {airQuality.aqi}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-slate-400">US AQI Index</div>
                  <div className="text-xs text-slate-300 mt-0.5 leading-snug">
                    {airQuality.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live Environmental Telemetry</span>
              </div>
            </div>

            {/* Pollutant Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">PM2.5</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{airQuality.pm2_5} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span></div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">PM10</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{airQuality.pm10} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span></div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">NO₂</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{airQuality.no2} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span></div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">O₃</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{airQuality.o3} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span></div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">SO₂</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{airQuality.so2} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span></div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">CO</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{airQuality.co} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span></div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { HourlyItem } from '../../types/weather';
import { TrendingUp, Thermometer, Umbrella, Wind, AlertCircle } from 'lucide-react';
import { formatTemp, formatWind } from '../../services/settingsService';

interface WeatherTrendsGraphProps {
  items?: HourlyItem[];
  selectedDateLabel?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

type GraphMetric = 'temperature' | 'rain' | 'wind';

export const WeatherTrendsGraph: React.FC<WeatherTrendsGraphProps> = ({
  items = [],
  selectedDateLabel = 'Selected Date',
  loading = false,
  error = null,
  onRetry,
}) => {
  const [metric, setMetric] = useState<GraphMetric>('temperature');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayItems = items.length > 0 ? items : [];

  // Graph Dimensions
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = 700;
  const chartHeight = 220;

  // Calculate Min & Max values for Y-axis scaling
  const getMinMax = () => {
    if (displayItems.length === 0) return { min: 0, max: 100 };

    if (metric === 'temperature') {
      const temps = displayItems.flatMap((i) => [i.temperature, i.feels_like]);
      const min = Math.floor(Math.min(...temps) - 2);
      const max = Math.ceil(Math.max(...temps) + 2);
      return { min, max: Math.max(max, min + 5) };
    } else if (metric === 'rain') {
      return { min: 0, max: 100 };
    } else {
      const winds = displayItems.map((i) => i.wind_speed);
      const min = 0;
      const max = Math.ceil(Math.max(...winds) + 5);
      return { min, max: Math.max(max, 10) };
    }
  };

  const { min, max } = getMinMax();
  const range = max - min || 1;

  const getX = (idx: number) => {
    if (displayItems.length <= 1) return paddingX;
    return paddingX + (idx / (displayItems.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const normalized = (val - min) / range;
    return chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
  };

  // Generate SVG polyline path
  const makePath = (key: 'temperature' | 'feels_like' | 'precipitation_probability' | 'wind_speed') => {
    if (displayItems.length === 0) return '';
    return displayItems
      .map((item, idx) => {
        const val = item[key] ?? 0;
        return `${getX(idx)},${getY(val)}`;
      })
      .join(' ');
  };

  const hoveredItem = hoveredIdx !== null ? displayItems[hoveredIdx] : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header & Metric Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Weather Trends — {selectedDateLabel}
            </h2>
            <p className="text-xs text-slate-400">Interactive trend visualization & telemetry metrics</p>
          </div>

          {/* Metric Switcher Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl p-1 max-w-full">
            <button
              onClick={() => setMetric('temperature')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metric === 'temperature'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temp</span>
            </button>
            <button
              onClick={() => setMetric('rain')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metric === 'rain'
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Umbrella className="w-3.5 h-3.5" />
              <span>Rain</span>
            </button>
            <button
              onClick={() => setMetric('wind')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metric === 'wind'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Wind</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3 text-rose-300 text-xs my-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Weather trend data is temporarily unavailable.</span>
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
          <div className="w-full h-56 bg-slate-950/60 rounded-xl border border-slate-800/80 p-4 animate-pulse flex flex-col justify-between">
            <div className="w-32 h-4 bg-slate-800 rounded"></div>
            <div className="w-full h-32 bg-slate-800/40 rounded"></div>
            <div className="flex justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-10 h-3 bg-slate-800 rounded"></div>
              ))}
            </div>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-400 text-xs">
            No trend data available for {selectedDateLabel}.
          </div>
        ) : (
          /* SVG Interactive Line Chart */
          <div className="relative bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 sm:p-4 overflow-hidden w-full max-w-full">
            {/* Tooltip Overlay */}
            {hoveredItem && (
              <div
                className="absolute top-3 right-4 bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl z-20 text-xs space-y-1 backdrop-blur-md pointer-events-none min-w-[140px]"
              >
                <div className="font-bold text-cyan-300 border-b border-slate-800 pb-1 flex justify-between">
                  <span>{hoveredItem.time}</span>
                  <span className="capitalize text-slate-400 font-normal">{hoveredItem.condition}</span>
                </div>
                <div className="text-slate-200">
                  Temp: <span className="font-semibold">{formatTemp(hoveredItem.temperature)}</span>
                </div>
                <div className="text-slate-400">
                  Feels like: <span className="font-semibold">{formatTemp(hoveredItem.feels_like)}</span>
                </div>
                <div className="text-blue-400">
                  Rain: <span className="font-semibold">{hoveredItem.precipitation_probability}%</span>
                </div>
                <div className="text-emerald-400">
                  Wind: <span className="font-semibold">{formatWind(hoveredItem.wind_speed)}</span>
                </div>
              </div>
            )}

            {/* SVG Chart */}
            <div className="w-full overflow-x-auto no-scrollbar">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto max-w-full min-w-[320px] sm:min-w-[500px]">
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yVal = paddingY + ratio * (chartHeight - paddingY * 2);
                  const metricVal = Math.round(max - ratio * range);
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={yVal}
                        x2={chartWidth - paddingX}
                        y2={yVal}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 8}
                        y={yVal + 4}
                        fill="#64748b"
                        fontSize="10"
                        textAnchor="end"
                      >
                        {metricVal}
                        {metric === 'temperature' ? '°' : metric === 'rain' ? '%' : ''}
                      </text>
                    </g>
                  );
                })}

                {/* Temperature mode lines */}
                {metric === 'temperature' && (
                  <>
                    {/* Feels-like line (cyan dashed) */}
                    <polyline
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      points={makePath('feels_like')}
                      opacity="0.8"
                    />
                    {/* Actual Temperature line (amber solid) */}
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      points={makePath('temperature')}
                    />
                  </>
                )}

                {/* Rain mode line */}
                {metric === 'rain' && (
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    points={makePath('precipitation_probability')}
                  />
                )}

                {/* Wind mode line */}
                {metric === 'wind' && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points={makePath('wind_speed')}
                  />
                )}

                {/* Interactive Data Points */}
                {displayItems.map((item, idx) => {
                  const x = getX(idx);
                  let val = item.temperature;
                  let strokeColor = '#f59e0b';

                  if (metric === 'rain') {
                    val = item.precipitation_probability;
                    strokeColor = '#3b82f6';
                  } else if (metric === 'wind') {
                    val = item.wind_speed;
                    strokeColor = '#10b981';
                  }

                  const y = getY(val);
                  const isHovered = hoveredIdx === idx;

                  return (
                    <g
                      key={idx}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 7 : 4}
                        fill="#090d16"
                        stroke={strokeColor}
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                      {/* X-axis time label */}
                      <text
                        x={x}
                        y={chartHeight - 8}
                        fill={isHovered ? '#38bdf8' : '#64748b'}
                        fontSize="10"
                        textAnchor="middle"
                        fontWeight={isHovered ? 'bold' : 'normal'}
                      >
                        {item.time}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 border-t border-slate-800/80 pt-3 text-xs">
              {metric === 'temperature' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-amber-500 rounded"></span>
                    <span className="text-slate-300">Temperature (°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-cyan-400 border border-dashed border-cyan-400 rounded"></span>
                    <span className="text-slate-400">Feels Like (°C)</span>
                  </div>
                </>
              ) : metric === 'rain' ? (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-blue-500 rounded"></span>
                  <span className="text-slate-300">Rain Probability (%)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-emerald-500 rounded"></span>
                  <span className="text-slate-300">Wind Speed (km/h)</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

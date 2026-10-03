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
    <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 sm:p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header & Metric Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#F4F7F9] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2F80ED]" />
              Weather Trends — {selectedDateLabel}
            </h2>
            <p className="text-xs text-[#9AA8B2]">Atmospheric trend lines and hourly variations</p>
          </div>

          {/* Metric Switcher Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 bg-[#101820] border border-[#2B3945] rounded-lg p-1 max-w-full">
            <button
              onClick={() => setMetric('temperature')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                metric === 'temperature'
                  ? 'bg-[#24313C] border border-[#2B3945] text-[#F2C94C] shadow-sm'
                  : 'text-[#9AA8B2] hover:text-[#F4F7F9]'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temp</span>
            </button>
            <button
              onClick={() => setMetric('rain')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                metric === 'rain'
                  ? 'bg-[#24313C] border border-[#2B3945] text-[#2F80ED] shadow-sm'
                  : 'text-[#9AA8B2] hover:text-[#F4F7F9]'
              }`}
            >
              <Umbrella className="w-3.5 h-3.5" />
              <span>Rain</span>
            </button>
            <button
              onClick={() => setMetric('wind')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                metric === 'wind'
                  ? 'bg-[#24313C] border border-[#2B3945] text-[#27AE9B] shadow-sm'
                  : 'text-[#9AA8B2] hover:text-[#F4F7F9]'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Wind</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3.5 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg flex items-center justify-between gap-3 text-[#EB5757] text-xs my-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EB5757]" />
              <span>Weather trend data is temporarily unavailable.</span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-2.5 py-1 bg-[#EB5757]/20 hover:bg-[#EB5757]/30 border border-[#EB5757]/40 text-[#F4F7F9] text-[11px] font-medium rounded transition-colors shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="w-full h-56 bg-[#101820] rounded-lg border border-[#2B3945] p-4 animate-pulse flex flex-col justify-between">
            <div className="w-32 h-4 bg-[#24313C] rounded"></div>
            <div className="w-full h-32 bg-[#24313C]/40 rounded"></div>
            <div className="flex justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-10 h-3 bg-[#24313C] rounded"></div>
              ))}
            </div>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="p-8 text-center bg-[#101820] rounded-lg border border-[#2B3945] text-[#9AA8B2] text-xs">
            No trend data available for {selectedDateLabel}.
          </div>
        ) : (
          /* SVG Interactive Line Chart */
          <div className="relative bg-[#101820] border border-[#2B3945] rounded-lg p-3 sm:p-4 overflow-hidden w-full max-w-full">
            {/* Tooltip Overlay */}
            {hoveredItem && (
              <div
                className="absolute top-3 right-4 bg-[#18232D] border border-[#2B3945] p-3 rounded-lg shadow-xl z-20 text-xs space-y-1 pointer-events-none min-w-[140px]"
              >
                <div className="font-bold text-[#F4F7F9] border-b border-[#2B3945] pb-1 flex justify-between font-mono">
                  <span>{hoveredItem.time}</span>
                  <span className="capitalize text-[#9AA8B2] font-normal">{hoveredItem.condition}</span>
                </div>
                <div className="text-[#F4F7F9]">
                  Temp: <span className="font-semibold font-mono text-[#F2C94C]">{formatTemp(hoveredItem.temperature)}</span>
                </div>
                <div className="text-[#9AA8B2]">
                  Feels like: <span className="font-semibold font-mono">{formatTemp(hoveredItem.feels_like)}</span>
                </div>
                <div className="text-[#56CCF2]">
                  Rain: <span className="font-semibold font-mono">{hoveredItem.precipitation_probability}%</span>
                </div>
                <div className="text-[#27AE9B]">
                  Wind: <span className="font-semibold font-mono">{formatWind(hoveredItem.wind_speed)}</span>
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
                        stroke="#2B3945"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 8}
                        y={yVal + 4}
                        fill="#9AA8B2"
                        fontSize="10"
                        fontFamily="monospace"
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
                    {/* Feels-like line (sky blue dashed) */}
                    <polyline
                      fill="none"
                      stroke="#56CCF2"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      points={makePath('feels_like')}
                      opacity="0.8"
                    />
                    {/* Actual Temperature line (warm yellow solid) */}
                    <polyline
                      fill="none"
                      stroke="#F2C94C"
                      strokeWidth="2.5"
                      points={makePath('temperature')}
                    />
                  </>
                )}

                {/* Rain mode line */}
                {metric === 'rain' && (
                  <polyline
                    fill="none"
                    stroke="#2F80ED"
                    strokeWidth="2.5"
                    points={makePath('precipitation_probability')}
                  />
                )}

                {/* Wind mode line */}
                {metric === 'wind' && (
                  <polyline
                    fill="none"
                    stroke="#27AE9B"
                    strokeWidth="2.5"
                    points={makePath('wind_speed')}
                  />
                )}

                {/* Interactive Data Points */}
                {displayItems.map((item, idx) => {
                  const x = getX(idx);
                  let val = item.temperature;
                  let strokeColor = '#F2C94C';

                  if (metric === 'rain') {
                    val = item.precipitation_probability;
                    strokeColor = '#2F80ED';
                  } else if (metric === 'wind') {
                    val = item.wind_speed;
                    strokeColor = '#27AE9B';
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
                        r={isHovered ? 6 : 3.5}
                        fill="#101820"
                        stroke={strokeColor}
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                      {/* X-axis time label */}
                      <text
                        x={x}
                        y={chartHeight - 8}
                        fill={isHovered ? '#F4F7F9' : '#9AA8B2'}
                        fontSize="10"
                        fontFamily="monospace"
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
            <div className="flex items-center justify-center gap-6 border-t border-[#2B3945] pt-3 text-xs">
              {metric === 'temperature' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-[#F2C94C] rounded"></span>
                    <span className="text-[#F4F7F9]">Temperature (°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-[#56CCF2] rounded"></span>
                    <span className="text-[#9AA8B2]">Feels Like (°C)</span>
                  </div>
                </>
              ) : metric === 'rain' ? (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-[#2F80ED] rounded"></span>
                  <span className="text-[#F4F7F9]">Precipitation Probability (%)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-[#27AE9B] rounded"></span>
                  <span className="text-[#F4F7F9]">Wind Speed (km/h)</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

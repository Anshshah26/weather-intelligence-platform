import { useState } from 'react';
import { Thermometer, CloudRain, Cloud, Wind, Gauge, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { ActiveLayersState } from './MapControls';

interface DynamicMapLegendProps {
  activeLayers: ActiveLayersState;
}

export const DynamicMapLegend = ({ activeLayers }: DynamicMapLegendProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  if (activeCount === 0) return null;

  return (
    <div
      className="bg-[#18232D] border border-[#2B3945] rounded-xl shadow-xl overflow-hidden transition-all duration-200 max-w-xs w-full text-left"
      role="region"
      aria-label="Active Weather Layers Legend"
    >
      {/* Legend Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#24313C] border-b border-[#2B3945]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F7F9]">
          <Info className="w-3.5 h-3.5 text-[#56CCF2]" />
          <span>Active Legends ({activeCount})</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand weather map legends' : 'Collapse weather map legends'}
          className="p-1 rounded hover:bg-[#18232D] text-[#9AA8B2] hover:text-[#F4F7F9] transition-colors"
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Legend Items Body */}
      {!isCollapsed && (
        <div className="p-3 space-y-3 max-h-64 overflow-y-auto no-scrollbar">
          {/* Temperature Legend */}
          {activeLayers.temp && (
            <div className="space-y-1.5" aria-label="Temperature Legend">
              <div className="flex items-center justify-between text-xs font-medium text-[#F4F7F9]">
                <div className="flex items-center gap-1.5 text-[#F2C94C]">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Temperature (°C)</span>
                </div>
                <span className="text-[10px] text-[#9AA8B2] font-mono">Cold → Hot</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-amber-400 to-red-600 border border-[#2B3945]" />
              <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
                <span>-40°C</span>
                <span>0°C</span>
                <span>+40°C</span>
              </div>
            </div>
          )}

          {/* Rain Legend */}
          {activeLayers.rain && (
            <div className="space-y-1.5" aria-label="Rain Legend">
              <div className="flex items-center justify-between text-xs font-medium text-[#F4F7F9]">
                <div className="flex items-center gap-1.5 text-[#56CCF2]">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Precipitation Rate</span>
                </div>
                <span className="text-[10px] text-[#9AA8B2] font-mono">Light → Heavy</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-sky-300 via-blue-500 via-indigo-600 to-purple-600 border border-[#2B3945]" />
              <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
                <span>0.1 mm</span>
                <span>10 mm</span>
                <span>50+ mm</span>
              </div>
            </div>
          )}

          {/* Clouds Legend */}
          {activeLayers.clouds && (
            <div className="space-y-1.5" aria-label="Clouds Legend">
              <div className="flex items-center justify-between text-xs font-medium text-[#F4F7F9]">
                <div className="flex items-center gap-1.5 text-[#9AA8B2]">
                  <Cloud className="w-3.5 h-3.5 text-[#9AA8B2]" />
                  <span>Cloud Cover (%)</span>
                </div>
                <span className="text-[10px] text-[#9AA8B2] font-mono">Clear → Overcast</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-[#18232D] via-slate-500 to-[#F4F7F9] border border-[#2B3945]" />
              <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Wind Legend */}
          {activeLayers.wind && (
            <div className="space-y-1.5" aria-label="Wind Legend">
              <div className="flex items-center justify-between text-xs font-medium text-[#F4F7F9]">
                <div className="flex items-center gap-1.5 text-[#27AE9B]">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Wind Velocity</span>
                </div>
                <span className="text-[10px] text-[#9AA8B2] font-mono">Calm → Strong</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 via-amber-400 to-rose-600 border border-[#2B3945]" />
              <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
                <span>0 m/s</span>
                <span>10 m/s</span>
                <span>25+ m/s</span>
              </div>
            </div>
          )}

          {/* Pressure Legend */}
          {activeLayers.pressure && (
            <div className="space-y-1.5" aria-label="Pressure Legend">
              <div className="flex items-center justify-between text-xs font-medium text-[#F4F7F9]">
                <div className="flex items-center gap-1.5 text-[#56CCF2]">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Barometric Pressure</span>
                </div>
                <span className="text-[10px] text-[#9AA8B2] font-mono">Low → High</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-700 via-purple-600 via-pink-500 to-amber-500 border border-[#2B3945]" />
              <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
                <span>950 hPa</span>
                <span>1013 hPa</span>
                <span>1070 hPa</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

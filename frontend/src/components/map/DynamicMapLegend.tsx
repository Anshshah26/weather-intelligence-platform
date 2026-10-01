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
      className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 max-w-xs w-full text-left"
      role="region"
      aria-label="Active Weather Layers Legend"
    >
      {/* Legend Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/70 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Layer Legends ({activeCount})</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand weather map legends' : 'Collapse weather map legends'}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Legend Items Body */}
      {!isCollapsed && (
        <div className="p-3 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {/* Temperature Legend */}
          {activeLayers.temp && (
            <div className="space-y-1.5" aria-label="Temperature Legend">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Temperature (°C)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Cold → Hot</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-amber-400 to-red-600 border border-slate-800" />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>-40°C</span>
                <span>0°C</span>
                <span>+40°C</span>
              </div>
            </div>
          )}

          {/* Rain Legend */}
          {activeLayers.rain && (
            <div className="space-y-1.5" aria-label="Rain Legend">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Precipitation (mm/h)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Light → Heavy</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-sky-300 via-blue-500 via-indigo-600 to-purple-600 border border-slate-800" />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>0.1 mm/h</span>
                <span>10 mm/h</span>
                <span>50+ mm/h</span>
              </div>
            </div>
          )}

          {/* Clouds Legend */}
          {activeLayers.clouds && (
            <div className="space-y-1.5" aria-label="Clouds Legend">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Cloud className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cloud Cover (%)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Clear → Overcast</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-slate-800 via-slate-500 to-slate-100 border border-slate-700" />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Wind Legend */}
          {activeLayers.wind && (
            <div className="space-y-1.5" aria-label="Wind Legend">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5 text-teal-400">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Wind Speed (m/s)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Calm → Strong</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 via-amber-400 to-rose-600 border border-slate-700" />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>0 m/s</span>
                <span>10 m/s</span>
                <span>25+ m/s</span>
              </div>
            </div>
          )}

          {/* Pressure Legend */}
          {activeLayers.pressure && (
            <div className="space-y-1.5" aria-label="Pressure Legend">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5 text-purple-400">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Pressure (hPa)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Low → High</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-700 via-purple-600 via-pink-500 to-amber-500 border border-slate-700" />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
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

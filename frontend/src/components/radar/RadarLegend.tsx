import { CloudRain } from 'lucide-react';

export const RadarLegend = () => {
  return (
    <div
      className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-xl text-left space-y-1.5 max-w-xs w-full"
      role="region"
      aria-label="Precipitation Radar Scale Legend"
    >
      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <CloudRain className="w-3.5 h-3.5" />
          <span>Precipitation Intensity</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Radar Scale</span>
      </div>

      {/* Standard Radar Intensity Color Gradient Bar */}
      <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 via-emerald-400 via-amber-400 to-rose-600 border border-slate-800" />

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Light</span>
        <span>Moderate</span>
        <span>Heavy</span>
      </div>
    </div>
  );
};

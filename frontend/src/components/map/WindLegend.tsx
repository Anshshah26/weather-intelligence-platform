import { Wind } from 'lucide-react';

export const WindLegend = () => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
        <div className="flex items-center gap-1.5 text-teal-400">
          <Wind className="w-3.5 h-3.5 text-teal-400" />
          <span>Wind Speed (m/s)</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">OpenWeather Layer</span>
      </div>

      {/* Wind Gradient Bar */}
      <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 via-amber-400 to-rose-600 border border-slate-700"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>0 m/s (Calm)</span>
        <span>10 m/s</span>
        <span>25+ m/s (Gale)</span>
      </div>
    </div>
  );
};

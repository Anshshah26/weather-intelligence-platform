import { Gauge } from 'lucide-react';

export const PressureLegend = () => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
        <div className="flex items-center gap-1.5 text-purple-400">
          <Gauge className="w-3.5 h-3.5 text-purple-400" />
          <span>Atmospheric Pressure (hPa)</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">OpenWeather Layer</span>
      </div>

      {/* Pressure Gradient Bar */}
      <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-blue-700 via-purple-600 via-pink-500 to-amber-500 border border-slate-700"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>950 hPa (Low)</span>
        <span>1013 hPa</span>
        <span>1070 hPa (High)</span>
      </div>
    </div>
  );
};

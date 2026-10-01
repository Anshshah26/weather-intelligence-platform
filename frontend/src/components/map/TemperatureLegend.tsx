import { Thermometer } from 'lucide-react';

export const TemperatureLegend = () => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Thermometer className="w-3.5 h-3.5" />
          <span>Global Temperature (°C)</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">OpenWeather Layer</span>
      </div>

      {/* Temperature Spectrum Gradient Bar */}
      <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-purple-700 via-blue-500 via-cyan-400 via-emerald-400 via-yellow-400 via-orange-500 to-red-600 border border-slate-800"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>-40°C (Cold)</span>
        <span>0°C</span>
        <span>+40°C (Hot)</span>
      </div>
    </div>
  );
};

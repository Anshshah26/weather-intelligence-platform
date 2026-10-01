import { CloudRain } from 'lucide-react';

export const RainLegend = () => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
        <div className="flex items-center gap-1.5 text-blue-400">
          <CloudRain className="w-3.5 h-3.5" />
          <span>Precipitation Rate (mm/h)</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">OpenWeather Layer</span>
      </div>

      {/* Rain Spectrum Gradient Bar */}
      <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-sky-300 via-blue-500 via-indigo-600 via-purple-600 to-pink-600 border border-slate-800"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>0.1 mm/h (Light)</span>
        <span>10 mm/h</span>
        <span>50+ mm/h (Heavy)</span>
      </div>
    </div>
  );
};

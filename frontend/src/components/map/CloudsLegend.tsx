import { Cloud } from 'lucide-react';

export const CloudsLegend = () => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Cloud className="w-3.5 h-3.5 text-slate-400" />
          <span>Cloud Coverage (%)</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">OpenWeather Layer</span>
      </div>

      {/* Clouds Gradient Bar */}
      <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-slate-800 via-slate-500 to-slate-100 border border-slate-700"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>0% (Clear)</span>
        <span>50%</span>
        <span>100% (Overcast)</span>
      </div>
    </div>
  );
};

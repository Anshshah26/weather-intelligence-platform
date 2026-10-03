import { Cloud } from 'lucide-react';

export const CloudsLegend = () => {
  return (
    <div className="bg-[#18232D] border border-[#2B3945] p-3 rounded-xl shadow-lg text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-[#F4F7F9]">
        <div className="flex items-center gap-1.5 text-[#9AA8B2]">
          <Cloud className="w-3.5 h-3.5 text-[#9AA8B2]" />
          <span>Cloud Coverage (%)</span>
        </div>
        <span className="text-[10px] text-[#9AA8B2] font-mono">OpenWeather Layer</span>
      </div>

      {/* Clouds Gradient Bar */}
      <div className="w-full h-2 rounded-full bg-gradient-to-r from-[#18232D] via-slate-500 to-[#F4F7F9] border border-[#2B3945]"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
        <span>0% (Clear)</span>
        <span>50%</span>
        <span>100% (Overcast)</span>
      </div>
    </div>
  );
};

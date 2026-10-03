import { Wind } from 'lucide-react';

export const WindLegend = () => {
  return (
    <div className="bg-[#18232D] border border-[#2B3945] p-3 rounded-xl shadow-lg text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-[#F4F7F9]">
        <div className="flex items-center gap-1.5 text-[#27AE9B]">
          <Wind className="w-3.5 h-3.5 text-[#27AE9B]" />
          <span>Wind Speed (m/s)</span>
        </div>
        <span className="text-[10px] text-[#9AA8B2] font-mono">OpenWeather Layer</span>
      </div>

      {/* Wind Gradient Bar */}
      <div className="w-full h-2 rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 via-amber-400 to-rose-600 border border-[#2B3945]"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
        <span>0 m/s (Calm)</span>
        <span>10 m/s</span>
        <span>25+ m/s (Gale)</span>
      </div>
    </div>
  );
};

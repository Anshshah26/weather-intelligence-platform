import { Gauge } from 'lucide-react';

export const PressureLegend = () => {
  return (
    <div className="bg-[#18232D] border border-[#2B3945] p-3 rounded-xl shadow-lg text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-[#F4F7F9]">
        <div className="flex items-center gap-1.5 text-[#56CCF2]">
          <Gauge className="w-3.5 h-3.5 text-[#56CCF2]" />
          <span>Barometric Pressure (hPa)</span>
        </div>
        <span className="text-[10px] text-[#9AA8B2] font-mono">OpenWeather Layer</span>
      </div>

      {/* Pressure Gradient Bar */}
      <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-700 via-purple-600 via-pink-500 to-amber-500 border border-[#2B3945]"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
        <span>950 hPa (Low)</span>
        <span>1013 hPa</span>
        <span>1070 hPa (High)</span>
      </div>
    </div>
  );
};

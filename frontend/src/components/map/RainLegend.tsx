import { CloudRain } from 'lucide-react';

export const RainLegend = () => {
  return (
    <div className="bg-[#18232D] border border-[#2B3945] p-3 rounded-xl shadow-lg text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-[#F4F7F9]">
        <div className="flex items-center gap-1.5 text-[#56CCF2]">
          <CloudRain className="w-3.5 h-3.5" />
          <span>Precipitation Rate (mm/h)</span>
        </div>
        <span className="text-[10px] text-[#9AA8B2] font-mono">OpenWeather Layer</span>
      </div>

      {/* Rain Spectrum Gradient Bar */}
      <div className="w-full h-2 rounded-full bg-gradient-to-r from-sky-300 via-blue-500 via-indigo-600 via-purple-600 to-pink-600 border border-[#2B3945]"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
        <span>0.1 mm/h (Light)</span>
        <span>10 mm/h</span>
        <span>50+ mm/h (Heavy)</span>
      </div>
    </div>
  );
};

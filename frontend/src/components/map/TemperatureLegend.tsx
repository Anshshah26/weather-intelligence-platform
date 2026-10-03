import { Thermometer } from 'lucide-react';

export const TemperatureLegend = () => {
  return (
    <div className="bg-[#18232D] border border-[#2B3945] p-3 rounded-xl shadow-lg text-left space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-[#F4F7F9]">
        <div className="flex items-center gap-1.5 text-[#F2C94C]">
          <Thermometer className="w-3.5 h-3.5" />
          <span>Global Temperature (°C)</span>
        </div>
        <span className="text-[10px] text-[#9AA8B2] font-mono">OpenWeather Layer</span>
      </div>

      {/* Temperature Spectrum Gradient Bar */}
      <div className="w-full h-2 rounded-full bg-gradient-to-r from-purple-700 via-blue-500 via-cyan-400 via-emerald-400 via-yellow-400 via-orange-500 to-red-600 border border-[#2B3945]"></div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2]">
        <span>-40°C (Cold)</span>
        <span>0°C</span>
        <span>+40°C (Hot)</span>
      </div>
    </div>
  );
};

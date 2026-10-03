import { CloudRain } from 'lucide-react';

export const RadarLegend = () => {
  return (
    <div
      className="bg-[#18232D] border border-[#2B3945] p-3 rounded-xl shadow-xl text-left space-y-2 max-w-xs w-full"
      role="region"
      aria-label="Precipitation Radar Scale Legend"
    >
      <div className="flex items-center justify-between text-xs font-semibold text-[#F4F7F9]">
        <div className="flex items-center gap-1.5 text-[#56CCF2]">
          <CloudRain className="w-3.5 h-3.5" />
          <span>Radar Reflectivity</span>
        </div>
        <span className="text-[10px] text-[#9AA8B2] font-mono">dBZ Scale</span>
      </div>

      {/* Discrete 4-Segment Meteorological Radar Scale */}
      <div className="grid grid-cols-4 gap-1 w-full">
        <div className="h-2 rounded-l bg-[#56CCF2]" title="Light Rain" />
        <div className="h-2 bg-[#2F80ED]" title="Moderate Rain" />
        <div className="h-2 bg-[#F2994A]" title="Heavy Rain" />
        <div className="h-2 rounded-r bg-[#EB5757]" title="Severe" />
      </div>

      {/* Clearly Readable Radar Category Labels */}
      <div className="grid grid-cols-4 text-[10px] font-mono text-[#9AA8B2] text-center leading-tight">
        <span>Light Rain</span>
        <span>Moderate Rain</span>
        <span>Heavy Rain</span>
        <span className="text-[#EB5757] font-semibold">Severe</span>
      </div>
    </div>
  );
};

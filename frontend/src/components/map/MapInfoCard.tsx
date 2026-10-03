import { MapPin, Navigation, Thermometer } from 'lucide-react';

interface MapInfoCardProps {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature?: number;
  condition?: string;
}

export const MapInfoCard = ({
  city,
  country,
  latitude,
  longitude,
  temperature,
  condition,
}: MapInfoCardProps) => {
  return (
    <div className="bg-[#18232D] border border-[#2B3945] p-3.5 rounded-xl shadow-lg max-w-xs w-full text-left space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#56CCF2] font-mono">
          <MapPin className="w-3.5 h-3.5 text-[#2F80ED]" />
          <span>Focused Position</span>
        </div>
        <span className="text-[10px] bg-[#101820] border border-[#2B3945] text-[#27AE9B] px-2 py-0.5 rounded font-mono font-medium">
          Telemetry
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold text-[#F4F7F9] leading-tight">
          {city}{country ? `, ${country}` : ''}
        </h3>
        <div className="flex items-center gap-3 text-xs text-[#9AA8B2] mt-1 font-mono">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#9AA8B2]" />
            Lat: {latitude.toFixed(3)}°
          </span>
          <span>Lon: {longitude.toFixed(3)}°</span>
        </div>
      </div>

      {temperature !== undefined && (
        <div className="pt-2 border-t border-[#2B3945] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#9AA8B2]">
            <Thermometer className="w-3.5 h-3.5 text-[#F2C94C]" />
            <span>Observed</span>
          </div>
          <div className="text-right">
            <span className="text-base font-bold text-[#F4F7F9] font-mono">{Math.round(temperature)}°C</span>
            {condition && <span className="text-[11px] text-[#9AA8B2] block capitalize">{condition}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

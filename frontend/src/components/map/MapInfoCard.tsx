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
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl max-w-xs w-full text-left space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 font-mono">
          <MapPin className="w-3.5 h-3.5" />
          <span>Selected Location</span>
        </div>
        <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
          Live Telemetry
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-100 leading-tight">
          {city}{country ? `, ${country}` : ''}
        </h3>
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3 text-slate-500" />
            Lat: {latitude.toFixed(4)}°
          </span>
          <span>Lon: {longitude.toFixed(4)}°</span>
        </div>
      </div>

      {temperature !== undefined && (
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>Temperature</span>
          </div>
          <div className="text-right">
            <span className="text-base font-bold text-slate-100">{Math.round(temperature)}°C</span>
            {condition && <span className="text-[11px] text-slate-400 block capitalize">{condition}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

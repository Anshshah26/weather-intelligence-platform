import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface LocationMarkerProps {
  position: [number, number];
  city: string;
  country: string;
  temperature?: number;
  condition?: string;
  isGPSLocation?: boolean;
}

// Custom Leaflet SVG DivIcon with cyan glowing marker pin
const createCustomPinIcon = (isGPS: boolean) => {
  const bgGradient = isGPS
    ? 'linear-gradient(135deg, #10b981, #06b6d4)'
    : 'linear-gradient(135deg, #06b6d4, #2563eb)';
  const shadowColor = isGPS ? 'rgba(16, 185, 129, 0.8)' : 'rgba(6, 182, 212, 0.8)';
  const pingColor = isGPS ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.25)';

  return L.divIcon({
    className: 'custom-map-pin-container',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 36px;
          height: 36px;
          background-color: ${pingColor};
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 20px;
          height: 20px;
          background: ${bgGradient};
          border: 2.5px solid #0f172a;
          border-radius: 50%;
          box-shadow: 0 0 15px ${shadowColor};
          z-index: 10;
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const customPinIcon = createCustomPinIcon(false);
const gpsPinIcon = createCustomPinIcon(true);

export const LocationMarker = ({
  position,
  city,
  country,
  temperature,
  condition,
  isGPSLocation = false,
}: LocationMarkerProps) => {
  return (
    <Marker position={position} icon={isGPSLocation ? gpsPinIcon : customPinIcon}>
      <Popup className="custom-leaflet-popup">
        <div className="p-1 text-left">
          {isGPSLocation && (
            <div className="text-[10px] font-bold tracking-wider uppercase text-cyan-400 mb-0.5 flex items-center gap-1">
              <span>📍 You are here</span>
            </div>
          )}
          <div className="text-xs font-bold text-slate-100">{city}{country ? `, ${country}` : ''}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {position[0].toFixed(2)}°, {position[1].toFixed(2)}°
          </div>
          {temperature !== undefined && (
            <div className="mt-1 pt-1 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-cyan-400">{Math.round(temperature)}°C</span>
              {condition && <span className="text-slate-300 capitalize text-[10px]">{condition}</span>}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

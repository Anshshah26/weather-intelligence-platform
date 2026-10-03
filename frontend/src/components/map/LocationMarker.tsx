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

// Professional Meteorological Station Map Marker Pin
const createCustomPinIcon = (isGPS: boolean) => {
  const pinColor = isGPS ? '#27AE9B' : '#2F80ED';
  const pulseColor = isGPS ? 'rgba(39, 174, 155, 0.25)' : 'rgba(47, 128, 237, 0.25)';

  return L.divIcon({
    className: 'custom-map-pin-container',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          background-color: ${pulseColor};
          border-radius: 50%;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 18px;
          height: 18px;
          background: ${pinColor};
          border: 2px solid #101820;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 6px; height: 6px; background: #FFFFFF; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
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
            <div className="text-[10px] font-bold tracking-wider uppercase text-[#27AE9B] mb-0.5 flex items-center gap-1 font-mono">
              <span>GPS Telemetry</span>
            </div>
          )}
          <div className="text-xs font-bold text-[#F4F7F9]">{city}{country ? `, ${country}` : ''}</div>
          <div className="text-[11px] text-[#9AA8B2] font-mono mt-0.5">
            {position[0].toFixed(3)}°, {position[1].toFixed(3)}°
          </div>
          {temperature !== undefined && (
            <div className="mt-1 pt-1 border-t border-[#2B3945] flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold font-mono text-[#56CCF2]">{Math.round(temperature)}°C</span>
              {condition && <span className="text-[#9AA8B2] capitalize text-[10px]">{condition}</span>}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

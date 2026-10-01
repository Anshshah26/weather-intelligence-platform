import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LocationMarker } from '../map/LocationMarker';
import { Info } from 'lucide-react';

interface RadarMapProps {
  center: [number, number];
  zoom?: number;
  city: string;
  country: string;
  temperature?: number;
  condition?: string;
  radarTileUrl?: string;
  isAvailable?: boolean;
  opacity?: number;
}

// Internal camera navigation helper
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);

  return null;
}

// Helper component to invalidate Leaflet map size on viewport resize
function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [map]);

  return null;
}

export const RadarMap = ({
  center,
  zoom = 6,
  city,
  country,
  temperature,
  condition,
  radarTileUrl,
  isAvailable = false,
  opacity = 0.65,
}: RadarMapProps) => {
  return (
    <div className="w-full h-[65vh] sm:h-full min-h-[360px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Provider Status Overlay Banner if radar frames unavailable */}
      {!isAvailable && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/95 border border-slate-800 text-slate-300 text-xs font-mono shadow-2xl backdrop-blur-md pointer-events-none max-w-[90%] text-center">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Advanced global radar is not enabled for this weather account. Base map active.</span>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        zoomControl={true}
      >
        <MapViewController center={center} zoom={zoom} />
        <MapResizeHandler />

        {/* CartoDB Dark Matter Base Map */}
        {(() => {
          const cartoKey = (
            import.meta.env.VITE_CARTO_API_KEY ||
            import.meta.env.VITE_CARTO_BASEMAP_KEY ||
            import.meta.env.CARTO_BASEMAP_KEY ||
            ''
          ).trim();

          if (!cartoKey) {
            console.warn('CARTO basemap API key is not configured.');
          }

          const tileUrl = cartoKey
            ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`
            : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

          return (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={tileUrl}
              maxZoom={19}
            />
          );
        })()}

        {/* Active Timestamped Radar Tile Overlay (When Available) */}
        {isAvailable && radarTileUrl && (
          <TileLayer
            url={radarTileUrl}
            opacity={opacity}
            maxZoom={18}
            zIndex={10}
          />
        )}

        {/* Selected Location Marker */}
        <LocationMarker
          position={center}
          city={city}
          country={country}
          temperature={temperature}
          condition={condition}
        />
      </MapContainer>
    </div>
  );
};

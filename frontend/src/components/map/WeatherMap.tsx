import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { LocationMarker } from './LocationMarker';
import { TemperatureLayer } from './TemperatureLayer';
import { RainLayer } from './RainLayer';
import { CloudsLayer } from './CloudsLayer';
import { WindLayer } from './WindLayer';
import { PressureLayer } from './PressureLayer';
import { ActiveLayersState } from './MapControls';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface WeatherMapProps {
  center: [number, number];
  zoom?: number;
  city: string;
  country: string;
  temperature?: number;
  condition?: string;
  activeLayers: ActiveLayersState;
  opacity?: number;
  isGPSLocation?: boolean;
}

// Helper component to listen to tile loading events non-intrusively
function MapTileEventListener({
  onLoadingChange,
  onErrorChange,
}: {
  onLoadingChange: (isLoading: boolean) => void;
  onErrorChange: (hasError: boolean) => void;
}) {
  const [loadingTiles, setLoadingTiles] = useState<number>(0);

  useMapEvents({
    tileloadstart() {
      setLoadingTiles((prev) => {
        const next = prev + 1;
        onLoadingChange(next > 0);
        return next;
      });
    },
    tileload() {
      setLoadingTiles((prev) => {
        const next = Math.max(0, prev - 1);
        onLoadingChange(next > 0);
        return next;
      });
    },
    tileerror() {
      setLoadingTiles((prev) => {
        const next = Math.max(0, prev - 1);
        onLoadingChange(next > 0);
        return next;
      });
      onErrorChange(true);
      // Auto dismiss error badge after 4 seconds
      setTimeout(() => onErrorChange(false), 4000);
    },
    load() {
      setLoadingTiles(0);
      onLoadingChange(false);
    },
  });

  return null;
}

// Helper component to handle smooth camera panning when center changes
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

export const WeatherMap = ({
  center,
  zoom = 6,
  city,
  country,
  temperature,
  condition,
  activeLayers,
  opacity = 0.65,
  isGPSLocation = false,
}: WeatherMapProps) => {
  const [isTileLoading, setIsTileLoading] = useState<boolean>(false);
  const [tileError, setTileError] = useState<boolean>(false);

  return (
    <div className="w-full h-[65vh] sm:h-full min-h-[360px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Tile Loading Indicator Toast (Top Right Overlay) */}
      {isTileLoading && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md text-cyan-300 text-xs shadow-lg font-mono animate-fade-in pointer-events-none">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>Syncing weather tiles...</span>
        </div>
      )}

      {/* Tile Load Error Toast */}
      {tileError && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/90 border border-amber-800/80 backdrop-blur-md text-amber-300 text-xs shadow-lg font-mono pointer-events-none">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Weather layer tile delayed. Retrying...</span>
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
        <MapTileEventListener
          onLoadingChange={setIsTileLoading}
          onErrorChange={setTileError}
        />

        {/* CartoDB Dark Matter Base Tiles */}
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

        {/* Real Temperature Tile Overlay Layer */}
        {activeLayers.temp && <TemperatureLayer opacity={opacity} />}

        {/* Real Rain/Precipitation Tile Overlay Layer */}
        {activeLayers.rain && <RainLayer opacity={opacity} />}

        {/* Real Clouds Tile Overlay Layer */}
        {activeLayers.clouds && <CloudsLayer opacity={opacity} />}

        {/* Real Wind Tile Overlay Layer */}
        {activeLayers.wind && <WindLayer opacity={opacity} />}

        {/* Real Pressure Tile Overlay Layer */}
        {activeLayers.pressure && <PressureLayer opacity={opacity} />}

        {/* Selected City / GPS Location Marker */}
        <LocationMarker
          position={center}
          city={city}
          country={country}
          temperature={temperature}
          condition={condition}
          isGPSLocation={isGPSLocation}
        />
      </MapContainer>
    </div>
  );
};

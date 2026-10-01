import { TileLayer } from 'react-leaflet';

interface WindLayerProps {
  opacity?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const WindLayer = ({ opacity = 0.65 }: WindLayerProps) => {
  const tileUrl = `${API_BASE_URL}/api/weather/tiles/wind_new/{z}/{x}/{y}.png`;

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      maxZoom={18}
      zIndex={8}
    />
  );
};

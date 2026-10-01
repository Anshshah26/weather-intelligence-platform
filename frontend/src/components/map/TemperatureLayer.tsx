import { TileLayer } from 'react-leaflet';

interface TemperatureLayerProps {
  opacity?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const TemperatureLayer = ({ opacity = 0.65 }: TemperatureLayerProps) => {
  const tileUrl = `${API_BASE_URL}/api/weather/tiles/temp_new/{z}/{x}/{y}.png`;

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      maxZoom={18}
      zIndex={5}
    />
  );
};

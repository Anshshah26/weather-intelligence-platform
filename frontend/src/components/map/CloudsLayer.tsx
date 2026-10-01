import { TileLayer } from 'react-leaflet';

interface CloudsLayerProps {
  opacity?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const CloudsLayer = ({ opacity = 0.65 }: CloudsLayerProps) => {
  const tileUrl = `${API_BASE_URL}/api/weather/tiles/clouds_new/{z}/{x}/{y}.png`;

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      maxZoom={18}
      zIndex={7}
    />
  );
};

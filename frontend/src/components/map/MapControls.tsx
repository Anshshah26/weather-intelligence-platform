import { ComponentType } from 'react';
import { Thermometer, CloudRain, Cloud, Wind, Gauge, Compass, Maximize, Minimize, Sliders } from 'lucide-react';

export type WeatherLayerType = 'temp' | 'rain' | 'clouds' | 'wind' | 'pressure';

export interface ActiveLayersState {
  temp: boolean;
  rain: boolean;
  clouds: boolean;
  wind: boolean;
  pressure: boolean;
}

interface MapControlsProps {
  activeLayers: ActiveLayersState;
  opacity: number;
  onChangeOpacity: (opacity: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleLayer: (layer: WeatherLayerType) => void;
  onResetView: () => void;
}

export const MapControls = ({
  activeLayers,
  opacity,
  onChangeOpacity,
  isFullscreen,
  onToggleFullscreen,
  onToggleLayer,
  onResetView,
}: MapControlsProps) => {
  const layers: {
    id: WeatherLayerType;
    label: string;
    emoji: string;
    icon: ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    { id: 'temp', label: 'Temperature', emoji: '🌡️', icon: Thermometer, accentColor: 'text-[#F2C94C] border-[#F2C94C]' },
    { id: 'rain', label: 'Rain', emoji: '🌧️', icon: CloudRain, accentColor: 'text-[#56CCF2] border-[#2F80ED]' },
    { id: 'clouds', label: 'Clouds', emoji: '☁️', icon: Cloud, accentColor: 'text-[#F4F7F9] border-[#9AA8B2]' },
    { id: 'wind', label: 'Wind', emoji: '💨', icon: Wind, accentColor: 'text-[#27AE9B] border-[#27AE9B]' },
    { id: 'pressure', label: 'Pressure', emoji: '🧭', icon: Gauge, accentColor: 'text-[#56CCF2] border-[#3A4A57]' },
  ];

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2.5 bg-[#18232D] border border-[#2B3945] p-2.5 rounded-xl shadow-sm text-[#F4F7F9]"
      role="toolbar"
      aria-label="Weather Map Control Toolbar"
    >
      {/* Weather Layer Toggles Group */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full no-scrollbar pb-1 sm:pb-0" role="group" aria-label="Weather Overlay Layers">
        <span className="text-[11px] font-mono text-[#9AA8B2] uppercase tracking-wider px-2 border-r border-[#2B3945] hidden md:inline shrink-0">
          Layers
        </span>

        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayers[layer.id];

          return (
            <button
              key={layer.id}
              onClick={() => onToggleLayer(layer.id)}
              aria-pressed={isActive}
              title={`Toggle ${layer.label} layer`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? `bg-[#24313C] border-2 ${layer.accentColor} text-[#F4F7F9] shadow-sm font-semibold`
                  : 'bg-[#101820] border border-[#2B3945] text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C]'
              }`}
            >
              <span className="text-xs">{layer.emoji}</span>
              <Icon className="w-3.5 h-3.5 hidden sm:inline" />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>

      {/* Auxiliary Controls: Opacity Slider, Reset, Fullscreen */}
      <div className="flex items-center gap-2.5 ml-auto shrink-0">
        {/* Opacity Control Slider */}
        <div className="flex items-center gap-2 bg-[#101820] border border-[#2B3945] px-2.5 py-1.5 rounded-lg">
          <Sliders className="w-3.5 h-3.5 text-[#56CCF2] shrink-0" />
          <label htmlFor="map-opacity-slider" className="text-[11px] font-mono text-[#9AA8B2] hidden sm:inline">
            Opacity
          </label>
          <input
            id="map-opacity-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(opacity * 100)}
            onChange={(e) => onChangeOpacity(Number(e.target.value) / 100)}
            aria-label="Weather overlay opacity slider"
            className="w-16 sm:w-20 accent-[#2F80ED] h-1 bg-[#24313C] rounded-lg cursor-pointer"
            title={`Overlay Opacity: ${Math.round(opacity * 100)}%`}
          />
          <span className="text-[11px] font-mono text-[#56CCF2] min-w-[2.5rem] text-right font-medium">
            {Math.round(opacity * 100)}%
          </span>
        </div>

        {/* Fit World / Reset Map View Button */}
        <button
          onClick={onResetView}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#101820] border border-[#2B3945] text-[#F4F7F9] hover:bg-[#24313C] hover:border-[#3A4A57] transition-colors"
          title="Reset Map to World View"
          aria-label="Reset map view to global extent"
        >
          <Compass className="w-3.5 h-3.5 text-[#56CCF2]" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Fullscreen Map Toggle Button */}
        <button
          onClick={onToggleFullscreen}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#101820] border border-[#2B3945] text-[#F4F7F9] hover:bg-[#24313C] hover:border-[#3A4A57] transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label={isFullscreen ? 'Exit map fullscreen mode' : 'Enter map fullscreen mode'}
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-[#56CCF2]" /> : <Maximize className="w-3.5 h-3.5 text-[#56CCF2]" />}
          <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
        </button>
      </div>
    </div>
  );
};

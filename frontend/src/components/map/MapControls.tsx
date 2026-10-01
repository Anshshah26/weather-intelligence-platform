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
    activeColor: string;
  }[] = [
    { id: 'temp', label: 'Temperature', emoji: '🌡️', icon: Thermometer, activeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300' },
    { id: 'rain', label: 'Rain', emoji: '🌧️', icon: CloudRain, activeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
    { id: 'clouds', label: 'Clouds', emoji: '☁️', icon: Cloud, activeColor: 'bg-slate-500/20 border-slate-400/40 text-slate-200' },
    { id: 'wind', label: 'Wind', emoji: '💨', icon: Wind, activeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-300' },
    { id: 'pressure', label: 'Pressure', emoji: '🧭', icon: Gauge, activeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
  ];

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-xl text-slate-200"
      role="toolbar"
      aria-label="Weather Map Control Toolbar"
    >
      {/* Weather Layer Toggles Group */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full no-scrollbar pb-1 sm:pb-0" role="group" aria-label="Weather Overlay Layers">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2 border-r border-slate-800 hidden md:inline shrink-0">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                isActive
                  ? `${layer.activeColor} border shadow-sm ring-1 ring-cyan-500/30`
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
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
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {/* Opacity Control Slider */}
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <label htmlFor="map-opacity-slider" className="text-[11px] font-mono text-slate-400 hidden sm:inline">
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
            className="w-16 sm:w-20 accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500"
            title={`Overlay Opacity: ${Math.round(opacity * 100)}%`}
          />
          <span className="text-[11px] font-mono text-cyan-300 min-w-[2.5rem] text-right font-semibold">
            {Math.round(opacity * 100)}%
          </span>
        </div>

        {/* Fit World / Reset Map View Button */}
        <button
          onClick={onResetView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          title="Reset Map to World View"
          aria-label="Reset map view to global extent"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Reset View</span>
        </button>

        {/* Fullscreen Map Toggle Button */}
        <button
          onClick={onToggleFullscreen}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label={isFullscreen ? 'Exit map fullscreen mode' : 'Enter map fullscreen mode'}
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize className="w-3.5 h-3.5 text-cyan-400" />}
          <span className="hidden md:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
        </button>
      </div>
    </div>
  );
};

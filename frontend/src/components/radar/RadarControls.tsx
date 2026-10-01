import { Play, Pause, SkipBack, SkipForward, Clock, Sliders } from 'lucide-react';

interface RadarControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevFrame: () => void;
  onNextFrame: () => void;
  currentDisplayTime: string;
  opacity: number;
  onChangeOpacity: (opacity: number) => void;
  disabled?: boolean;
}

export const RadarControls = ({
  isPlaying,
  onTogglePlay,
  onPrevFrame,
  onNextFrame,
  currentDisplayTime,
  opacity,
  onChangeOpacity,
  disabled = false,
}: RadarControlsProps) => {
  return (
    <div
      className="flex items-center justify-between gap-2.5 sm:gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl shadow-xl text-slate-200 overflow-x-auto max-w-full no-scrollbar pb-1 sm:pb-0"
      role="toolbar"
      aria-label="Radar Playback Controls"
    >
      {/* Frame Playback Buttons */}
      <div className="flex items-center gap-1.5" role="group" aria-label="Playback Navigation">
        <button
          onClick={onPrevFrame}
          disabled={disabled}
          aria-label="Previous radar frame"
          title={disabled ? 'Radar frames unavailable' : 'Previous radar frame'}
          className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePlay}
          disabled={disabled}
          aria-label={isPlaying ? 'Pause radar playback' : 'Play radar playback'}
          title={disabled ? 'Radar playback unavailable' : isPlaying ? 'Pause' : 'Play'}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold text-xs hover:bg-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-cyan-300" /> : <Play className="w-4 h-4 fill-cyan-300 ml-0.5" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={onNextFrame}
          disabled={disabled}
          aria-label="Next radar frame"
          title={disabled ? 'Radar frames unavailable' : 'Next radar frame'}
          className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Opacity Control Slider */}
      <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
        <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <label htmlFor="radar-opacity-slider" className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Opacity
        </label>
        <input
          id="radar-opacity-slider"
          type="range"
          min="0"
          max="100"
          step="5"
          value={Math.round(opacity * 100)}
          onChange={(e) => onChangeOpacity(Number(e.target.value) / 100)}
          aria-label="Radar overlay opacity slider"
          className="w-16 sm:w-20 accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500"
          title={`Radar Opacity: ${Math.round(opacity * 100)}%`}
        />
        <span className="text-[11px] font-mono text-cyan-300 min-w-[2.5rem] text-right font-semibold">
          {Math.round(opacity * 100)}%
        </span>
      </div>

      {/* Selected Radar Frame Timestamp Display */}
      <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-slate-300">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>Radar time: <strong className="text-cyan-300 font-bold">{currentDisplayTime}</strong></span>
      </div>
    </div>
  );
};

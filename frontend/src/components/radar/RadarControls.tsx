import { Play, Pause, SkipBack, SkipForward, Clock, Sliders } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  return (
    <div
      className="flex items-center justify-between gap-2.5 sm:gap-3 bg-[#18232D] border border-[#2B3945] p-2.5 rounded-xl shadow-sm text-[#F4F7F9] overflow-x-auto max-w-full no-scrollbar pb-1 sm:pb-0"
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
          className="p-2 rounded-lg bg-[#101820] border border-[#2B3945] text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePlay}
          disabled={disabled}
          aria-label={isPlaying ? 'Pause radar playback' : 'Play radar playback'}
          title={disabled ? 'Radar playback unavailable' : isPlaying ? t('pause', 'Pause') : t('play', 'Play')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F80ED] hover:bg-[#2570d4] text-white font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          <span>{isPlaying ? t('pause', 'Pause') : t('play', 'Play')}</span>
        </button>

        <button
          onClick={onNextFrame}
          disabled={disabled}
          aria-label="Next radar frame"
          title={disabled ? 'Radar frames unavailable' : 'Next radar frame'}
          className="p-2 rounded-lg bg-[#101820] border border-[#2B3945] text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Opacity Control Slider */}
      <div className="flex items-center gap-2 bg-[#101820] border border-[#2B3945] px-2.5 py-1.5 rounded-lg">
        <Sliders className="w-3.5 h-3.5 text-[#56CCF2] shrink-0" />
        <label htmlFor="radar-opacity-slider" className="text-[11px] font-mono text-[#9AA8B2] hidden sm:inline">
          {t('opacity', 'Opacity')}
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
          className="w-16 sm:w-20 accent-[#2F80ED] h-1 bg-[#24313C] rounded-lg cursor-pointer"
          title={`Radar Opacity: ${Math.round(opacity * 100)}%`}
        />
        <span className="text-[11px] font-mono text-[#56CCF2] min-w-[2.5rem] text-right font-medium">
          {Math.round(opacity * 100)}%
        </span>
      </div>

      {/* Selected Radar Frame Timestamp Display */}
      <div className="flex items-center gap-2 bg-[#101820] border border-[#2B3945] px-3 py-1.5 rounded-lg font-mono text-xs text-[#F4F7F9]">
        <Clock className="w-3.5 h-3.5 text-[#56CCF2]" />
        <span>{t('radar', 'Radar')}: <strong className="text-[#56CCF2] font-semibold">{currentDisplayTime}</strong></span>
      </div>
    </div>
  );
};

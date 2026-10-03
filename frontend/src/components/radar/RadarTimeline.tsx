import { RadarFrame } from '../../types/weather';

interface RadarTimelineProps {
  frames: RadarFrame[];
  selectedIndex: number;
  onSelectFrame: (index: number) => void;
  disabled?: boolean;
}

export const RadarTimeline = ({
  frames,
  selectedIndex,
  onSelectFrame,
  disabled = false,
}: RadarTimelineProps) => {
  const defaultTimes = ['-60m', '-30m', 'NOW', '+30m', '+60m'];

  return (
    <div
      className="bg-[#18232D] border border-[#2B3945] p-3 rounded-xl shadow-sm space-y-2 text-[#F4F7F9] overflow-x-auto max-w-full no-scrollbar"
      role="region"
      aria-label="Radar Timeline Navigation"
    >
      {/* Timeline Phase Labels */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA8B2] uppercase tracking-wider px-1">
        <span className="text-[#56CCF2] font-medium">Past Slots</span>
        <span className="text-[#2F80ED] font-semibold px-2 py-0.5 bg-[#2F80ED]/10 rounded border border-[#2F80ED]/30">
          Live / Observation
        </span>
        <span className="text-[#27AE9B] font-medium">Forward Projection</span>
      </div>

      {/* Interactive Time Track Buttons */}
      <div className="grid grid-cols-5 gap-1.5" role="group" aria-label="Radar Time Slots">
        {frames.length > 0
          ? frames.map((frame, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={frame.timestamp}
                  onClick={() => !disabled && onSelectFrame(index)}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  title={`Select radar timestamp ${frame.displayTime}`}
                  className={`py-1.5 px-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#24313C] border-2 border-[#2F80ED] text-[#F4F7F9] shadow-sm'
                      : disabled
                      ? 'bg-[#101820]/40 border border-[#2B3945]/40 text-[#9AA8B2]/40 cursor-not-allowed'
                      : 'bg-[#101820] border border-[#2B3945] text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C]'
                  }`}
                >
                  {frame.displayTime}
                </button>
              );
            })
          : defaultTimes.map((label, index) => {
              const isNow = label === 'NOW';
              return (
                <button
                  key={label}
                  onClick={() => !disabled && onSelectFrame(index)}
                  disabled={disabled}
                  aria-pressed={isNow}
                  title={disabled ? 'Radar timestamps unavailable' : `Select frame ${label}`}
                  className={`py-1.5 px-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                    isNow
                      ? 'bg-[#24313C] border-2 border-[#2F80ED] text-[#56CCF2]'
                      : 'bg-[#101820]/40 border border-[#2B3945]/40 text-[#9AA8B2]/40 cursor-not-allowed'
                  }`}
                >
                  {label}
                </button>
              );
            })}
      </div>
    </div>
  );
};

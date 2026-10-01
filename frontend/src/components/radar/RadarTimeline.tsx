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
  // If no dynamic frames are provided yet, render a fallback dynamic timeline representation
  const defaultTimes = ['-60m', '-30m', 'NOW', '+30m', '+60m'];

  return (
    <div
      className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl space-y-2 text-slate-200 overflow-x-auto max-w-full no-scrollbar"
      role="region"
      aria-label="Radar Timeline Navigation"
    >
      {/* Timeline Phase Labels */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1">
        <span className="text-blue-400 font-semibold">PAST</span>
        <span className="text-cyan-400 font-bold px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/30">
          LIVE / NOW
        </span>
        <span className="text-indigo-400 font-semibold">FORECAST</span>
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
                  className={`py-1.5 px-1 rounded-xl text-xs font-mono font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-md ring-1 ring-cyan-500/30'
                      : disabled
                      ? 'bg-slate-950/40 border border-slate-800/40 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
                  className={`py-1.5 px-1 rounded-xl text-xs font-mono font-semibold transition-all ${
                    isNow
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-950/40 border border-slate-800/40 text-slate-600 cursor-not-allowed'
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

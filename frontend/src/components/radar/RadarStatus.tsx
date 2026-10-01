import { Activity, AlertTriangle } from 'lucide-react';

interface RadarStatusProps {
  available: boolean;
  provider: string;
  message?: string;
}

export const RadarStatus = ({ available, provider, message }: RadarStatusProps) => {
  return (
    <div
      className="flex items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-2xl shadow-xl text-xs"
      role="status"
      aria-label="Weather Radar Connectivity Status"
    >
      <div className="flex items-center gap-2 font-mono">
        <span className="text-slate-400">Radar Status:</span>
        {available ? (
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live ({provider})
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Unavailable
          </span>
        )}
      </div>

      {!available && message && (
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-amber-300/80 font-mono border-l border-slate-800 pl-3">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate max-w-md">{message}</span>
        </div>
      )}
    </div>
  );
};

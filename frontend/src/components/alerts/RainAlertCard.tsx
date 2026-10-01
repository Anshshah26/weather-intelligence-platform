import { RainAlertData } from '../../types/weather';
import { Umbrella, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';

interface RainAlertCardProps {
  alert: RainAlertData;
}

export const RainAlertCard = ({ alert }: RainAlertCardProps) => {
  return (
    <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Warning Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Alert Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{alert.title}</span>
          </div>
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold uppercase tracking-wider rounded-md">
            Advisory
          </span>
        </div>

        {/* Primary Alert Message */}
        <h3 className="text-lg font-bold text-slate-100 mb-2">
          {alert.message}
        </h3>

        {/* Details & Time Expectation */}
        <div className="flex items-center gap-2 text-xs text-amber-300/80 mb-4 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{alert.probabilityIncreaseTime}</span>
        </div>
      </div>

      {/* Recommendation Action Pill */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-200">
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
            <Umbrella className="w-4 h-4" />
          </div>
          <span className="font-medium">{alert.recommendation}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Advisory</span>
        </div>
      </div>
    </div>
  );
};

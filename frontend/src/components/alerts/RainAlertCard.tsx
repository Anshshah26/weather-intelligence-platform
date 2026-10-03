import { RainAlertData } from '../../types/weather';
import { Umbrella, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';

interface RainAlertCardProps {
  alert: RainAlertData;
}

export const RainAlertCard = ({ alert }: RainAlertCardProps) => {
  return (
    <div className="bg-[#18232D] border border-[#2B3945] border-l-4 border-l-[#F2994A] rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
      {/* Alert Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[#F2994A] font-semibold text-xs sm:text-sm font-mono">
            <AlertTriangle className="w-4 h-4 text-[#F2994A] shrink-0" />
            <span>{alert.title}</span>
          </div>
          <span className="px-2 py-0.5 bg-[#F2994A]/10 border border-[#F2994A]/30 text-[#F2994A] text-[10px] font-semibold uppercase tracking-wider rounded">
            Advisory
          </span>
        </div>

        {/* Primary Alert Message */}
        <h3 className="text-base font-bold text-[#F4F7F9] mb-2">
          {alert.message}
        </h3>

        {/* Details & Time Expectation */}
        <div className="flex items-center gap-2 text-xs text-[#9AA8B2] mb-3 bg-[#24313C] p-2.5 rounded-lg border border-[#2B3945] font-mono">
          <Clock className="w-3.5 h-3.5 text-[#F2994A] shrink-0" />
          <span>{alert.probabilityIncreaseTime}</span>
        </div>
      </div>

      {/* Recommendation Action Pill */}
      <div className="pt-3 border-t border-[#2B3945] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#F4F7F9]">
          <div className="p-1.5 bg-[#24313C] border border-[#2B3945] rounded text-[#56CCF2]">
            <Umbrella className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium">{alert.recommendation}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#9AA8B2] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#27AE9B]" />
          <span>Live Station Advisory</span>
        </div>
      </div>
    </div>
  );
};

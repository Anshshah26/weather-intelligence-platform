import { WeatherSummaryData } from '../../types/weather';
import { FileText, CheckCircle2 } from 'lucide-react';

interface WeatherSummaryCardProps {
  summary: WeatherSummaryData;
}

export const WeatherSummaryCard = ({ summary }: WeatherSummaryCardProps) => {
  return (
    <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-[#9AA8B2] text-xs font-mono mb-3">
          <FileText className="w-4 h-4 text-[#2F80ED]" />
          <span>{summary.title}</span>
        </div>

        <h3 className="text-base font-bold text-[#F4F7F9] mb-2 leading-snug">
          {summary.headline}
        </h3>

        <p className="text-xs text-[#9AA8B2] leading-relaxed mb-4">
          {summary.description}
        </p>
      </div>

      <div className="pt-4 border-t border-[#2B3945] space-y-2">
        <span className="text-[10px] font-mono text-[#9AA8B2] block uppercase tracking-wider">
          Key Meteorological Observations
        </span>
        {summary.highlights.map((highlight, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-[#F4F7F9] bg-[#24313C] p-2 rounded border border-[#2B3945]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE9B] shrink-0 mt-0.5" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

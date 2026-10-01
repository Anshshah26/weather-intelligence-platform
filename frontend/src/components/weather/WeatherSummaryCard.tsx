import { WeatherSummaryData } from '../../types/weather';
import { FileText, CheckCircle2 } from 'lucide-react';

interface WeatherSummaryCardProps {
  summary: WeatherSummaryData;
}

export const WeatherSummaryCard = ({ summary }: WeatherSummaryCardProps) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>{summary.title}</span>
        </div>

        <h3 className="text-base font-bold text-slate-100 mb-2 leading-snug">
          {summary.headline}
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {summary.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
          Key Meteorological Takeaways
        </span>
        {summary.highlights.map((highlight, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

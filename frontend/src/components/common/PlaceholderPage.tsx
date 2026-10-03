import { LucideIcon, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  phase?: string;
}

export const PlaceholderPage = ({
  title,
  description,
  icon: Icon,
  phase = 'Module Roadmap Integration',
}: PlaceholderPageProps) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center text-center">
      {/* Icon Badge */}
      <div className="p-4 bg-[#18232D] border border-[#2B3945] rounded-xl text-[#2F80ED] mb-5 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>

      {/* Development Phase Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#24313C] border border-[#2B3945] text-[#56CCF2] text-xs font-mono mb-4">
        <Sparkles className="w-3.5 h-3.5 text-[#2F80ED]" />
        <span>{phase}</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F7F9] tracking-tight mb-2">
        {title}
      </h1>

      <p className="text-sm text-[#9AA8B2] max-w-lg mb-8 leading-relaxed">
        {description}
      </p>

      {/* Feature Card Preview Box */}
      <div className="w-full max-w-md bg-[#18232D] border border-[#2B3945] rounded-xl p-5 text-left mb-6 space-y-2.5">
        <div className="text-[11px] font-semibold text-[#9AA8B2] uppercase tracking-wider font-mono">
          Module Capabilities Preview
        </div>
        <div className="flex items-center gap-2 text-xs text-[#F4F7F9]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F80ED]"></span>
          <span>Real-time data synchronization pipeline</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#F4F7F9]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#27AE9B]"></span>
          <span>Interactive spatial & atmospheric visualization</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#F4F7F9]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#56CCF2]"></span>
          <span>Contextual meteorological analysis</span>
        </div>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#24313C] border border-[#2B3945] hover:border-[#3A4A57] text-[#F4F7F9] hover:text-white text-xs font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

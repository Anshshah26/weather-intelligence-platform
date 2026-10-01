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
  phase = 'Phase 3 & 4 Development Roadmap',
}: PlaceholderPageProps) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center text-center">
      {/* Icon Badge */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-cyan-400 mb-6 shadow-xl relative">
        <Icon className="w-10 h-10" />
        <span className="w-3 h-3 rounded-full bg-cyan-400 absolute -top-1 -right-1 ring-4 ring-slate-950 animate-ping"></span>
      </div>

      {/* Development Phase Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{phase}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-3">
        {title}
      </h1>

      <p className="text-sm sm:text-base text-slate-400 max-w-lg mb-8 leading-relaxed">
        {description}
      </p>

      {/* Feature Card Preview Box */}
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-left mb-8 space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Module Capabilities Preview
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Real-time data synchronization pipeline</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Interactive spatial & atmospheric visualization</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Granular AI-driven advisory analytics</span>
        </div>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 text-xs font-semibold transition-all shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Primary Dashboard
      </Link>
    </div>
  );
};

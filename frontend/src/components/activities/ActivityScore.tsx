import { ActivityScoreItem } from '../../types/weather';
import { Footprints, UserCheck, Bike, Trophy, Activity } from 'lucide-react';

interface ActivityScoreProps {
  items: ActivityScoreItem[];
}

export const ActivityScore = ({ items }: ActivityScoreProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-4 h-4 text-cyan-400" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'Bike':
        return <Bike className="w-4 h-4 text-sky-400" />;
      case 'Trophy':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 75) return 'bg-cyan-500';
    if (score >= 65) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Outdoor Activity Index
          </h2>
          <p className="text-xs text-slate-400">Atmospheric suitability ratings for activities</p>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
          Optimal Weather
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg">
                  {getIcon(item.icon)}
                </div>
                <span className="text-xs font-semibold text-slate-200">{item.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">{item.status}</span>
                <span className="text-sm font-bold text-slate-100 font-mono">{item.score}<span className="text-xs text-slate-500">/100</span></span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60">
              <div
                className={`h-full ${getProgressColor(item.score)} transition-all duration-500 rounded-full`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

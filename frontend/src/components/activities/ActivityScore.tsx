import { ActivityScoreItem } from '../../types/weather';
import { Footprints, UserCheck, Bike, Trophy, Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translateActivityName, translateCategoryName } from '../../i18n';

interface ActivityScoreProps {
  items: ActivityScoreItem[];
}

export const ActivityScore = ({ items }: ActivityScoreProps) => {
  const { language, t } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-4 h-4 text-[#56CCF2]" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-[#27AE9B]" />;
      case 'Bike':
        return <Bike className="w-4 h-4 text-[#2F80ED]" />;
      case 'Trophy':
        return <Trophy className="w-4 h-4 text-[#F2C94C]" />;
      default:
        return <Activity className="w-4 h-4 text-[#56CCF2]" />;
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-[#27AE9B]';
    if (score >= 75) return 'bg-[#2F80ED]';
    if (score >= 65) return 'bg-[#F2C94C]';
    return 'bg-[#EB5757]';
  };

  return (
    <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#F4F7F9] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2F80ED]" />
            {t('outdoorActivityIndex', 'Outdoor Activity Index')}
          </h2>
          <p className="text-xs text-[#9AA8B2]">
            {t('environmentalTelemetry', 'Suitability indices based on current conditions')}
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#9AA8B2] bg-[#24313C] px-2.5 py-1 rounded border border-[#2B3945]">
          {t('telemetryRating', 'Telemetry Rating')}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-[#24313C] border border-[#2B3945] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#18232D] border border-[#2B3945] rounded">
                  {getIcon(item.icon)}
                </div>
                <span className="text-xs font-semibold text-[#F4F7F9]">
                  {translateActivityName(item.name, language)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9AA8B2] font-mono">
                  {translateCategoryName(item.status, language)}
                </span>
                <span className="text-sm font-bold text-[#F4F7F9] font-mono">
                  {item.score}<span className="text-xs text-[#9AA8B2]">/100</span>
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-1.5 bg-[#18232D] rounded-full overflow-hidden border border-[#2B3945]">
              <div
                className={`h-full ${getProgressColor(item.score)} transition-all duration-300 rounded-full`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

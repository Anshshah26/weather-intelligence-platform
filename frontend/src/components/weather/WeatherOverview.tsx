import { mockOverviewData } from '../../data/mockWeather';
import { Droplets, Wind, Gauge, Eye, Sun, Sunrise, Sunset } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface WeatherOverviewProps {
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  visibility?: number;
  isRealData?: boolean;
}

export const WeatherOverview = ({
  humidity,
  windSpeed,
  pressure,
  visibility,
  isRealData = false,
}: WeatherOverviewProps) => {
  const { t } = useLanguage();
  const data = mockOverviewData;

  const currentHumidity = humidity !== undefined ? humidity : data.humidity.value;
  const currentWindSpeed = windSpeed !== undefined ? windSpeed : data.wind.value;
  const currentPressure = pressure !== undefined ? pressure : data.pressure.value;
  const currentVisibility = visibility !== undefined ? visibility : data.visibility.value;

  return (
    <div className="bg-[#18232D] border border-[#2B3945] rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#F4F7F9]">{t('todaysOverview', "Today's Environmental Telemetry")}</h2>
          <p className="text-xs text-[#9AA8B2]">{t('environmentalTelemetry', 'Atmospheric conditions and solar metrics')}</p>
        </div>
        {isRealData && (
          <span className="text-[10px] font-mono text-[#27AE9B] bg-[#27AE9B]/10 px-2 py-0.5 rounded border border-[#27AE9B]/30 font-medium">
            {t('liveTelemetry', 'Live Feed')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Humidity Card */}
        <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9AA8B2] text-xs mb-3">
            <span className="font-medium">{t('humidity', 'Humidity')}</span>
            <Droplets className="w-4 h-4 text-[#56CCF2]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#F4F7F9] font-mono">
              {currentHumidity}<span className="text-sm font-normal text-[#9AA8B2]">%</span>
            </div>
            <div className="text-xs text-[#9AA8B2] mt-1">
              {currentHumidity > 70 ? 'High relative humidity' : currentHumidity > 40 ? 'Comfortable humidity' : 'Low relative humidity'}
            </div>
          </div>
        </div>

        {/* Wind Card */}
        <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9AA8B2] text-xs mb-3">
            <span className="font-medium">{t('windSpeed', 'Wind Speed')}</span>
            <Wind className="w-4 h-4 text-[#56CCF2]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#F4F7F9] font-mono">
              {currentWindSpeed}<span className="text-sm font-normal text-[#9AA8B2]"> km/h</span>
            </div>
            <div className="text-xs text-[#9AA8B2] mt-1">
              {currentWindSpeed > 20 ? 'Moderate breeze' : 'Light airflow'}
            </div>
          </div>
        </div>

        {/* Pressure Card */}
        <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9AA8B2] text-xs mb-3">
            <span className="font-medium">{t('pressure', 'Barometric Pressure')}</span>
            <Gauge className="w-4 h-4 text-[#27AE9B]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#F4F7F9] font-mono">
              {currentPressure}<span className="text-sm font-normal text-[#9AA8B2]"> hPa</span>
            </div>
            <div className="text-xs text-[#9AA8B2] mt-1">Sea level atmospheric equilibrium</div>
          </div>
        </div>

        {/* Visibility Card */}
        <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9AA8B2] text-xs mb-3">
            <span className="font-medium">{t('visibility', 'Visibility')}</span>
            <Eye className="w-4 h-4 text-[#9AA8B2]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#F4F7F9] font-mono">
              {currentVisibility}<span className="text-sm font-normal text-[#9AA8B2]"> km</span>
            </div>
            <div className="text-xs text-[#9AA8B2] mt-1">Horizontal optical transparency</div>
          </div>
        </div>

        {/* UV Index Card */}
        <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9AA8B2] text-xs mb-3">
            <span className="font-medium">{t('uvIndex', 'UV Index')}</span>
            <Sun className="w-4 h-4 text-[#F2C94C]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#F4F7F9] font-mono">{data.uvIndex.value}</span>
              <span className="text-xs font-medium text-[#F2C94C] px-2 py-0.5 bg-[#F2C94C]/10 border border-[#F2C94C]/25 rounded">
                {data.uvIndex.text}
              </span>
            </div>
            <div className="text-xs text-[#9AA8B2] mt-1">{data.uvIndex.recommendation}</div>
          </div>
        </div>

        {/* Sunrise / Sunset Card */}
        <div className="bg-[#24313C] border border-[#2B3945] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9AA8B2] text-xs mb-2">
            <span className="font-medium">{t('solarCycle', 'Solar Cycle')}</span>
            <span className="text-[11px] text-[#56CCF2] font-mono">{data.sunCycle.daylight} daylight</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-[#F2C94C] shrink-0" />
              <div>
                <div className="text-[10px] text-[#9AA8B2]">{t('sunrise', 'Sunrise')}</div>
                <div className="text-xs font-semibold text-[#F4F7F9] font-mono">{data.sunCycle.sunrise}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-[#F2994A] shrink-0" />
              <div>
                <div className="text-[10px] text-[#9AA8B2]">{t('sunset', 'Sunset')}</div>
                <div className="text-xs font-semibold text-[#F4F7F9] font-mono">{data.sunCycle.sunset}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

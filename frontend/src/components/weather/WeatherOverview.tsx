import { mockOverviewData } from '../../data/mockWeather';
import { Droplets, Wind, Gauge, Eye, Sun, Sunrise, Sunset } from 'lucide-react';

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
  const data = mockOverviewData;

  const currentHumidity = humidity !== undefined ? humidity : data.humidity.value;
  const currentWindSpeed = windSpeed !== undefined ? windSpeed : data.wind.value;
  const currentPressure = pressure !== undefined ? pressure : data.pressure.value;
  const currentVisibility = visibility !== undefined ? visibility : data.visibility.value;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Today's Overview</h2>
          <p className="text-xs text-slate-400">Detailed environmental & atmospheric metrics</p>
        </div>
        {isRealData && (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Live Telemetry
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Humidity Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {currentHumidity}<span className="text-sm font-normal text-slate-400">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {currentHumidity > 70 ? 'High Humidity' : currentHumidity > 40 ? 'Optimal Range' : 'Low Humidity'} &bull; Live
            </div>
          </div>
        </div>

        {/* Wind Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-medium">Wind Speed</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {currentWindSpeed}<span className="text-sm font-normal text-slate-400"> km/h</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Atmospheric airflow &bull; {currentWindSpeed > 20 ? 'Moderate breeze' : 'Light breeze'}
            </div>
          </div>
        </div>

        {/* Pressure Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-medium">Barometric Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {currentPressure}<span className="text-sm font-normal text-slate-400"> hPa</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Sea level atmospheric pressure</div>
          </div>
        </div>

        {/* Visibility Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-medium">Visibility</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {currentVisibility}<span className="text-sm font-normal text-slate-400"> km</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Visual range clarity</div>
          </div>
        </div>

        {/* UV Index Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-medium">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">{data.uvIndex.value}</span>
              <span className="text-xs font-semibold text-amber-400 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded">
                {data.uvIndex.text}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">{data.uvIndex.recommendation}</div>
          </div>
        </div>

        {/* Sunrise / Sunset Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">Sun Cycle</span>
            <span className="text-[10px] text-cyan-400">{data.sunCycle.daylight} daylight</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500">Sunrise</div>
                <div className="text-xs font-bold text-slate-200">{data.sunCycle.sunrise}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500">Sunset</div>
                <div className="text-xs font-bold text-slate-200">{data.sunCycle.sunset}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

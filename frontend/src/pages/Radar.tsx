import { useState, useEffect, FormEvent } from 'react';
import { RadarMap } from '../components/radar/RadarMap';
import { RadarControls } from '../components/radar/RadarControls';
import { RadarTimeline } from '../components/radar/RadarTimeline';
import { RadarLegend } from '../components/radar/RadarLegend';
import { RadarStatus } from '../components/radar/RadarStatus';
import { MapInfoCard } from '../components/map/MapInfoCard';
import { getCurrentWeather } from '../services/weatherApi';
import { getRadarData } from '../services/radarApi';
import { CurrentWeatherResponse, RadarResponse } from '../types/weather';
import { Radio, Search, MapPin, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RadarPageProps {
  currentCityWeather?: CurrentWeatherResponse | null;
}

export const RadarPage = ({ currentCityWeather }: RadarPageProps) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('Mumbai');
  const [weatherData, setWeatherData] = useState<CurrentWeatherResponse | null>(currentCityWeather || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Radar status & frames state
  const [radarStatus, setRadarStatus] = useState<RadarResponse | null>(null);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(6); // Default to current NOW slot
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.65);

  // Sync if parent prop updates
  useEffect(() => {
    if (currentCityWeather) {
      setWeatherData(currentCityWeather);
      setSearchQuery(currentCityWeather.location.city);
    }
  }, [currentCityWeather]);

  // Initial fetch for default city weather only if no weather data is available from parent state
  useEffect(() => {
    if (!currentCityWeather && !weatherData) {
      handleSearch('Mumbai');
    }
    fetchRadarCapabilities();
  }, []);

  const fetchRadarCapabilities = async () => {
    try {
      const data = await getRadarData();
      setRadarStatus(data);
      if (data.frames && data.frames.length > 0) {
        // Find 'current' index or default to middle index
        const currentIndex = data.frames.findIndex((f) => f.type === 'current');
        if (currentIndex !== -1) {
          setSelectedFrameIndex(currentIndex);
        }
      }
    } catch {
      setRadarStatus({
        status: 'not_enabled',
        available: false,
        provider: 'openweather_global_precipitation',
        message: 'Advanced global radar is not enabled for this weather account. Upgrade OpenWeather Global Precipitation Maps to enable 10-minute global radar.',
        frames: [],
      });
    }
  };

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(city);
      setWeatherData(data);
      setSearchQuery(data.location.city);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to locate weather position for this city.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  // Playback timer effect (when real frames are available)
  useEffect(() => {
    if (!isPlaying || !radarStatus?.available || radarStatus.frames.length === 0) return;

    const interval = setInterval(() => {
      setSelectedFrameIndex((prev) => (prev + 1) % radarStatus.frames.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, radarStatus]);

  // Fallback defaults
  const city = weatherData?.location.city || 'Mumbai';
  const country = weatherData?.location.country || 'IN';
  const lat = weatherData?.location.latitude || 19.0760;
  const lon = weatherData?.location.longitude || 72.8777;
  const temp = weatherData?.current.temperature;
  const condition = weatherData?.current.description;

  const isRadarAvailable = radarStatus?.available ?? false;
  const currentFrame = isRadarAvailable && radarStatus?.frames[selectedFrameIndex]
    ? radarStatus.frames[selectedFrameIndex]
    : null;

  // Format current radar display time string
  const currentDisplayTime = currentFrame?.displayTime || 'NOW (Live)';

  return (
    <div className="space-y-4 max-w-7xl mx-auto flex flex-col min-h-full lg:h-[calc(100vh-5.5rem)] pb-2 max-w-full overflow-x-hidden">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18232D] border border-[#2B3945] p-4 rounded-xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#56CCF2] mb-0.5">
            <Radio className="w-3.5 h-3.5 text-[#2F80ED]" /> Meteorological Radar Station
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">
            {t('precipitationDopplerRadar', 'Precipitation Doppler Radar')}
          </h1>
          <p className="text-xs text-[#9AA8B2] mt-0.5">
            Reflectivity telemetry and precipitation motion tracking
          </p>
        </div>

        {/* Map City Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80" role="search">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9AA8B2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder', 'Center radar on city...')}
              aria-label="Search city to update radar position"
              className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none min-h-[38px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            aria-label="Execute radar search"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2F80ED] hover:bg-[#2570d4] text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-40 shrink-0 min-h-[38px]"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
            <span>{t('searchButton', 'Go')}</span>
          </button>
        </form>
      </div>

      {/* Error Alert if Search Failed */}
      {error && (
        <div className="p-3 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg flex items-center gap-2 text-[#EB5757] text-xs shrink-0" role="alert">
          <AlertCircle className="w-4 h-4 text-[#EB5757] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Not Enabled Banner when OpenWeather 2.0 Global Precipitation is inactive */}
      {!isRadarAvailable && (
        <div className="p-3.5 bg-[#18232D] border border-[#2B3945] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#F4F7F9]">
            <Info className="w-4 h-4 text-[#F2C94C] shrink-0" />
            <div>
              <div className="font-semibold text-[#F2C94C]">Standard Radar Mode Active</div>
              <div className="text-[11px] text-[#9AA8B2] mt-0.5">High-frequency Doppler frames require Global Precipitation integration tier.</div>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 bg-[#101820] border border-[#2B3945] text-[#9AA8B2] rounded shrink-0">
            Provider: {radarStatus?.provider || 'openweather_global_precipitation'}
          </span>
        </div>
      )}

      {/* Radar Connectivity Status Bar */}
      <div className="shrink-0 max-w-full">
        <RadarStatus
          available={isRadarAvailable}
          provider={radarStatus?.provider || 'openweather_global_precipitation'}
          message={radarStatus?.message}
        />
      </div>

      {/* Main Radar Map & Overlays Container */}
      <div className="flex-1 min-h-[350px] sm:min-h-[420px] h-[60vh] lg:h-auto relative rounded-xl overflow-hidden border border-[#2B3945]">
        <RadarMap
          center={[lat, lon]}
          city={city}
          country={country}
          temperature={temp}
          condition={condition}
          radarTileUrl={currentFrame?.tileUrl}
          isAvailable={isRadarAvailable}
          opacity={opacity}
        />

        {/* Floating Location Telemetry Card (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:block pointer-events-none">
          <div className="pointer-events-auto">
            <MapInfoCard
              city={city}
              country={country}
              latitude={lat}
              longitude={lon}
              temperature={temp}
              condition={condition}
            />
          </div>
        </div>

        {/* Floating Radar Intensity Scale Legend (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none max-w-[calc(100%-2rem)]">
          <div className="pointer-events-auto">
            <RadarLegend />
          </div>
        </div>
      </div>

      {/* Radar Controls & Dynamic Timeline Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
        <div className="md:col-span-1">
          <RadarControls
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onPrevFrame={() => setSelectedFrameIndex((prev) => Math.max(0, prev - 1))}
            onNextFrame={() => setSelectedFrameIndex((prev) => Math.min((radarStatus?.frames.length || 1) - 1, prev + 1))}
            currentDisplayTime={currentDisplayTime}
            opacity={opacity}
            onChangeOpacity={setOpacity}
            disabled={!isRadarAvailable}
          />
        </div>

        <div className="md:col-span-2">
          <RadarTimeline
            frames={radarStatus?.frames || []}
            selectedIndex={selectedFrameIndex}
            onSelectFrame={setSelectedFrameIndex}
            disabled={!isRadarAvailable}
          />
        </div>
      </div>
    </div>
  );
};

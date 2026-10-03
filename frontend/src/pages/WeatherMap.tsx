import { useState, FormEvent, useEffect, useRef } from 'react';
import { WeatherMap } from '../components/map/WeatherMap';
import { MapControls, WeatherLayerType, ActiveLayersState } from '../components/map/MapControls';
import { MapInfoCard } from '../components/map/MapInfoCard';
import { DynamicMapLegend } from '../components/map/DynamicMapLegend';
import { CurrentWeatherResponse } from '../types/weather';
import { getCurrentWeather } from '../services/weatherApi';
import { Search, MapPin, Globe, RefreshCw, AlertCircle } from 'lucide-react';

interface WeatherMapPageProps {
  currentCityWeather?: CurrentWeatherResponse | null;
}

export const WeatherMapPage = ({ currentCityWeather }: WeatherMapPageProps) => {
  const [activeLayers, setActiveLayers] = useState<ActiveLayersState>({
    temp: true,
    rain: false,
    clouds: false,
    wind: false,
    pressure: false,
  });

  const [opacity, setOpacity] = useState<number>(0.65);
  const [searchQuery, setSearchQuery] = useState<string>('Mumbai');
  const [weatherData, setWeatherData] = useState<CurrentWeatherResponse | null>(currentCityWeather || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Map viewport center and zoom states
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.076, 72.8777]);
  const [mapZoom, setMapZoom] = useState<number>(6);

  // Fullscreen container ref & state
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync if parent prop updates
  useEffect(() => {
    if (currentCityWeather) {
      setWeatherData(currentCityWeather);
      setSearchQuery(currentCityWeather.location.city);
      setMapCenter([currentCityWeather.location.latitude, currentCityWeather.location.longitude]);
      setMapZoom(6);
    }
  }, [currentCityWeather]);

  // Initial fetch for default city only if no weather data is available from parent state
  useEffect(() => {
    if (!currentCityWeather && !weatherData) {
      handleSearch('Mumbai');
    }
  }, []);

  // Sync native fullscreen state changes (e.g. Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(city);
      setWeatherData(data);
      setSearchQuery(data.location.city);
      setMapCenter([data.location.latitude, data.location.longitude]);
      setMapZoom(7);
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

  const handleToggleLayer = (layer: WeatherLayerType) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleResetWorldView = () => {
    setMapCenter([20, 0]);
    setMapZoom(2);
  };

  const handleToggleFullscreen = () => {
    if (!mapWrapperRef.current) return;

    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen().catch(() => {
        // Fallback gracefully if fullscreen is restricted
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Fallback defaults if no data yet
  const city = weatherData?.location.city || 'Mumbai';
  const country = weatherData?.location.country || 'IN';
  const temp = weatherData?.current.temperature;
  const condition = weatherData?.current.description;

  return (
    <div className="space-y-4 max-w-7xl mx-auto flex flex-col min-h-full lg:h-[calc(100vh-5.5rem)] pb-2 max-w-full overflow-x-hidden">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18232D] border border-[#2B3945] p-4 rounded-xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#56CCF2] mb-0.5">
            <Globe className="w-3.5 h-3.5 text-[#2F80ED]" /> Meteorological Map Station
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">
            Atmospheric Spatial Telemetry
          </h1>
          <p className="text-xs text-[#9AA8B2] mt-0.5 hidden sm:block">
            High-precision OpenWeather layers for Temperature, Precipitation, Clouds, Wind, and Barometric Pressure.
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
              placeholder="Center map on city..."
              aria-label="Search city to update map view"
              className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none min-h-[38px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            aria-label="Execute city search"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2F80ED] hover:bg-[#2570d4] text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-40 shrink-0 min-h-[38px]"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
            <span>Go</span>
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

      {/* Layer & Map Controls Toolbar */}
      <div className="shrink-0 max-w-full">
        <MapControls
          activeLayers={activeLayers}
          opacity={opacity}
          onChangeOpacity={setOpacity}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleLayer={handleToggleLayer}
          onResetView={handleResetWorldView}
        />
      </div>

      {/* Main Map Container Viewport */}
      <div
        ref={mapWrapperRef}
        className={`flex-1 min-h-[360px] sm:min-h-[420px] h-[65vh] lg:h-auto relative rounded-xl overflow-hidden border border-[#2B3945] transition-all ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen w-screen' : ''
        }`}
      >
        <WeatherMap
          center={mapCenter}
          zoom={mapZoom}
          city={city}
          country={country}
          temperature={temp}
          condition={condition}
          activeLayers={activeLayers}
          opacity={opacity}
          isGPSLocation={weatherData?.location?.source === 'gps'}
        />

        {/* Floating Location Telemetry Card (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:block pointer-events-none">
          <div className="pointer-events-auto">
            <MapInfoCard
              city={city}
              country={country}
              latitude={mapCenter[0]}
              longitude={mapCenter[1]}
              temperature={temp}
              condition={condition}
            />
          </div>
        </div>

        {/* Floating Dynamic Scale Legend (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none max-w-[calc(100%-2rem)]">
          <div className="pointer-events-auto">
            <DynamicMapLegend activeLayers={activeLayers} />
          </div>
        </div>
      </div>
    </div>
  );
};

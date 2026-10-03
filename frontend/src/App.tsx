import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { LoadingFallback } from './components/common/LoadingFallback';
import { getCurrentWeather, getWeatherByCoordinates, getHourlyForecast, getDailyForecast } from './services/weatherApi';
import { CurrentWeatherResponse, HourlyForecastResponse, DailyForecastResponse } from './types/weather';

// Route-based code splitting for non-dashboard pages
const ForecastPage = lazy(() => import('./pages/Forecast').then((m) => ({ default: m.ForecastPage })));
const WeatherMapPage = lazy(() => import('./pages/WeatherMap').then((m) => ({ default: m.WeatherMapPage })));
const RadarPage = lazy(() => import('./pages/Radar').then((m) => ({ default: m.RadarPage })));
const AIAdvisorPage = lazy(() => import('./pages/AIAdvisor').then((m) => ({ default: m.AIAdvisorPage })));
const ActivitiesPage = lazy(() => import('./pages/Activities').then((m) => ({ default: m.ActivitiesPage })));
const TravelPlannerPage = lazy(() => import('./pages/TravelPlanner').then((m) => ({ default: m.TravelPlannerPage })));
const CityComparisonPage = lazy(() => import('./pages/CityComparison').then((m) => ({ default: m.CityComparisonPage })));

export default function App() {
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');

  // Location & GPS state
  const [locationSource, setLocationSource] = useState<'search' | 'gps'>('search');
  const [, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState<string | null>(null);

  // Current weather state
  const [weatherData, setWeatherData] = useState<CurrentWeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hourly forecast state
  const [hourlyData, setHourlyData] = useState<HourlyForecastResponse | null>(null);
  const [hourlyLoading, setHourlyLoading] = useState<boolean>(false);
  const [hourlyError, setHourlyError] = useState<string | null>(null);

  // Daily forecast state
  const [dailyData, setDailyData] = useState<DailyForecastResponse | null>(null);
  const [dailyLoading, setDailyLoading] = useState<boolean>(false);
  const [dailyError, setDailyError] = useState<string | null>(null);

  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // Dashboard initial load: Request ONLY current weather for instant initial paint
  const fetchCityCurrentWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const currentVal = await getCurrentWeather(city);
      setWeatherData(currentVal);
      setSelectedCity(currentVal.location.city);
      setBackendConnected(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to find current weather data.');
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      fetch(`${apiBaseUrl}/api/health`)
        .then((res) => (res.ok ? setBackendConnected(true) : setBackendConnected(false)))
        .catch(() => setBackendConnected(false));
    } finally {
      setLoading(false);
    }
  }, []);

  // Forecast page on-demand fetching: Request hourly & daily forecast only when requested / missing
  const fetchForecastDataIfNeeded = useCallback(
    async (city: string, force = false) => {
      if (!force && hourlyData?.location?.city === city && dailyData?.location?.city === city) {
        return; // Data already exists in application state; reuse without network request!
      }

      setHourlyLoading(true);
      setDailyLoading(true);
      setHourlyError(null);
      setDailyError(null);

      const [hourlyResult, dailyResult] = await Promise.allSettled([
        getHourlyForecast(city),
        getDailyForecast(city),
      ]);

      if (hourlyResult.status === 'fulfilled') {
        setHourlyData(hourlyResult.value);
      } else {
        const err = hourlyResult.reason;
        setHourlyError(err instanceof Error ? err.message : 'Unable to retrieve hourly forecast.');
      }
      setHourlyLoading(false);

      if (dailyResult.status === 'fulfilled') {
        setDailyData(dailyResult.value);
      } else {
        const err = dailyResult.reason;
        setDailyError(err instanceof Error ? err.message : 'Unable to retrieve daily forecast.');
      }
      setDailyLoading(false);
    },
    [hourlyData, dailyData]
  );

  const fetchGPSWeatherData = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const currentResult = await getWeatherByCoordinates(lat, lon);
      setWeatherData(currentResult);
      const detectedCity = currentResult.location.city;
      setSelectedCity(detectedCity);
      setLocationSource('gps');
      setUserCoords({ latitude: lat, longitude: lon });
      setBackendConnected(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to retrieve GPS weather data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCityCurrentWeather('Mumbai');
  }, [fetchCityCurrentWeather]);

  const handleSearchCity = (city: string) => {
    setLocationSource('search');
    setUserCoords(null);
    setGpsError(null);
    setGpsSuccessMessage(null);
    fetchCityCurrentWeather(city);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Your location could not be detected.');
      return;
    }

    setIsDetectingGPS(true);
    setGpsError(null);
    setGpsSuccessMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          await fetchGPSWeatherData(lat, lon);
          setGpsSuccessMessage('Location detected');
          setTimeout(() => setGpsSuccessMessage(null), 4000);
        } catch (err: unknown) {
          setGpsError(err instanceof Error ? err.message : 'Unable to retrieve location weather.');
        } finally {
          setIsDetectingGPS(false);
        }
      },
      (geoError) => {
        setIsDetectingGPS(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setGpsError('Location permission was denied. Please enable location permission in your browser settings to use GPS.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setGpsError('Your location could not be detected.');
            break;
          case geoError.TIMEOUT:
            setGpsError('Location request timed out. Please try again.');
            break;
          default:
            setGpsError('Your location could not be detected.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
        <Layout
          selectedCity={selectedCity}
          onSearchCity={handleSearchCity}
          isSearching={loading}
          onUseGPSLocation={handleUseGPS}
          isDetectingGPS={isDetectingGPS}
          locationSource={locationSource}
          gpsError={gpsError}
          gpsSuccessMessage={gpsSuccessMessage}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <Dashboard
                    weatherData={weatherData}
                    loading={loading}
                    error={error}
                    hourlyData={hourlyData}
                    hourlyLoading={hourlyLoading}
                    hourlyError={hourlyError}
                    dailyData={dailyData}
                    dailyLoading={dailyLoading}
                    dailyError={dailyError}
                    backendConnected={backendConnected}
                    onRefresh={() => fetchCityCurrentWeather(selectedCity)}
                  />
                }
              />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route
                path="/forecast"
                element={
                  <ForecastPage
                    dailyData={dailyData}
                    hourlyData={hourlyData}
                    loading={dailyLoading || hourlyLoading}
                    error={dailyError || hourlyError}
                    onSearchCity={handleSearchCity}
                    onRefresh={() => fetchForecastDataIfNeeded(selectedCity, true)}
                    onEnsureForecastData={(city) => fetchForecastDataIfNeeded(city, false)}
                  />
                }
              />
              <Route
                path="/map"
                element={<WeatherMapPage currentCityWeather={weatherData} />}
              />
              <Route
                path="/radar"
                element={<RadarPage currentCityWeather={weatherData} />}
              />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/ai-advisor"
                element={
                  <ProtectedRoute>
                    <AIAdvisorPage currentCityWeather={weatherData} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activities"
                element={
                  <ProtectedRoute>
                    <ActivitiesPage currentCityWeather={weatherData} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/travel"
                element={
                  <ProtectedRoute>
                    <TravelPlannerPage initialCity={selectedCity} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compare"
                element={
                  <ProtectedRoute>
                    <CityComparisonPage initialCity={selectedCity} />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

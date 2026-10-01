import asyncio
import datetime
from collections import defaultdict
from typing import Optional, Tuple, List
import httpx
from fastapi import HTTPException, status
from app.config import settings
from app.schemas.weather import (
    WeatherResponseSchema,
    LocationSchema,
    CitySuggestionSchema,
    CurrentWeatherMetrics,
    HourlyForecastResponseSchema,
    HourlyLocationSchema,
    HourlyForecastItemSchema,
    DailyForecastResponseSchema,
    DailyForecastItemSchema,
    DailyTemperatureSchema,
    RadarResponseSchema,
    RadarFrameSchema,
)
from app.schemas.air_quality import AirQualityResponseSchema, AirQualityMetricsSchema
from app.services.cache_service import (
    ttl_cache,
    TTL_CURRENT_WEATHER,
    TTL_HOURLY_FORECAST,
    TTL_DAILY_FORECAST,
    TTL_AIR_QUALITY,
    TTL_COORDINATES,
    TTL_RADAR_CAPABILITY,
    TTL_CITY_SUGGESTIONS,
)

COUNTRY_NAMES = {
    "IN": "India",
    "US": "United States",
    "GB": "United Kingdom",
    "CA": "Canada",
    "AU": "Australia",
    "DE": "Germany",
    "FR": "France",
    "JP": "Japan",
    "CN": "China",
    "BR": "Brazil",
    "RU": "Russia",
    "IT": "Italy",
    "ES": "Spain",
    "AE": "United Arab Emirates",
    "SG": "Singapore",
    "MX": "Mexico",
    "ZA": "South Africa",
    "NZ": "New Zealand",
    "NL": "Netherlands",
    "SE": "Sweden",
    "CH": "Switzerland",
    "PK": "Pakistan",
    "BD": "Bangladesh",
    "LK": "Sri Lanka",
    "NP": "Nepal",
}


class WeatherService:
    ALLOWED_MAP_LAYERS = {
        "temp_new",
        "precipitation_new",
        "clouds_new",
        "wind_new",
        "pressure_new",
    }

    @staticmethod
    async def fetch_city_suggestions(q: str) -> List[CitySuggestionSchema]:
        """Fetch city/location autocomplete suggestions for query string (15-min TTL cache)."""
        clean_q = q.strip().lower()
        if len(clean_q) < 2:
            return []

        key = ttl_cache.make_city_key("city-suggestions", clean_q)
        cached = ttl_cache.get(key)
        if cached is not None:
            return cached

        async with await ttl_cache.get_lock_for_key(key):
            cached = ttl_cache.get(key)
            if cached is not None:
                return cached

            try:
                result = await WeatherService._uncached_fetch_city_suggestions(clean_q)
                ttl_cache.set(key, result, TTL_CITY_SUGGESTIONS)
                return result
            except Exception:
                fallback = ttl_cache.get_stale_fallback(key)
                if fallback is not None:
                    return fallback
                return []

    @staticmethod
    async def _uncached_fetch_city_suggestions(q: str) -> List[CitySuggestionSchema]:
        api_key = settings.OPENWEATHER_API_KEY
        if not api_key or api_key == "your_openweather_api_key_here":
            return []

        url = "http://api.openweathermap.org/geo/1.0/direct"
        params = {"q": q, "limit": 8, "appid": api_key}

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params)

            if res.status_code != 200:
                return []

            raw_list = res.json()
            if not isinstance(raw_list, list):
                return []

            suggestions = []
            seen_keys = set()

            for item in raw_list:
                name = str(item.get("name", "")).strip()
                if not name:
                    continue
                state = item.get("state")
                country_code = str(item.get("country", "")).strip().upper()
                country = COUNTRY_NAMES.get(country_code, country_code)
                lat = round(float(item.get("lat", 0.0)), 4)
                lon = round(float(item.get("lon", 0.0)), 4)

                key = (name.lower(), (state or "").lower(), country.lower())
                if key in seen_keys:
                    continue
                seen_keys.add(key)

                suggestions.append(
                    CitySuggestionSchema(
                        name=name,
                        state=state,
                        country=country,
                        latitude=lat,
                        longitude=lon,
                    )
                )

            return suggestions
        except Exception:
            return []

    @staticmethod
    async def fetch_current_weather(city: str, refresh: bool = False) -> WeatherResponseSchema:
        """Fetch current weather metrics with 5-minute TTL caching & request coalescing."""
        key = ttl_cache.make_city_key("current", city)
        cached = ttl_cache.get(key, bypass_cache=refresh)
        if cached is not None:
            return cached

        async with await ttl_cache.get_lock_for_key(key):
            cached = ttl_cache.get(key, bypass_cache=refresh)
            if cached is not None:
                return cached

            try:
                result = await WeatherService._uncached_fetch_current_weather(city)
                ttl_cache.set(key, result, TTL_CURRENT_WEATHER)
                return result
            except Exception:
                fallback = ttl_cache.get_stale_fallback(key)
                if fallback is not None:
                    return fallback
                raise

    @staticmethod
    async def _uncached_fetch_current_weather(city: str) -> WeatherResponseSchema:
        api_key = settings.OPENWEATHER_API_KEY
        if not api_key or api_key == "your_openweather_api_key_here":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenWeather API key is not configured on the backend server.",
            )

        url = f"{settings.OPENWEATHER_BASE_URL}/weather"
        params = {"q": city, "appid": api_key, "units": "metric"}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)

            if response.status_code == 404:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"City '{city}' not found.")
            elif response.status_code == 401:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Weather service authentication error. Check server API key configuration.",
                )
            elif response.status_code == 429:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Weather provider rate limit exceeded. Please try again later.",
                )
            elif response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Unable to retrieve weather data from external provider.",
                )

            data = response.json()
            parsed = WeatherService._parse_openweather_response(data)
            
            # Cache coordinates for fast coordinate lookup
            geo_key = ttl_cache.make_city_key("geo", city)
            ttl_cache.set(
                geo_key,
                (parsed.location.latitude, parsed.location.longitude, parsed.location.city, parsed.location.country),
                TTL_COORDINATES,
            )
            return parsed

        except httpx.TimeoutException:
            raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Weather service request timed out.")
        except httpx.RequestError:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Weather service is currently unreachable.")

    @staticmethod
    async def fetch_weather_by_coordinates(lat: float, lon: float, refresh: bool = False) -> WeatherResponseSchema:
        """Fetch current weather and reverse geocode location by GPS coordinates with 24-hour TTL caching."""
        key = ttl_cache.make_coords_key("coordinates", lat, lon)
        cached = ttl_cache.get(key, bypass_cache=refresh)
        if cached is not None:
            return cached

        async with await ttl_cache.get_lock_for_key(key):
            cached = ttl_cache.get(key, bypass_cache=refresh)
            if cached is not None:
                return cached

            try:
                result = await WeatherService._uncached_fetch_weather_by_coordinates(lat, lon)
                ttl_cache.set(key, result, TTL_COORDINATES)
                return result
            except Exception:
                fallback = ttl_cache.get_stale_fallback(key)
                if fallback is not None:
                    return fallback
                raise

    @staticmethod
    async def _uncached_fetch_weather_by_coordinates(lat: float, lon: float) -> WeatherResponseSchema:
        api_key = settings.OPENWEATHER_API_KEY
        if not api_key or api_key == "your_openweather_api_key_here":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenWeather API key is not configured on the backend server.",
            )

        url = f"{settings.OPENWEATHER_BASE_URL}/weather"
        params = {"lat": lat, "lon": lon, "appid": api_key, "units": "metric"}

        geo_url = "http://api.openweathermap.org/geo/1.0/reverse"
        geo_params = {"lat": lat, "lon": lon, "limit": 1, "appid": api_key}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                weather_task = client.get(url, params=params)
                geo_task = client.get(geo_url, params=geo_params)
                
                results = await asyncio.gather(weather_task, geo_task, return_exceptions=True)
                response, geo_res = results[0], results[1]

            state_name = None
            if not isinstance(geo_res, Exception) and hasattr(geo_res, "status_code") and geo_res.status_code == 200:
                try:
                    geo_list = geo_res.json()
                    if isinstance(geo_list, list) and len(geo_list) > 0:
                        state_name = geo_list[0].get("state")
                except Exception:
                    pass

            if isinstance(response, Exception):
                raise response

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Unable to retrieve weather data for specified coordinates.",
                )

            data = response.json()
            parsed = WeatherService._parse_openweather_response(data)
            parsed.location.latitude = round(float(lat), 4)
            parsed.location.longitude = round(float(lon), 4)
            parsed.location.state = state_name
            parsed.location.source = "gps"
            return parsed

        except HTTPException:
            raise
        except httpx.TimeoutException:
            raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Weather coordinates service request timed out.")
        except httpx.RequestError:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Weather coordinates service is currently unreachable.")

    @staticmethod
    async def fetch_hourly_forecast(city: str, refresh: bool = False) -> HourlyForecastResponseSchema:
        """Fetch 8-slot hourly forecast with 10-minute TTL caching."""
        key = ttl_cache.make_city_key("hourly", city)
        cached = ttl_cache.get(key, bypass_cache=refresh)
        if cached is not None:
            return cached

        async with await ttl_cache.get_lock_for_key(key):
            cached = ttl_cache.get(key, bypass_cache=refresh)
            if cached is not None:
                return cached

            try:
                result = await WeatherService._uncached_fetch_hourly_forecast(city)
                ttl_cache.set(key, result, TTL_HOURLY_FORECAST)
                return result
            except Exception:
                fallback = ttl_cache.get_stale_fallback(key)
                if fallback is not None:
                    return fallback
                raise

    @staticmethod
    async def _uncached_fetch_hourly_forecast(city: str) -> HourlyForecastResponseSchema:
        api_key = settings.OPENWEATHER_API_KEY
        if not api_key or api_key == "your_openweather_api_key_here":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenWeather API key is not configured on the backend server.",
            )

        url = f"{settings.OPENWEATHER_BASE_URL}/forecast"
        params = {"q": city, "appid": api_key, "units": "metric"}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)

            if response.status_code == 404:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"City '{city}' not found.")
            elif response.status_code == 401:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Weather service authentication error. Check server API key configuration.",
                )
            elif response.status_code == 429:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Weather provider rate limit exceeded. Please try again later.",
                )
            elif response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Unable to retrieve forecast data from external provider.",
                )

            data = response.json()
            return WeatherService._parse_openweather_forecast_response(data)

        except httpx.TimeoutException:
            raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Forecast service request timed out.")
        except httpx.RequestError:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Forecast service is currently unreachable.")

    @staticmethod
    async def fetch_daily_forecast(city: str, refresh: bool = False) -> DailyForecastResponseSchema:
        """Fetch multi-day daily forecast with 10-minute TTL caching."""
        key = ttl_cache.make_city_key("daily", city)
        cached = ttl_cache.get(key, bypass_cache=refresh)
        if cached is not None:
            return cached

        async with await ttl_cache.get_lock_for_key(key):
            cached = ttl_cache.get(key, bypass_cache=refresh)
            if cached is not None:
                return cached

            try:
                result = await WeatherService._uncached_fetch_daily_forecast(city)
                ttl_cache.set(key, result, TTL_DAILY_FORECAST)
                return result
            except Exception:
                fallback = ttl_cache.get_stale_fallback(key)
                if fallback is not None:
                    return fallback
                raise

    @staticmethod
    async def _uncached_fetch_daily_forecast(city: str) -> DailyForecastResponseSchema:
        api_key = settings.OPENWEATHER_API_KEY
        if not api_key or api_key == "your_openweather_api_key_here":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenWeather API key is not configured on the backend server.",
            )

        url = f"{settings.OPENWEATHER_BASE_URL}/forecast"
        params = {"q": city, "appid": api_key, "units": "metric"}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)

            if response.status_code == 404:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"City '{city}' not found.")
            elif response.status_code == 401:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Weather service authentication error. Check server API key configuration.",
                )
            elif response.status_code == 429:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Weather provider rate limit exceeded. Please try again later.",
                )
            elif response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Unable to retrieve daily forecast data from external provider.",
                )

            data = response.json()
            return WeatherService._parse_openweather_daily_response(data)

        except httpx.TimeoutException:
            raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Daily forecast request timed out.")
        except httpx.RequestError:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Daily forecast service is currently unreachable.")

    @staticmethod
    async def fetch_map_tile(layer: str, z: int, x: int, y: int) -> bytes:
        """Proxy OpenWeather map layer tile."""
        if layer not in WeatherService.ALLOWED_MAP_LAYERS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid map layer '{layer}'. Allowed layers: {list(WeatherService.ALLOWED_MAP_LAYERS)}",
            )

        api_key = settings.OPENWEATHER_API_KEY
        if not api_key or api_key == "your_openweather_api_key_here":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenWeather API key is not configured on the backend server.",
            )

        url = f"https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png"
        params = {"appid": api_key}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Temperature weather layer is temporarily unavailable.",
                )

            return response.content
        except httpx.RequestError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Weather map tile service is unreachable.",
            )

    @staticmethod
    async def _resolve_coordinates(city: str, refresh: bool = False) -> Tuple[float, float, str, str]:
        """Resolve (lat, lon, city_name, country) for a given city without pulling full current weather if possible."""
        geo_key = ttl_cache.make_city_key("geo", city)
        cached = ttl_cache.get(geo_key, bypass_cache=refresh)
        if cached is not None:
            return cached

        async with await ttl_cache.get_lock_for_key(geo_key):
            cached = ttl_cache.get(geo_key, bypass_cache=refresh)
            if cached is not None:
                return cached

            # 1. Check if current weather for city is already cached
            current_key = ttl_cache.make_city_key("current", city)
            current_cached = ttl_cache.get(current_key)
            if current_cached is not None and hasattr(current_cached, "location"):
                loc = current_cached.location
                coords_res = (loc.latitude, loc.longitude, loc.city, loc.country)
                ttl_cache.set(geo_key, coords_res, TTL_COORDINATES)
                return coords_res

            api_key = settings.OPENWEATHER_API_KEY
            if not api_key or api_key == "your_openweather_api_key_here":
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="OpenWeather API key is not configured on the backend server.",
                )

            # 2. OpenWeather Direct Geocoding request (fast direct lookup)
            geo_url = "http://api.openweathermap.org/geo/1.0/direct"
            params = {"q": city, "limit": 1, "appid": api_key}

            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.get(geo_url, params=params)

                if res.status_code == 200:
                    geo_data = res.json()
                    if isinstance(geo_data, list) and len(geo_data) > 0:
                        item = geo_data[0]
                        lat = round(float(item.get("lat", 0.0)), 4)
                        lon = round(float(item.get("lon", 0.0)), 4)
                        city_name = item.get("name", city)
                        country = item.get("country", "")
                        coords_res = (lat, lon, city_name, country)
                        ttl_cache.set(geo_key, coords_res, TTL_COORDINATES)
                        return coords_res

                # Fallback to current weather fetch if direct geocoding is unavailable
                curr = await WeatherService._uncached_fetch_current_weather(city)
                coords_res = (curr.location.latitude, curr.location.longitude, curr.location.city, curr.location.country)
                ttl_cache.set(geo_key, coords_res, TTL_COORDINATES)
                return coords_res

            except HTTPException:
                raise
            except httpx.TimeoutException:
                raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Geocoding service request timed out.")
            except httpx.RequestError:
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Geocoding service is currently unreachable.")

    @staticmethod
    async def fetch_air_quality(
        city: Optional[str] = "Mumbai",
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        refresh: bool = False,
    ) -> AirQualityResponseSchema:
        """Fetch real air quality metrics with 10-minute TTL caching."""
        if lat is not None and lon is not None:
            key = ttl_cache.make_coords_key("air-quality", lat, lon)
        else:
            clean_city = city.strip() if city and city.strip() else "Mumbai"
            key = ttl_cache.make_city_key("air-quality", clean_city)

        cached = ttl_cache.get(key, bypass_cache=refresh)
        if cached is not None:
            return cached

        async with await ttl_cache.get_lock_for_key(key):
            cached = ttl_cache.get(key, bypass_cache=refresh)
            if cached is not None:
                return cached

            try:
                result = await WeatherService._uncached_fetch_air_quality(city=city, lat=lat, lon=lon, refresh=refresh)
                ttl_cache.set(key, result, TTL_AIR_QUALITY)
                return result
            except Exception:
                fallback = ttl_cache.get_stale_fallback(key)
                if fallback is not None:
                    return fallback
                raise

    @staticmethod
    async def _uncached_fetch_air_quality(
        city: Optional[str] = "Mumbai",
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        refresh: bool = False,
    ) -> AirQualityResponseSchema:
        city_name = city or "Unknown"
        country_name = ""

        if lat is not None and lon is not None:
            use_lat, use_lon = lat, lon
        else:
            clean_city = city.strip() if city and city.strip() else "Mumbai"
            use_lat, use_lon, city_name, country_name = await WeatherService._resolve_coordinates(clean_city, refresh=refresh)

        url = "https://air-quality-api.open-meteo.com/v1/air-quality"
        params = {
            "latitude": use_lat,
            "longitude": use_lon,
            "current": "us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, params=params)

            if res.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Unable to retrieve air quality data from provider.",
                )

            data = res.json().get("current", {})
            aqi_val = int(data.get("us_aqi", 0) or 0)

            if aqi_val <= 50:
                cat = "Good"
                desc = "Air quality is satisfactory and poses little or no risk."
            elif aqi_val <= 100:
                cat = "Moderate"
                desc = "Air quality is acceptable for most individuals."
            elif aqi_val <= 150:
                cat = "Unhealthy for Sensitive Groups"
                desc = "Members of sensitive groups may experience health effects."
            elif aqi_val <= 200:
                cat = "Unhealthy"
                desc = "Everyone may begin to experience health effects."
            elif aqi_val <= 300:
                cat = "Very Unhealthy"
                desc = "Health alert: risk of health effects for everyone."
            else:
                cat = "Hazardous"
                desc = "Health warning of emergency conditions."

            return AirQualityResponseSchema(
                location=HourlyLocationSchema(city=city_name, country=country_name),
                air_quality=AirQualityMetricsSchema(
                    aqi=aqi_val,
                    category=cat,
                    description=desc,
                    pm2_5=round(float(data.get("pm2_5", 0.0) or 0.0), 1),
                    pm10=round(float(data.get("pm10", 0.0) or 0.0), 1),
                    no2=round(float(data.get("nitrogen_dioxide", 0.0) or 0.0), 1),
                    o3=round(float(data.get("ozone", 0.0) or 0.0), 1),
                    so2=round(float(data.get("sulphur_dioxide", 0.0) or 0.0), 1),
                    co=round(float(data.get("carbon_monoxide", 0.0) or 0.0), 1),
                ),
            )
        except HTTPException:
            raise
        except Exception as err:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Air quality service is currently unreachable: {str(err)}",
            )

    @staticmethod
    async def fetch_radar_data(refresh: bool = False) -> RadarResponseSchema:
        """Inspect radar capability check once and cache result for 1 hour."""
        key = "radar:capability"
        cached = ttl_cache.get(key, bypass_cache=refresh)
        if cached is not None:
            return cached

        async with await ttl_cache.get_lock_for_key(key):
            cached = ttl_cache.get(key, bypass_cache=refresh)
            if cached is not None:
                return cached

            result = await WeatherService._uncached_fetch_radar_data()
            ttl_cache.set(key, result, TTL_RADAR_CAPABILITY)
            return result

    @staticmethod
    async def _uncached_fetch_radar_data() -> RadarResponseSchema:
        api_key = settings.OPENWEATHER_API_KEY
        provider_id = settings.RADAR_PROVIDER

        if not api_key or api_key == "your_openweather_api_key_here":
            return RadarResponseSchema(
                status="not_enabled",
                available=False,
                provider=provider_id,
                message="Advanced global radar is not enabled for this weather account. OpenWeather API key is not configured.",
                frames=[],
            )

        import time
        now_ts = int(time.time())
        now_ts = (now_ts // 600) * 600

        check_url = "https://maps.openweathermap.org/maps/2.0/radar/forecast/2/2/1"
        params = {"appid": api_key, "tm": now_ts}

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(check_url, params=params)

            if response.status_code == 200:
                frames = []
                for i in range(6, 0, -1):
                    ts = now_ts - (i * 600)
                    t_str = time.strftime("%I:%M %p", time.localtime(ts)).lstrip("0")
                    frames.append(
                        RadarFrameSchema(
                            timestamp=ts,
                            displayTime=t_str,
                            type="historical",
                            tileUrl=f"/api/weather/radar/tiles/{ts}/{{z}}/{{x}}/{{y}}.png",
                        )
                    )

                c_str = time.strftime("%I:%M %p", time.localtime(now_ts)).lstrip("0") + " (NOW)"
                frames.append(
                    RadarFrameSchema(
                        timestamp=now_ts,
                        displayTime=c_str,
                        type="current",
                        tileUrl=f"/api/weather/radar/tiles/{now_ts}/{{z}}/{{x}}/{{y}}.png",
                    )
                )

                for i in range(1, 7):
                    ts = now_ts + (i * 600)
                    t_str = time.strftime("%I:%M %p", time.localtime(ts)).lstrip("0")
                    frames.append(
                        RadarFrameSchema(
                            timestamp=ts,
                            displayTime=t_str,
                            type="forecast",
                            tileUrl=f"/api/weather/radar/tiles/{ts}/{{z}}/{{x}}/{{y}}.png",
                        )
                    )

                return RadarResponseSchema(
                    status="available",
                    available=True,
                    provider=provider_id,
                    message="OpenWeather Global Precipitation Maps active.",
                    frames=frames,
                )

        except Exception:
            pass

        return RadarResponseSchema(
            status="not_enabled",
            available=False,
            provider=provider_id,
            message="Advanced global radar is not enabled for this weather account. Upgrade OpenWeather Global Precipitation Maps to enable 10-minute global radar.",
            frames=[],
        )

    @staticmethod
    async def fetch_radar_map_tile(tm: int, z: int, x: int, y: int) -> bytes:
        """Proxy radar map tiles."""
        api_key = settings.OPENWEATHER_API_KEY
        if not api_key or api_key == "your_openweather_api_key_here":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenWeather API key is not configured on the backend server.",
            )

        url = f"https://maps.openweathermap.org/maps/2.0/radar/forecast/{z}/{x}/{y}"
        params = {"appid": api_key, "tm": tm}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Radar frame tile service returned non-200 response.",
                )

            return response.content
        except httpx.RequestError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Radar map tile service is unreachable.",
            )

    @staticmethod
    def _parse_openweather_response(data: dict) -> WeatherResponseSchema:
        coord = data.get("coord", {})
        sys_info = data.get("sys", {})
        main_info = data.get("main", {})
        wind_info = data.get("wind", {})
        weather_info = data.get("weather", [{}])[0]

        wind_m_s = float(wind_info.get("speed", 0.0))
        wind_kmh = round(wind_m_s * 3.6, 1)

        visibility_m = float(data.get("visibility", 10000))
        visibility_km = round(visibility_m / 1000.0, 1)

        return WeatherResponseSchema(
            location=LocationSchema(
                city=data.get("name", "Unknown"),
                country=sys_info.get("country", ""),
                latitude=round(float(coord.get("lat", 0.0)), 4),
                longitude=round(float(coord.get("lon", 0.0)), 4),
            ),
            current=CurrentWeatherMetrics(
                temperature=round(float(main_info.get("temp", 0.0)), 1),
                feels_like=round(float(main_info.get("feels_like", 0.0)), 1),
                humidity=int(main_info.get("humidity", 0)),
                pressure=int(main_info.get("pressure", 1013)),
                wind_speed=wind_kmh,
                visibility=visibility_km,
                condition=weather_info.get("main", "Clear"),
                description=weather_info.get("description", "").title(),
                icon=weather_info.get("icon", "01d"),
            ),
        )

    @staticmethod
    def _parse_openweather_forecast_response(data: dict) -> HourlyForecastResponseSchema:
        city_info = data.get("city", {})
        raw_list = data.get("list", [])[:8]

        hourly_items = []
        for item in raw_list:
            timestamp = int(item.get("dt", 0))
            dt_obj = datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc)
            formatted_time = dt_obj.strftime("%H:%M")

            main_info = item.get("main", {})
            wind_info = item.get("wind", {})
            weather_info = item.get("weather", [{}])[0]
            pop = float(item.get("pop", 0.0))

            wind_m_s = float(wind_info.get("speed", 0.0))
            wind_kmh = round(wind_m_s * 3.6, 1)

            hourly_items.append(
                HourlyForecastItemSchema(
                    time=formatted_time,
                    timestamp=timestamp,
                    temperature=round(float(main_info.get("temp", 0.0)), 1),
                    feels_like=round(float(main_info.get("feels_like", 0.0)), 1),
                    condition=weather_info.get("main", "Clear"),
                    description=weather_info.get("description", "").title(),
                    icon=weather_info.get("icon", "01d"),
                    precipitation_probability=round(pop * 100),
                    wind_speed=wind_kmh,
                    humidity=int(main_info.get("humidity", 0)),
                )
            )

        return HourlyForecastResponseSchema(
            location=HourlyLocationSchema(
                city=city_info.get("name", "Unknown"),
                country=city_info.get("country", ""),
            ),
            hourly=hourly_items,
        )

    @staticmethod
    def _parse_openweather_daily_response(data: dict) -> DailyForecastResponseSchema:
        city_info = data.get("city", {})
        timezone_offset = int(city_info.get("timezone", 0))
        raw_list = data.get("list", [])

        grouped_days = defaultdict(list)
        for item in raw_list:
            timestamp = int(item.get("dt", 0))
            dt_utc = datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc)
            dt_local = dt_utc + datetime.timedelta(seconds=timezone_offset)
            date_key = dt_local.strftime("%Y-%m-%d")

            item["_dt_local"] = dt_local
            grouped_days[date_key].append(item)

        daily_items = []
        for date_str, slots in grouped_days.items():
            temps = [float(s["main"]["temp"]) for s in slots]
            min_temp = round(min(temps), 1)
            max_temp = round(max(temps), 1)

            pops = [float(s.get("pop", 0.0)) for s in slots]
            max_pop_pct = round(max(pops) * 100)

            humidities = [int(s["main"]["humidity"]) for s in slots]
            avg_humidity = round(sum(humidities) / len(humidities))

            wind_speeds = [float(s["wind"]["speed"]) * 3.6 for s in slots]
            avg_wind_speed = round(sum(wind_speeds) / len(wind_speeds), 1)

            representative_slot = min(
                slots,
                key=lambda s: abs(s["_dt_local"].hour - 12),
            )
            weather_info = representative_slot.get("weather", [{}])[0]
            day_name = slots[0]["_dt_local"].strftime("%A")

            daily_items.append(
                DailyForecastItemSchema(
                    date=date_str,
                    day=day_name,
                    temperature=DailyTemperatureSchema(min=min_temp, max=max_temp),
                    condition=weather_info.get("main", "Clear"),
                    description=weather_info.get("description", "").title(),
                    icon=weather_info.get("icon", "01d"),
                    precipitation_probability=max_pop_pct,
                    humidity=avg_humidity,
                    wind_speed=avg_wind_speed,
                )
            )

        return DailyForecastResponseSchema(
            location=HourlyLocationSchema(
                city=city_info.get("name", "Unknown"),
                country=city_info.get("country", ""),
            ),
            daily=daily_items,
        )

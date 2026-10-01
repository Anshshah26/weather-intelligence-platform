from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, status, Response
from app.schemas.weather import (
    WeatherResponseSchema,
    CitySuggestionSchema,
    HourlyForecastResponseSchema,
    DailyForecastResponseSchema,
    RadarResponseSchema,
)
from app.schemas.air_quality import AirQualityResponseSchema
from app.schemas.umbrella import UmbrellaAlertResponseSchema
from app.services.weather_service import WeatherService
from app.services.umbrella_alert import UmbrellaAlertService

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("/city-suggestions", response_model=List[CitySuggestionSchema])
async def get_city_suggestions(
    q: Optional[str] = Query(None, description="City query string (min 2 characters)")
) -> List[CitySuggestionSchema]:
    """Fetch matching city/location autocomplete suggestions (15-min TTL cache)."""
    if not q or len(q.strip()) < 2:
        return []
    return await WeatherService.fetch_city_suggestions(q.strip())


@router.get("/current", response_model=WeatherResponseSchema)
async def get_current_weather(
    city: Optional[str] = Query(
        None,
        description="Name of the city to fetch current weather for (e.g. Mumbai, London)",
    ),
    refresh: bool = Query(False, description="Bypass cache and force fresh fetch from external API"),
) -> WeatherResponseSchema:
    """Fetch standardized current weather metrics for a specified city (5-min TTL cache)."""
    if not city or not city.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City query parameter is required and cannot be empty.",
        )

    clean_city = city.strip()
    return await WeatherService.fetch_current_weather(clean_city, refresh=refresh)


@router.get("/coordinates", response_model=WeatherResponseSchema)
async def get_weather_by_coordinates(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate"),
    refresh: bool = Query(False, description="Bypass cache and force fresh geocoding lookup"),
) -> WeatherResponseSchema:
    """Fetch current weather and reverse geocoded location metrics by latitude & longitude (24-hr TTL cache)."""
    return await WeatherService.fetch_weather_by_coordinates(lat=lat, lon=lon, refresh=refresh)


@router.get("/hourly", response_model=HourlyForecastResponseSchema)
async def get_hourly_forecast(
    city: Optional[str] = Query(
        None,
        description="Name of the city to fetch 8-slot hourly forecast for (e.g. Mumbai, London)",
    ),
    refresh: bool = Query(False, description="Bypass cache and force fresh fetch from external API"),
) -> HourlyForecastResponseSchema:
    """Fetch standardized hourly weather forecast for a specified city (10-min TTL cache)."""
    if not city or not city.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City query parameter is required and cannot be empty.",
        )

    clean_city = city.strip()
    return await WeatherService.fetch_hourly_forecast(clean_city, refresh=refresh)


@router.get("/daily", response_model=DailyForecastResponseSchema)
async def get_daily_forecast(
    city: Optional[str] = Query(
        None,
        description="Name of the city to fetch multi-day daily forecast for (e.g. Mumbai, London)",
    ),
    refresh: bool = Query(False, description="Bypass cache and force fresh fetch from external API"),
) -> DailyForecastResponseSchema:
    """Fetch standardized multi-day weather forecast aggregated from provider data (10-min TTL cache)."""
    if not city or not city.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City query parameter is required and cannot be empty.",
        )

    clean_city = city.strip()
    return await WeatherService.fetch_daily_forecast(clean_city, refresh=refresh)


@router.get("/tiles/{layer}/{z}/{x}/{y}.png")
async def get_weather_map_tile(layer: str, z: int, x: int, y: int):
    """Securely proxy map tiles from OpenWeather with 24-hr public HTTP caching."""
    tile_bytes = await WeatherService.fetch_map_tile(layer=layer, z=z, x=x, y=y)
    return Response(
        content=tile_bytes,
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=86400"},
    )


@router.get("/radar", response_model=RadarResponseSchema)
async def get_radar_data(
    refresh: bool = Query(False, description="Bypass cached radar capabilities check")
) -> RadarResponseSchema:
    """Inspect radar availability and fetch metadata for timestamped radar frames (1-hr TTL cache)."""
    return await WeatherService.fetch_radar_data(refresh=refresh)


@router.get("/radar/tiles/{tm}/{z}/{x}/{y}.png")
async def get_radar_map_tile(tm: int, z: int, x: int, y: int):
    """Securely proxy timestamped OpenWeather Global Precipitation radar tiles with 24-hr public HTTP caching."""
    tile_bytes = await WeatherService.fetch_radar_map_tile(tm=tm, z=z, x=x, y=y)
    return Response(
        content=tile_bytes,
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=86400"},
    )


@router.get("/umbrella-alert", response_model=UmbrellaAlertResponseSchema)
async def get_umbrella_alert(
    city: Optional[str] = Query("Mumbai", description="City name to check umbrella alert status for")
) -> UmbrellaAlertResponseSchema:
    """Evaluate real precipitation & hourly forecast data to determine smart umbrella recommendations."""
    clean_city = city.strip() if city and city.strip() else "Mumbai"
    return await UmbrellaAlertService.check_umbrella_need(clean_city)


@router.get("/air-quality", response_model=AirQualityResponseSchema)
async def get_air_quality(
    city: Optional[str] = Query("Mumbai", description="City name to fetch air quality data for"),
    lat: Optional[float] = Query(None, description="Latitude coordinate"),
    lon: Optional[float] = Query(None, description="Longitude coordinate"),
    refresh: bool = Query(False, description="Bypass cache and force fresh fetch from external API"),
) -> AirQualityResponseSchema:
    """Fetch real air quality metrics for specified city or coordinates (10-min TTL cache)."""
    clean_city = city.strip() if city and city.strip() else "Mumbai"
    return await WeatherService.fetch_air_quality(city=clean_city, lat=lat, lon=lon, refresh=refresh)

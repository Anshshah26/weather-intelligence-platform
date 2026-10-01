from typing import List, Optional
from pydantic import BaseModel, Field


class CityComparisonRequestSchema(BaseModel):
    cities: List[str] = Field(..., description="List of city names to compare (2 to 4 cities)")
    activity: Optional[str] = Field(None, description="Optional activity name to score across cities (e.g. running)")
    forecast_day: Optional[str] = Field("current", description="Timeframe: current | today | tomorrow | hourly")


class CityMetricsSchema(BaseModel):
    name: str = Field(..., description="City name")
    country: str = Field(..., description="Country code/name")
    timezone: str = Field(..., description="Local timezone identifier (e.g. Asia/Kolkata)")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    temperature: float = Field(..., description="Temperature in Celsius")
    feels_like: float = Field(..., description="Feels-like temperature in Celsius")
    humidity: int = Field(..., description="Humidity percentage (0-100%)")
    rain_probability: int = Field(..., description="Rain probability percentage (0-100%)")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    pressure: int = Field(..., description="Barometric pressure in hPa")
    visibility: float = Field(..., description="Visibility in km")
    condition: str = Field(..., description="Main weather condition")
    description: str = Field(..., description="Detailed description")
    icon: str = Field(..., description="Weather icon code")
    activity_score: Optional[int] = Field(None, description="Activity suitability score (0-100)")
    activity_category: Optional[str] = Field(None, description="Activity suitability category")
    is_available: bool = Field(True, description="Whether weather data was successfully retrieved")
    error_message: Optional[str] = Field(None, description="Error message if retrieval failed")


class CityComparisonResponseSchema(BaseModel):
    cities: List[CityMetricsSchema] = Field(..., description="Normalized weather metrics for each compared city")
    activity: Optional[str] = Field(None, description="Selected activity for score comparison")
    ai_summary: Optional[str] = Field(None, description="Factual non-ranking comparison summary")
    disclaimer: str = Field(
        "Activity scores and weather metrics are calculated independently from each city's weather conditions without declaring a winner.",
        description="Non-ranking disclaimer",
    )

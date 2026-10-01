from typing import List, Optional
from pydantic import BaseModel, Field


class LocationSchema(BaseModel):
    city: str
    state: Optional[str] = None
    country: str
    latitude: float
    longitude: float
    source: Optional[str] = Field(None, description="Location determination source: search | gps")


class CitySuggestionSchema(BaseModel):
    name: str = Field(..., description="City or location name")
    state: Optional[str] = Field(None, description="State or province name")
    country: str = Field(..., description="Country name or country code")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")


class CurrentWeatherMetrics(BaseModel):
    temperature: float = Field(..., description="Temperature in Celsius")
    feels_like: float = Field(..., description="Feels like temperature in Celsius")
    humidity: int = Field(..., description="Humidity percentage (0-100%)")
    pressure: int = Field(..., description="Barometric pressure in hPa")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    visibility: float = Field(..., description="Visibility in km")
    condition: str = Field(..., description="Main atmospheric condition")
    description: str = Field(..., description="Detailed weather description")
    icon: str = Field(..., description="Weather icon code")


class WeatherResponseSchema(BaseModel):
    location: LocationSchema
    current: CurrentWeatherMetrics


class HourlyLocationSchema(BaseModel):
    city: str
    country: str


class HourlyForecastItemSchema(BaseModel):
    time: str = Field(..., description="Formatted time (e.g. 16:00)")
    timestamp: int = Field(..., description="UNIX epoch timestamp")
    temperature: float = Field(..., description="Temperature in Celsius")
    feels_like: float = Field(..., description="Feels like temperature in Celsius")
    condition: str = Field(..., description="Main weather condition")
    description: str = Field(..., description="Detailed description")
    icon: str = Field(..., description="Weather icon code")
    precipitation_probability: int = Field(..., description="Rain/precipitation probability percentage (0-100%)")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    humidity: int = Field(..., description="Humidity percentage")


class HourlyForecastResponseSchema(BaseModel):
    location: HourlyLocationSchema
    hourly: List[HourlyForecastItemSchema]


class DailyTemperatureSchema(BaseModel):
    min: float = Field(..., description="Minimum temperature of the day in Celsius")
    max: float = Field(..., description="Maximum temperature of the day in Celsius")


class DailyForecastItemSchema(BaseModel):
    date: str = Field(..., description="Date string in YYYY-MM-DD format")
    day: str = Field(..., description="Day of the week (e.g. Friday)")
    temperature: DailyTemperatureSchema
    condition: str = Field(..., description="Representative weather condition of the day")
    description: str = Field(..., description="Detailed weather description")
    icon: str = Field(..., description="Representative weather icon code")
    precipitation_probability: int = Field(..., description="Max daily rain probability percentage (0-100%)")
    humidity: int = Field(..., description="Average daily humidity percentage")
    wind_speed: float = Field(..., description="Average daily wind speed in km/h")


class DailyForecastResponseSchema(BaseModel):
    location: HourlyLocationSchema
    daily: List[DailyForecastItemSchema]


class RadarFrameSchema(BaseModel):
    timestamp: int = Field(..., description="UNIX epoch timestamp of radar frame")
    displayTime: str = Field(..., description="Human readable formatted time (e.g. 10:10 AM)")
    type: str = Field(..., description="Frame temporal classification: historical | current | forecast")
    tileUrl: str = Field(..., description="Backend proxied tile template URL for radar frame")


class RadarResponseSchema(BaseModel):
    status: str = Field(..., description="Provider status: available | not_enabled")
    available: bool = Field(..., description="Whether timestamped radar data provider is active")
    provider: str = Field(..., description="Name of radar provider")
    message: str = Field(..., description="Status explanation message")
    frames: List[RadarFrameSchema] = Field(default=[], description="List of radar animation frames")



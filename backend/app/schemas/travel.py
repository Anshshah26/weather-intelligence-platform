from typing import List, Optional
from pydantic import BaseModel, Field


class TravelPlannerRequestSchema(BaseModel):
    destination: str = Field(..., description="Destination city (e.g. Mumbai, India)")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")


class TravelDestinationSchema(BaseModel):
    city: str = Field(..., description="City name")
    country: str = Field(..., description="Country code/name")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    timezone: str = Field(..., description="Local timezone string")


class TravelDailyForecastSchema(BaseModel):
    date: str = Field(..., description="Date string YYYY-MM-DD")
    day: str = Field(..., description="Day of the week (e.g. Thursday)")
    condition: str = Field(..., description="Weather condition description")
    icon: str = Field(..., description="Weather icon code")
    min_temp: float = Field(..., description="Minimum temperature in Celsius")
    max_temp: float = Field(..., description="Maximum temperature in Celsius")
    precipitation_probability: int = Field(..., description="Rain probability percentage (0-100%)")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    humidity: int = Field(..., description="Humidity percentage")
    is_available: bool = Field(True, description="Whether forecast data is within available provider horizon")
    note: Optional[str] = Field(None, description="Explanation if forecast is unavailable")


class TravelRainAnalysisSchema(BaseModel):
    highest_rain_day: Optional[str] = Field(None, description="Day with highest rain risk")
    lowest_rain_day: Optional[str] = Field(None, description="Day with lowest rain risk")
    rain_risk_days: List[str] = Field(default=[], description="List of days requiring umbrella")


class TravelTemperatureAnalysisSchema(BaseModel):
    warmest_day: Optional[str] = Field(None, description="Warmest forecast day")
    coolest_day: Optional[str] = Field(None, description="Coolest forecast day")
    average_temperature: float = Field(..., description="Average trip temperature in Celsius")


class TravelPlannerResponseSchema(BaseModel):
    destination: TravelDestinationSchema = Field(..., description="Resolved destination details")
    start_date: str = Field(..., description="Trip start date")
    end_date: str = Field(..., description="Trip end date")
    available_forecast_days: int = Field(..., description="Number of days covered by available forecast")
    trip_summary: str = Field(..., description="Overall trip weather summary")
    daily_forecasts: List[TravelDailyForecastSchema] = Field(..., description="Daily trip forecast cards")
    rain_analysis: TravelRainAnalysisSchema = Field(..., description="Precipitation analysis")
    temperature_analysis: TravelTemperatureAnalysisSchema = Field(..., description="Temperature analysis")
    packing_suggestions: List[str] = Field(..., description="Weather-based packing suggestions")
    personalized_activity_note: Optional[str] = Field(None, description="Personalized recommendation if profile enabled")
    ai_summary: Optional[str] = Field(None, description="Natural language AI trip summary")

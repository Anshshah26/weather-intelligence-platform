from pydantic import BaseModel, Field
from app.schemas.weather import HourlyLocationSchema


class AirQualityMetricsSchema(BaseModel):
    aqi: int = Field(..., description="US AQI value (0-500)")
    category: str = Field(..., description="AQI Category (Good, Moderate, Unhealthy, etc.)")
    description: str = Field(..., description="Health category advisory message")
    pm2_5: float = Field(..., description="PM2.5 in µg/m³")
    pm10: float = Field(..., description="PM10 in µg/m³")
    no2: float = Field(..., description="NO2 in µg/m³")
    o3: float = Field(..., description="O3 in µg/m³")
    so2: float = Field(..., description="SO2 in µg/m³")
    co: float = Field(..., description="CO in µg/m³")


class AirQualityResponseSchema(BaseModel):
    location: HourlyLocationSchema
    air_quality: AirQualityMetricsSchema

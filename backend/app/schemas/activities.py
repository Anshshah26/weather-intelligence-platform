from typing import List, Optional
from pydantic import BaseModel, Field


class ActivityScoreRequestSchema(BaseModel):
    activity: str = Field(..., description="Activity name (running, football, walking, cycling, cricket, hiking, outdoor_workout, picnic)")
    city: str = Field(..., description="Target city for activity weather evaluation")
    date: Optional[str] = Field("today", description="today | tomorrow | YYYY-MM-DD")
    time: Optional[str] = Field(None, description="Time slice (e.g. 07:00, 18:00, now)")


class ActivityWeatherSummarySchema(BaseModel):
    city: str = Field(..., description="City name")
    time: str = Field(..., description="Formatted date and time of evaluation")
    temperature: float = Field(..., description="Temperature in Celsius")
    condition: str = Field(..., description="Weather condition description")
    precipitation_probability: int = Field(..., description="Rain probability percentage (0-100%)")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    humidity: int = Field(..., description="Humidity percentage")


class ActivityScoreResponseSchema(BaseModel):
    activity: str = Field(..., description="Target activity name")
    score: int = Field(..., description="Suitability score from 0 to 100")
    category: str = Field(..., description="Category: Excellent | Good | Moderate | Poor | Very Poor")
    reasons: List[str] = Field(..., description="Positive weather factors contributing to score")
    warnings: List[str] = Field(..., description="Negative/warning weather factors")
    weather_summary: ActivityWeatherSummarySchema = Field(..., description="Weather context used for calculation")
    ai_explanation: Optional[str] = Field(None, description="Natural language explanation of score and weather")

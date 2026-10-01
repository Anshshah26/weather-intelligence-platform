from typing import List, Optional
from pydantic import BaseModel, Field


class ChatMessageSchema(BaseModel):
    sender: str = Field(..., description="user or ai")
    text: str = Field(..., description="Message body text")


class AIAdvisorRequestSchema(BaseModel):
    question: str = Field(..., description="Natural language weather query from user")
    city: str = Field(..., description="Target city for weather context analysis")
    history: Optional[List[ChatMessageSchema]] = Field(default=[], description="Short-term conversation history")


class AIWeatherContextSchema(BaseModel):
    city: str = Field(..., description="Target city name")
    relevant_time: str = Field(..., description="Time slice evaluated (e.g. Current, 6:00 PM, Tomorrow)")
    temperature: float = Field(..., description="Temperature in Celsius")
    feels_like: float = Field(..., description="Feels like temperature in Celsius")
    condition: str = Field(..., description="Weather condition description")
    precipitation_probability: int = Field(..., description="Rain probability percentage (0-100%)")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    humidity: int = Field(..., description="Humidity percentage")


class AIAdvisorResponseSchema(BaseModel):
    answer: str = Field(..., description="Practical AI generated advice based on real telemetry")
    weather_context: AIWeatherContextSchema = Field(..., description="Structured context passed to AI")

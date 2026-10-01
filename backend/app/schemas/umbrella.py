from typing import Optional
from pydantic import BaseModel, Field


class UmbrellaAlertResponseSchema(BaseModel):
    location: str = Field(..., description="City name checked for umbrella alert")
    checked_at: str = Field(..., description="Timestamp when forecast was evaluated")
    status: str = Field(..., description="Alert severity status: low | medium | high")
    needed: bool = Field(..., description="Whether carrying an umbrella is recommended")
    severity: str = Field(..., description="Severity level: low | medium | high")
    message: str = Field(..., description="Human readable recommendation message")
    rain_probability: int = Field(..., description="Maximum rain probability percentage in next 12h")
    expected_time: Optional[str] = Field(None, description="Expected rain onset time (e.g. 18:00 or 6:00 PM)")
    expires_at: Optional[str] = Field(None, description="Time when forecast alert expires")

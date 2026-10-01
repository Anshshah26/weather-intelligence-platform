import time
from typing import Optional
from app.services.weather_service import WeatherService
from app.schemas.umbrella import UmbrellaAlertResponseSchema

# Centralized Configurable Thresholds for Umbrella Detection Engine
UMBRELLA_THRESHOLDS = {
    "NO_ALERT_PROB_MAX": 25,
    "MEDIUM_ALERT_PROB_MIN": 30,
    "HIGH_ALERT_PROB_MIN": 60,
    "FORECAST_WINDOW_HOURS": 12,
}


class UmbrellaAlertService:
    @staticmethod
    async def check_umbrella_need(city: str) -> UmbrellaAlertResponseSchema:
        """
        Evaluate real 12-hour hourly forecast telemetry to determine umbrella recommendations.
        """
        clean_city = city.strip() if city and city.strip() else "Mumbai"

        # Retrieve hourly forecast data
        hourly = await WeatherService.fetch_hourly_forecast(clean_city)
        hourly_items = hourly.hourly[: UMBRELLA_THRESHOLDS["FORECAST_WINDOW_HOURS"]]

        if not hourly_items:
            now_str = time.strftime("%I:%M %p", time.localtime())
            return UmbrellaAlertResponseSchema(
                location=clean_city,
                checked_at=now_str,
                status="low",
                needed=False,
                severity="low",
                message="No significant rain is expected in the next several hours.",
                rain_probability=0,
                expected_time=None,
                expires_at=None,
            )

        # Inspect next 12 hours for rain probabilities & conditions
        max_prob = 0
        rain_onset_time: Optional[str] = None
        rain_condition: Optional[str] = None

        for item in hourly_items:
            prob = item.precipitation_probability
            cond = item.condition.lower()
            desc = item.description.lower()

            if prob > max_prob:
                max_prob = prob

            is_rain_cond = "rain" in cond or "shower" in cond or "drizzle" in cond or "thunderstorm" in cond or "rain" in desc

            if (prob >= UMBRELLA_THRESHOLDS["MEDIUM_ALERT_PROB_MIN"] or is_rain_cond) and not rain_onset_time:
                rain_onset_time = item.time
                rain_condition = item.description

        now_str = time.strftime("%I:%M %p", time.localtime())
        city_name = hourly.location.city or clean_city

        # Rule 1: No alert (Low probability < 25% and no rain conditions)
        if max_prob < UMBRELLA_THRESHOLDS["NO_ALERT_PROB_MAX"] and not rain_condition:
            return UmbrellaAlertResponseSchema(
                location=city_name,
                checked_at=now_str,
                status="low",
                needed=False,
                severity="low",
                message="No significant rain is expected in the next several hours.",
                rain_probability=max_prob,
                expected_time=None,
                expires_at=None,
            )

        # Rule 2: High priority alert (Prob >= 60% or heavy rain condition)
        if max_prob >= UMBRELLA_THRESHOLDS["HIGH_ALERT_PROB_MIN"] or (rain_condition and "heavy" in rain_condition.lower()):
            time_label = rain_onset_time or "soon"
            return UmbrellaAlertResponseSchema(
                location=city_name,
                checked_at=now_str,
                status="high",
                needed=True,
                severity="high",
                message=f"Rain is likely around {time_label} in {city_name} ({max_prob}% chance). Carry an umbrella.",
                rain_probability=max_prob,
                expected_time=time_label,
                expires_at=f"Expires at {time_label}",
            )

        # Rule 3: Medium priority alert (Prob 30% - 59%)
        time_label = rain_onset_time or "later today"
        return UmbrellaAlertResponseSchema(
            location=city_name,
            checked_at=now_str,
            status="medium",
            needed=True,
            severity="medium",
            message=f"Rain is possible around {time_label} in {city_name} ({max_prob}% chance). Consider carrying an umbrella.",
            rain_probability=max_prob,
            expected_time=time_label,
            expires_at=f"Expires at {time_label}",
        )

import asyncio
from typing import List, Optional
from fastapi import HTTPException, status
from app.services.weather_service import WeatherService
from app.services.activity_score import ActivityScoreService
from app.services.travel_planner import TravelPlannerService
from app.schemas.comparison import (
    CityComparisonResponseSchema,
    CityMetricsSchema,
)


class CityComparisonService:
    @staticmethod
    async def compare_cities(
        cities: List[str],
        activity: Optional[str] = None,
        forecast_day: Optional[str] = "current",
    ) -> CityComparisonResponseSchema:
        """
        Compare weather parameters and optional activity scores across 2 to 4 cities.
        Guarantees zero-ranking factual outputs without declaring winners.
        """
        # Clean & Validate Cities
        cleaned_cities = [c.strip() for c in cities if c and c.strip()]

        # Check for duplicates
        seen_lower = set()
        for c in cleaned_cities:
            lower_c = c.lower()
            if lower_c in seen_lower:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"This city ('{c}') has already been added.",
                )
            seen_lower.add(lower_c)

        if len(cleaned_cities) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Select at least two cities to compare weather.",
            )

        if len(cleaned_cities) > 4:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A maximum of 4 cities can be compared simultaneously.",
            )

        # Fetch city weather metrics in parallel
        tasks = [
            CityComparisonService._fetch_single_city_metrics(c, activity, forecast_day)
            for c in cleaned_cities
        ]

        results: List[CityMetricsSchema] = await asyncio.gather(*tasks)

        # Check if ALL cities failed
        available_cities = [r for r in results if r.is_available]
        if not available_cities:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Weather data is currently unavailable for all requested cities.",
            )

        # Build Factual Non-Ranking AI Summary
        ai_summary = CityComparisonService._generate_factual_ai_summary(
            results=results,
            activity=activity,
        )

        return CityComparisonResponseSchema(
            cities=results,
            activity=activity,
            ai_summary=ai_summary,
            disclaimer="Activity scores and weather metrics are calculated independently from each city's weather conditions without declaring a winner.",
        )

    @staticmethod
    async def _fetch_single_city_metrics(
        city_name: str,
        activity: Optional[str],
        forecast_day: Optional[str],
    ) -> CityMetricsSchema:
        """Fetch weather and compute optional activity score for a single city safely."""
        try:
            current_weather = await WeatherService.fetch_current_weather(city_name)
            daily_forecast = await WeatherService.fetch_daily_forecast(city_name)

            loc = current_weather.location
            cur = current_weather.current

            tz_name = TravelPlannerService._resolve_timezone(loc.city, loc.country)

            # Max rain probability from available daily forecast
            rain_prob = 0
            if daily_forecast and daily_forecast.daily:
                rain_prob = daily_forecast.daily[0].precipitation_probability

            act_score: Optional[int] = None
            act_cat: Optional[str] = None

            if activity:
                weather_dict = {
                    "temperature": cur.temperature,
                    "feels_like": cur.feels_like,
                    "precipitation_probability": rain_prob,
                    "wind_speed": cur.wind_speed,
                    "humidity": cur.humidity,
                    "condition": cur.condition,
                    "city": loc.city,
                    "time": "Current",
                }
                scored = ActivityScoreService.calculate_score(activity, weather_dict)
                act_score = scored.score
                act_cat = scored.category

            return CityMetricsSchema(
                name=loc.city,
                country=loc.country,
                timezone=tz_name,
                latitude=loc.latitude,
                longitude=loc.longitude,
                temperature=cur.temperature,
                feels_like=cur.feels_like,
                humidity=cur.humidity,
                rain_probability=rain_prob,
                wind_speed=cur.wind_speed,
                pressure=cur.pressure,
                visibility=cur.visibility,
                condition=cur.condition,
                description=cur.description,
                icon=cur.icon,
                activity_score=act_score,
                activity_category=act_cat,
                is_available=True,
                error_message=None,
            )

        except Exception:
            return CityMetricsSchema(
                name=city_name,
                country="Unknown",
                timezone="UTC",
                latitude=0.0,
                longitude=0.0,
                temperature=0.0,
                feels_like=0.0,
                humidity=0,
                rain_probability=0,
                wind_speed=0.0,
                pressure=1013,
                visibility=0.0,
                condition="Unavailable",
                description="Weather data unavailable",
                icon="03d",
                activity_score=None,
                activity_category=None,
                is_available=False,
                error_message=f"Weather data is currently unavailable for '{city_name}'.",
            )

    @staticmethod
    def _generate_factual_ai_summary(
        results: List[CityMetricsSchema],
        activity: Optional[str],
    ) -> str:
        """
        Synthesize purely factual, non-ranking comparative statements.
        Avoids declaring winners or calling a city 'best'.
        """
        avail = [r for r in results if r.is_available]
        if not avail:
            return "No weather comparison data available."

        parts = []
        for r in avail:
            parts.append(
                f"{r.name} ({r.country}) is currently {r.temperature}°C (feels like {r.feels_like}°C), {r.condition.lower()} with {r.humidity}% humidity and {r.wind_speed} km/h wind."
            )

        summary = " ".join(parts)

        if activity and any(r.activity_score is not None for r in avail):
            act_parts = []
            for r in avail:
                if r.activity_score is not None:
                    act_parts.append(f"{r.name}: {r.activity_score}/100 ({r.activity_category})")
            summary += f" For {activity.capitalize()}, activity scores are calculated independently: {', '.join(act_parts)}."

        return summary

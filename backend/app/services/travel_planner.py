from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import HTTPException, status
from app.services.weather_service import WeatherService
from app.schemas.travel import (
    TravelPlannerResponseSchema,
    TravelDestinationSchema,
    TravelDailyForecastSchema,
    TravelRainAnalysisSchema,
    TravelTemperatureAnalysisSchema,
)


class TravelPlannerService:
    @staticmethod
    async def analyze_trip(
        destination: str,
        start_date_str: str,
        end_date_str: str,
    ) -> TravelPlannerResponseSchema:
        """
        Analyze weather forecast for a travel destination and date range.
        Validates date bounds against available provider forecast horizon.
        """
        clean_dest = destination.strip() if destination and destination.strip() else "Mumbai"

        # Validate Date Parsing
        try:
            start_date = datetime.strptime(start_date_str.strip(), "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str.strip(), "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Dates must be in YYYY-MM-DD format.",
            )

        if start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Start date cannot be after end date.",
            )

        # Retrieve real weather telemetry from existing services
        try:
            current = await WeatherService.fetch_current_weather(clean_dest)
            daily = await WeatherService.fetch_daily_forecast(clean_dest)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Unable to retrieve travel weather forecast for '{clean_dest}'. Please check destination name.",
            )

        # Resolve Timezone
        city_name = current.location.city
        country = current.location.country
        tz_name = TravelPlannerService._resolve_timezone(city_name, country)

        destination_schema = TravelDestinationSchema(
            city=city_name,
            country=country,
            latitude=current.location.latitude,
            longitude=current.location.longitude,
            timezone=tz_name,
        )

        # Map available daily provider forecasts by date YYYY-MM-DD
        available_daily_map = {}
        for d_item in daily.daily:
            available_daily_map[d_item.date] = d_item

        # Evaluate every day in requested trip date range
        daily_forecasts: List[TravelDailyForecastSchema] = []
        available_days_count = 0

        curr_d = start_date
        while curr_d <= end_date:
            d_str = curr_d.strftime("%Y-%m-%d")
            day_label = curr_d.strftime("%A")

            if d_str in available_daily_map:
                matched = available_daily_map[d_str]
                available_days_count += 1
                daily_forecasts.append(
                    TravelDailyForecastSchema(
                        date=d_str,
                        day=matched.day or day_label,
                        condition=matched.description,
                        icon=matched.icon,
                        min_temp=matched.temperature.min,
                        max_temp=matched.temperature.max,
                        precipitation_probability=matched.precipitation_probability,
                        wind_speed=matched.wind_speed,
                        humidity=matched.humidity,
                        is_available=True,
                        note=None,
                    )
                )
            else:
                # Date is beyond available provider forecast horizon
                daily_forecasts.append(
                    TravelDailyForecastSchema(
                        date=d_str,
                        day=day_label,
                        condition="Forecast Pending",
                        icon="03d",
                        min_temp=0.0,
                        max_temp=0.0,
                        precipitation_probability=0,
                        wind_speed=0.0,
                        humidity=0,
                        is_available=False,
                        note="Forecast not yet available for this date.",
                    )
                )

            curr_d += timedelta(days=1)

        # If no dates in range are available in forecast horizon
        if available_days_count == 0:
            last_avail_date = daily.daily[-1].date if daily.daily else "next 5 days"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Detailed weather forecast for {city_name} is currently available through {last_avail_date}. Please select dates within the available forecast window.",
            )

        # Analyze Available Days Telemetry
        avail_items = [f for f in daily_forecasts if f.is_available]

        # Rain Analysis
        sorted_by_rain = sorted(avail_items, key=lambda x: x.precipitation_probability, reverse=True)
        highest_rain_day = f"{sorted_by_rain[0].day} ({sorted_by_rain[0].date})" if sorted_by_rain else None
        lowest_rain_day = f"{sorted_by_rain[-1].day} ({sorted_by_rain[-1].date})" if sorted_by_rain else None
        rain_risk_days = [f"{item.day} ({item.date})" for item in avail_items if item.precipitation_probability >= 40]

        rain_analysis = TravelRainAnalysisSchema(
            highest_rain_day=highest_rain_day,
            lowest_rain_day=lowest_rain_day,
            rain_risk_days=rain_risk_days,
        )

        # Temperature Analysis
        sorted_by_max_temp = sorted(avail_items, key=lambda x: x.max_temp, reverse=True)
        sorted_by_min_temp = sorted(avail_items, key=lambda x: x.min_temp)

        warmest_day = f"{sorted_by_max_temp[0].day} ({sorted_by_max_temp[0].max_temp}°C)" if sorted_by_max_temp else None
        coolest_day = f"{sorted_by_min_temp[0].day} ({sorted_by_min_temp[0].min_temp}°C)" if sorted_by_min_temp else None
        avg_temp = round(sum((f.max_temp + f.min_temp) / 2.0 for f in avail_items) / len(avail_items), 1)

        temp_analysis = TravelTemperatureAnalysisSchema(
            warmest_day=warmest_day,
            coolest_day=coolest_day,
            average_temperature=avg_temp,
        )

        # Generate Packing Suggestions based on real weather metrics
        packing_suggestions: List[str] = []
        if len(rain_risk_days) > 0:
            packing_suggestions.append("Consider packing an umbrella or compact rain jacket.")

        if avg_temp >= 27.0:
            packing_suggestions.append("Light, breathable clothing and sun protection recommended.")
        elif avg_temp <= 15.0:
            packing_suggestions.append("Pack warm layers and a lightweight jacket.")

        if any(f.wind_speed >= 25.0 for f in avail_items):
            packing_suggestions.append("Consider wind-resistant outerwear for breezy days.")

        if not packing_suggestions:
            packing_suggestions.append("Standard comfortable travel attire recommended.")

        # Overall Trip Summary Text
        rain_summary_text = "Possible rain on several days." if len(rain_risk_days) > 0 else "Low rain risk expected."
        umbrella_rec = "Umbrella recommended." if len(rain_risk_days) > 0 else "No umbrella needed."

        trip_summary = (
            f"Overall {city_name} weather is forecast to be {avail_items[0].condition.lower()} with an average temperature of {avg_temp}°C. "
            f"{rain_summary_text} {umbrella_rec}"
        )

        ai_summary = (
            f"Trip weather for {city_name} ({start_date_str} to {end_date_str}) shows an average temperature of {avg_temp}°C. "
            f"{'Rain is most likely on ' + rain_risk_days[0] + '.' if rain_risk_days else 'Overall dry conditions are expected during the available forecast period.'}"
        )

        return TravelPlannerResponseSchema(
            destination=destination_schema,
            start_date=start_date_str,
            end_date=end_date_str,
            available_forecast_days=available_days_count,
            trip_summary=trip_summary,
            daily_forecasts=daily_forecasts,
            rain_analysis=rain_analysis,
            temperature_analysis=temp_analysis,
            packing_suggestions=packing_suggestions,
            personalized_activity_note=None,
            ai_summary=ai_summary,
        )

    @staticmethod
    def _resolve_timezone(city: str, country: str) -> str:
        """Helper to map city/country to standard timezone identifier."""
        c = city.lower()
        if "london" in c or country == "GB":
            return "Europe/London"
        if "tokyo" in c or country == "JP":
            return "Asia/Tokyo"
        if "dubai" in c or country == "AE":
            return "Asia/Dubai"
        if "new york" in c or "chicago" in c or country == "US":
            return "America/New_York"
        return "Asia/Kolkata"

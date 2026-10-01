from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query, Header
from app.schemas.activities import ActivityScoreRequestSchema, ActivityScoreResponseSchema
from app.services.activity_score import ActivityScoreService
from app.services.weather_service import WeatherService
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api", tags=["activities"])


@router.post("/activity-score", response_model=ActivityScoreResponseSchema)
async def get_activity_score(
    body: ActivityScoreRequestSchema,
    authorization: Optional[str] = Header(None),
) -> ActivityScoreResponseSchema:
    """
    Calculate deterministic weather suitability score (0-100) for authenticated users.
    """
    AuthService.get_user_from_token(authorization)

    clean_city = body.city.strip() if body.city and body.city.strip() else "Mumbai"
    clean_act = body.activity.strip().lower()

    # Retrieve weather telemetry based on time & date parameters
    try:
        current = await WeatherService.fetch_current_weather(clean_city)
        hourly = await WeatherService.fetch_hourly_forecast(clean_city)
        daily = await WeatherService.fetch_daily_forecast(clean_city)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unable to retrieve weather data for {clean_city}.",
        )

    # Determine time slice (Current vs Tomorrow vs Specific Hour)
    weather_context = {
        "city": current.location.city,
        "time": "Current Weather",
        "temperature": current.current.temperature,
        "feels_like": current.current.feels_like,
        "condition": current.current.description,
        "precipitation_probability": 0,
        "wind_speed": current.current.wind_speed,
        "humidity": current.current.humidity,
    }

    req_date = (body.date or "today").lower().strip()
    req_time = (body.time or "").lower().strip()

    if req_date == "tomorrow" and daily.daily and len(daily.daily) > 1:
        tomorrow_item = daily.daily[1]
        weather_context["time"] = f"Tomorrow ({tomorrow_item.day})"
        weather_context["temperature"] = round((tomorrow_item.temperature.min + tomorrow_item.temperature.max) / 2.0, 1)
        weather_context["feels_like"] = weather_context["temperature"]
        weather_context["condition"] = tomorrow_item.description
        weather_context["precipitation_probability"] = tomorrow_item.precipitation_probability
        weather_context["wind_speed"] = tomorrow_item.wind_speed
        weather_context["humidity"] = tomorrow_item.humidity

    elif req_time and req_time != "now" and hourly.hourly:
        # Match hourly slot (e.g. "07:00", "18:00")
        target_h = None
        if ":" in req_time:
            try:
                target_h = int(req_time.split(":")[0])
            except Exception:
                pass
        elif req_time.isdigit():
            target_h = int(req_time)

        if target_h is not None:
            best_slot = None
            for slot in hourly.hourly:
                try:
                    slot_h = int(slot.time.split(":")[0])
                    if slot_h == target_h or abs(slot_h - target_h) <= 1:
                        best_slot = slot
                        break
                except Exception:
                    pass

            if best_slot:
                weather_context["time"] = f"At {best_slot.time}"
                weather_context["temperature"] = best_slot.temperature
                weather_context["feels_like"] = best_slot.feels_like
                weather_context["condition"] = best_slot.description
                weather_context["precipitation_probability"] = best_slot.precipitation_probability
                weather_context["wind_speed"] = best_slot.wind_speed
                weather_context["humidity"] = best_slot.humidity

    return ActivityScoreService.calculate_score(
        activity_key=clean_act,
        weather=weather_context,
    )


@router.get("/activities/all-scores", response_model=List[ActivityScoreResponseSchema])
async def get_all_activity_scores(
    city: Optional[str] = Query("Mumbai", description="City name to evaluate all activity scores"),
    authorization: Optional[str] = Header(None),
) -> List[ActivityScoreResponseSchema]:
    """
    Fetch scores for all 8 supported activities for authenticated users.
    """
    AuthService.get_user_from_token(authorization)

    clean_city = city.strip() if city and city.strip() else "Mumbai"

    try:
        current = await WeatherService.fetch_current_weather(clean_city)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unable to retrieve weather telemetry for {clean_city}.",
        )

    weather_context = {
        "city": current.location.city,
        "time": "Current Weather",
        "temperature": current.current.temperature,
        "feels_like": current.current.feels_like,
        "condition": current.current.description,
        "precipitation_probability": 0,
        "wind_speed": current.current.wind_speed,
        "humidity": current.current.humidity,
    }

    results = []
    for act_key in ActivityScoreService.SUPPORTED_ACTIVITIES.keys():
        score_res = ActivityScoreService.calculate_score(act_key, weather_context)
        results.append(score_res)

    return results

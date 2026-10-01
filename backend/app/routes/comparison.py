from typing import Optional
from fastapi import APIRouter, HTTPException, status, Header
from app.schemas.comparison import CityComparisonRequestSchema, CityComparisonResponseSchema
from app.services.city_comparison import CityComparisonService
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/weather", tags=["comparison"])


@router.post("/compare", response_model=CityComparisonResponseSchema)
async def compare_weather_cities(
    payload: CityComparisonRequestSchema,
    authorization: Optional[str] = Header(None),
):
    """
    Compare current/forecast weather metrics and activity scores across 2 to 4 cities for authenticated users.
    """
    AuthService.get_user_from_token(authorization)

    try:
        return await CityComparisonService.compare_cities(
            cities=payload.cities,
            activity=payload.activity,
            forecast_day=payload.forecast_day,
        )
    except HTTPException as he:
        raise he
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process city comparison right now. Please try again later.",
        )

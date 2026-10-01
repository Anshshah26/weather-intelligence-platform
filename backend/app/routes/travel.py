from typing import Optional
from fastapi import APIRouter, HTTPException, status, Header
from app.schemas.travel import TravelPlannerRequestSchema, TravelPlannerResponseSchema
from app.services.travel_planner import TravelPlannerService
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/travel", tags=["travel"])


@router.post("/weather", response_model=TravelPlannerResponseSchema)
async def analyze_travel_weather(
    payload: TravelPlannerRequestSchema,
    authorization: Optional[str] = Header(None),
):
    """
    Analyze destination weather telemetry for authenticated users.
    """
    AuthService.get_user_from_token(authorization)

    try:
        return await TravelPlannerService.analyze_trip(
            destination=payload.destination,
            start_date_str=payload.start_date,
            end_date_str=payload.end_date,
        )
    except HTTPException as he:
        raise he
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to analyze the trip right now. Please try again.",
        )

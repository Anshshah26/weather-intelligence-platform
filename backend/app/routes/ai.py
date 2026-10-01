from typing import Optional
from fastapi import APIRouter, Header
from app.schemas.ai import AIAdvisorRequestSchema, AIAdvisorResponseSchema
from app.services.ai_service import AIService
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/weather-advisor", response_model=AIAdvisorResponseSchema)
async def get_weather_advice(
    body: AIAdvisorRequestSchema,
    authorization: Optional[str] = Header(None),
) -> AIAdvisorResponseSchema:
    """
    Process natural language weather query for authenticated users.
    """
    # Verify authentication token
    AuthService.get_user_from_token(authorization)

    return await AIService.generate_weather_advice(
        question=body.question,
        city=body.city,
        history=body.history,
    )

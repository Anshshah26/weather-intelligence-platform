from typing import Optional
from fastapi import APIRouter, Header, HTTPException, status
from app.schemas.auth import (
    UserSignupSchema,
    UserLoginSchema,
    UserResponseSchema,
    AuthTokenResponseSchema,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=AuthTokenResponseSchema)
def signup_user(payload: UserSignupSchema) -> AuthTokenResponseSchema:
    """
    Register a new user account into SQLite database.
    """
    return AuthService.signup(payload)


@router.post("/login", response_model=AuthTokenResponseSchema)
def login_user(payload: UserLoginSchema) -> AuthTokenResponseSchema:
    """
    Authenticate user credentials against SQLite database.
    """
    return AuthService.login(payload)


@router.get("/me", response_model=UserResponseSchema)
def get_current_user(authorization: Optional[str] = Header(None)) -> UserResponseSchema:
    """
    Fetch current authenticated user profile using Bearer token.
    """
    return AuthService.get_user_from_token(authorization)

from pydantic import BaseModel, Field
from typing import Optional


class UserSignupSchema(BaseModel):
    name: str = Field(..., min_length=2, description="Full name of user")
    email: str = Field(..., description="Unique email address")
    password: str = Field(..., min_length=6, description="Account password (min 6 chars)")
    confirm_password: str = Field(..., description="Confirm password matching password")


class UserLoginSchema(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class UserResponseSchema(BaseModel):
    id: int = Field(..., description="User ID")
    name: str = Field(..., description="User full name")
    email: str = Field(..., description="User email address")
    created_at: str = Field(..., description="ISO creation timestamp")


class AuthTokenResponseSchema(BaseModel):
    access_token: str = Field(..., description="JWT bearer token")
    token_type: str = Field("bearer", description="Token type")
    user: UserResponseSchema = Field(..., description="Authenticated user profile")

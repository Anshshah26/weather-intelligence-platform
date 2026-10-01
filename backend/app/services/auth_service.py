import hmac
import hashlib
import secrets
import json
import base64
import time
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, status, Header
from app.config import settings
from app.db import get_db_connection
from app.schemas.auth import (
    UserSignupSchema,
    UserLoginSchema,
    UserResponseSchema,
    AuthTokenResponseSchema,
)


class AuthService:
    TOKEN_EXPIRE_SECONDS = 7 * 24 * 3600  # 7 Days token validity

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password securely using PBKDF2 HMAC-SHA256 with 100,000 iterations."""
        salt = secrets.token_hex(16)
        pwd_hash = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000
        ).hex()
        return f"{salt}${pwd_hash}"

    @staticmethod
    def verify_password(password: str, stored_password_hash: str) -> bool:
        """Verify password against stored salt and PBKDF2 hash using timing-safe comparison."""
        try:
            salt, stored_hash = stored_password_hash.split("$", 1)
            calc_hash = hashlib.pbkdf2_hmac(
                "sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000
            ).hex()
            return hmac.compare_digest(calc_hash, stored_hash)
        except Exception:
            return False

    @staticmethod
    def create_access_token(user_id: int, email: str) -> str:
        """Generate a signed HMAC-SHA256 JWT bearer token."""
        header = {"alg": "HS256", "typ": "JWT"}
        exp = int(time.time()) + AuthService.TOKEN_EXPIRE_SECONDS
        payload = {"sub": user_id, "email": email, "exp": exp}

        def b64url_encode(data: bytes) -> str:
            return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

        h_bytes = json.dumps(header, separators=(",", ":")).encode("utf-8")
        p_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")

        encoded_h = b64url_encode(h_bytes)
        encoded_p = b64url_encode(p_bytes)

        signing_input = f"{encoded_h}.{encoded_p}".encode("utf-8")
        signature = hmac.new(
            settings.JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256
        ).digest()
        encoded_sig = b64url_encode(signature)

        return f"{encoded_h}.{encoded_p}.{encoded_sig}"

    @staticmethod
    def decode_access_token(token: str) -> dict:
        """Verify HMAC-SHA256 signature and check token expiration."""
        try:
            parts = token.strip().split(".")
            if len(parts) != 3:
                raise ValueError("Invalid token format")

            encoded_h, encoded_p, encoded_sig = parts
            signing_input = f"{encoded_h}.{encoded_p}".encode("utf-8")

            expected_sig = hmac.new(
                settings.JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256
            ).digest()

            def b64url_decode(s: str) -> bytes:
                padding = "=" * (-len(s) % 4)
                return base64.urlsafe_b64decode(s + padding)

            actual_sig = b64url_decode(encoded_sig)
            if not hmac.compare_digest(expected_sig, actual_sig):
                raise ValueError("Invalid signature")

            payload_bytes = b64url_decode(encoded_p)
            payload = json.loads(payload_bytes.decode("utf-8"))

            exp = payload.get("exp", 0)
            if int(time.time()) > exp:
                raise ValueError("Token has expired")

            return payload
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication session. Please sign in again.",
            )

    @staticmethod
    def signup(payload: UserSignupSchema) -> AuthTokenResponseSchema:
        """Register a new user account into SQLite database after validation."""
        if payload.password != payload.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password and confirm password do not match.",
            )

        clean_email = payload.email.strip().lower()
        clean_name = payload.name.strip()

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE email = ?", (clean_email,))
            existing = cursor.fetchone()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this email address already exists.",
                )

            pwd_hash = AuthService.hash_password(payload.password)
            created_at = datetime.now(timezone.utc).isoformat()

            cursor.execute(
                "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (clean_name, clean_email, pwd_hash, created_at),
            )
            conn.commit()
            user_id = cursor.lastrowid

        user_schema = UserResponseSchema(
            id=user_id,
            name=clean_name,
            email=clean_email,
            created_at=created_at,
        )

        token = AuthService.create_access_token(user_id=user_id, email=clean_email)

        return AuthTokenResponseSchema(
            access_token=token,
            token_type="bearer",
            user=user_schema,
        )

    @staticmethod
    def login(payload: UserLoginSchema) -> AuthTokenResponseSchema:
        """Authenticate user credentials against SQLite database."""
        clean_email = payload.email.strip().lower()

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?",
                (clean_email,),
            )
            user_row = cursor.fetchone()

        if not user_row:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password. Please check your credentials.",
            )

        if not AuthService.verify_password(payload.password, user_row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password. Please check your credentials.",
            )

        user_schema = UserResponseSchema(
            id=user_row["id"],
            name=user_row["name"],
            email=user_row["email"],
            created_at=user_row["created_at"],
        )

        token = AuthService.create_access_token(user_id=user_row["id"], email=clean_email)

        return AuthTokenResponseSchema(
            access_token=token,
            token_type="bearer",
            user=user_schema,
        )

    @staticmethod
    def get_user_from_token(authorization: Optional[str]) -> UserResponseSchema:
        """Extract and validate Bearer token from Authorization header."""
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required. Please sign in to access this feature.",
            )

        token = authorization.split("Bearer ", 1)[1].strip()
        payload = AuthService.decode_access_token(token)

        user_id = payload.get("sub")
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, name, email, created_at FROM users WHERE id = ?",
                (user_id,),
            )
            user_row = cursor.fetchone()

        if not user_row:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account no longer exists. Please sign in again.",
            )

        return UserResponseSchema(
            id=user_row["id"],
            name=user_row["name"],
            email=user_row["email"],
            created_at=user_row["created_at"],
        )

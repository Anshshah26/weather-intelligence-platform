import os
from pathlib import Path
from dotenv import load_dotenv

# Locate root directory and load .env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"

if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()


class Settings:
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "").strip()
    OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"
    RADAR_PROVIDER: str = os.getenv("RADAR_PROVIDER", "openweather_global_precipitation").strip()
    AI_API_KEY: str = os.getenv("AI_API_KEY", "").strip()
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini").strip()
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "weather_intel_secure_jwt_secret_key_2026_x89a").strip()


settings = Settings()

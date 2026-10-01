from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import weather, ai, activities, travel, comparison, auth
from app.db import init_db

# Initialize SQLite database schema
init_db()

app = FastAPI(
    title="Weather Intelligence Platform API",
    description="Backend API services for Weather Intelligence Platform",
    version="0.3.0",
)

import os

frontend_url = os.getenv("FRONTEND_URL", "").strip()
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
if frontend_url:
    allowed_origins.append(frontend_url)
    if frontend_url.endswith('/'):
        allowed_origins.append(frontend_url.rstrip('/'))
    else:
        allowed_origins.append(f"{frontend_url}/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if frontend_url else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(weather.router)
app.include_router(ai.router)
app.include_router(activities.router)
app.include_router(travel.router)
app.include_router(comparison.router)


@app.get("/")
def read_root() -> Dict[str, str]:
    """Root endpoint welcome message."""
    return {
        "title": "Weather Intelligence Platform API",
        "docs": "/docs",
        "health": "/api/health",
        "weather_current": "/api/weather/current?city=Mumbai",
    }


@app.get("/api/health")
def health_check() -> Dict[str, str]:
    """Health check endpoint to verify backend operational status."""
    return {
        "status": "ok",
        "message": "Weather Intelligence Platform API is running",
    }

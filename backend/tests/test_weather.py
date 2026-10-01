from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify GET /api/health endpoint returns status ok."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "Weather Intelligence Platform API" in data["message"]


def test_weather_missing_city_parameter():
    """Verify GET /api/weather/current without city returns 400 Bad Request."""
    response = client.get("/api/weather/current")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_weather_empty_city_parameter():
    """Verify GET /api/weather/current with whitespace city returns 400 Bad Request."""
    response = client.get("/api/weather/current?city=%20%20")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_hourly_missing_city_parameter():
    """Verify GET /api/weather/hourly without city returns 400 Bad Request."""
    response = client.get("/api/weather/hourly")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_daily_missing_city_parameter():
    """Verify GET /api/weather/daily without city returns 400 Bad Request."""
    response = client.get("/api/weather/daily")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_map_tiles_invalid_layer():
    """Verify GET /api/weather/tiles with invalid layer returns 400 Bad Request."""
    response = client.get("/api/weather/tiles/invalid_layer_name/0/0/0.png")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data

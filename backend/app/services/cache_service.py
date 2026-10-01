import time
import logging
import asyncio
from typing import Any, Optional, Dict, Tuple

logger = logging.getLogger("app.cache")
logger.setLevel(logging.INFO)


class TTLCacheEntry:

    def __init__(self, data: Any, ttl_seconds: float):
        self.data = data
        self.expires_at = time.time() + ttl_seconds
        self.created_at = time.strftime("%Y-%m-%d %H:%M:%S")

    def is_expired(self) -> bool:
        return time.time() > self.expires_at


class TTLCacheManager:

    def __init__(self, max_entries: int = 1000):
        self._cache: Dict[str, TTLCacheEntry] = {}
        self._max_entries = max_entries
        self._locks: Dict[str, asyncio.Lock] = {}
        self._global_lock = asyncio.Lock()

    def _normalize_city(self, city: str) -> str:
        return city.strip().lower() if city else "unknown"

    def _normalize_coords(self, lat: float, lon: float) -> str:
        return f"{round(float(lat), 2)}:{round(float(lon), 2)}"

    def make_city_key(self, prefix: str, city: str) -> str:
        return f"{prefix}:{self._normalize_city(city)}"

    def make_coords_key(self, prefix: str, lat: float, lon: float) -> str:
        return f"{prefix}:{self._normalize_coords(lat, lon)}"

    def get(self, key: str, bypass_cache: bool = False) -> Optional[Any]:
        if bypass_cache:
            logger.info(f"[CACHE BYPASS] key={key}")
            return None

        entry = self._cache.get(key)
        if entry is None:
            logger.info(f"[CACHE MISS] key={key}")
            return None

        if entry.is_expired():
            logger.info(f"[CACHE EXPIRED] key={key}")
            del self._cache[key]
            return None

        logger.info(f"[CACHE HIT] key={key}")
        return entry.data

    def get_stale_fallback(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry is not None:
            logger.info(f"[CACHE STALE FALLBACK] Returning stale data for key={key}")
            return entry.data
        return None

    def set(self, key: str, data: Any, ttl_seconds: float) -> None:
        # Enforce memory capacity protection
        if len(self._cache) >= self._max_entries:
            self._cleanup_expired_or_oldest()

        self._cache[key] = TTLCacheEntry(data=data, ttl_seconds=ttl_seconds)
        logger.info(f"[CACHE STORE] key={key} ttl={ttl_seconds}s")

    def invalidate(self, key: str) -> None:
        if key in self._cache:
            del self._cache[key]
            logger.info(f"[CACHE INVALIDATE] key={key}")

    def _cleanup_expired_or_oldest(self) -> None:
        # Evict expired entries first
        now = time.time()
        expired_keys = [k for k, v in self._cache.items() if now > v.expires_at]
        for k in expired_keys:
            del self._cache[k]

        # If still at capacity, evict oldest entry
        if len(self._cache) >= self._max_entries:
            oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k].expires_at)
            del self._cache[oldest_key]
            logger.info(f"[CACHE EVICT CAPACITY] Evicted key={oldest_key}")

    async def get_lock_for_key(self, key: str) -> asyncio.Lock:
        async with self._global_lock:
            if key not in self._locks:
                self._locks[key] = asyncio.Lock()
            return self._locks[key]


# Singleton Cache Instance for Application
ttl_cache = TTLCacheManager(max_entries=1000)

# Recommended TTL constants (in seconds)
TTL_CURRENT_WEATHER = 300       # 5 minutes
TTL_HOURLY_FORECAST = 600       # 10 minutes
TTL_DAILY_FORECAST = 600        # 10 minutes
TTL_AIR_QUALITY = 600           # 10 minutes
TTL_COORDINATES = 86400         # 24 hours
TTL_RADAR_CAPABILITY = 3600     # 1 hour
TTL_CITY_SUGGESTIONS = 900      # 15 minutes

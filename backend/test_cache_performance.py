import time
import asyncio
import httpx

BASE_URL = "http://localhost:8000"

async def test_endpoint(name: str, url: str):
    async with httpx.AsyncClient() as client:
        # First request (Cache Miss / External Fetch)
        t0 = time.perf_counter()
        res1 = await client.get(url)
        t1 = time.perf_counter()
        time1_ms = round((t1 - t0) * 1000, 2)

        # Second request (Cache Hit / Immediate Return)
        t2 = time.perf_counter()
        res2 = await client.get(url)
        t3 = time.perf_counter()
        time2_ms = round((t3 - t2) * 1000, 2)

        print(f"{name}:")
        print(f"  First:  {time1_ms} ms (Status: {res1.status_code})")
        print(f"  Second: {time2_ms} ms (Status: {res2.status_code})")
        return time1_ms, time2_ms

async def test_location_switching():
    print("\nLocation Switch Test (Mumbai -> Delhi -> Mumbai):")
    async with httpx.AsyncClient() as client:
        # 1. Mumbai (Cache Miss)
        t0 = time.perf_counter()
        r1 = await client.get(f"{BASE_URL}/api/weather/current?city=Mumbai")
        t1 = time.perf_counter()

        # 2. Delhi (Cache Miss)
        t2 = time.perf_counter()
        r2 = await client.get(f"{BASE_URL}/api/weather/current?city=Delhi")
        t3 = time.perf_counter()

        # 3. Return to Mumbai (Cache Hit)
        t4 = time.perf_counter()
        r3 = await client.get(f"{BASE_URL}/api/weather/current?city=Mumbai")
        t5 = time.perf_counter()

        city1 = r1.json().get("location", {}).get("city")
        city2 = r2.json().get("location", {}).get("city")
        city3 = r3.json().get("location", {}).get("city")

        print(f"  Req 1 (Mumbai): {round((t1 - t0)*1000, 2)} ms -> Returned {city1}")
        print(f"  Req 2 (Delhi):  {round((t3 - t2)*1000, 2)} ms -> Returned {city2}")
        print(f"  Req 3 (Mumbai): {round((t5 - t4)*1000, 2)} ms -> Returned {city3}")

async def test_concurrent_requests():
    print("\nConcurrent Request Test (5 simultaneous requests for Surat):")
    async with httpx.AsyncClient() as client:
        t0 = time.perf_counter()
        tasks = [client.get(f"{BASE_URL}/api/weather/current?city=Surat") for _ in range(5)]
        results = await asyncio.gather(*tasks)
        t1 = time.perf_counter()
        total_time_ms = round((t1 - t0) * 1000, 2)
        statuses = [r.status_code for r in results]
        print(f"  5 Parallel Requests finished in {total_time_ms} ms (Statuses: {statuses})")

async def main():
    print("=== WEATHER INTELLIGENCE PLATFORM CACHE PERFORMANCE BENCHMARK ===")
    await test_endpoint("Current Weather", f"{BASE_URL}/api/weather/current?city=Mumbai&refresh=true")
    await test_endpoint("Hourly Forecast", f"{BASE_URL}/api/weather/hourly?city=Mumbai&refresh=true")
    await test_endpoint("Daily Forecast", f"{BASE_URL}/api/weather/daily?city=Mumbai&refresh=true")
    await test_endpoint("Air Quality", f"{BASE_URL}/api/weather/air-quality?city=Mumbai&refresh=true")
    await test_endpoint("Coordinates", f"{BASE_URL}/api/weather/coordinates?lat=19.076&lon=72.8777&refresh=true")
    await test_endpoint("Radar Capability Check", f"{BASE_URL}/api/weather/radar?refresh=true")
    await test_location_switching()
    await test_concurrent_requests()

if __name__ == "__main__":
    asyncio.run(main())

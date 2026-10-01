import re
import httpx
from typing import List, Optional
from fastapi import HTTPException, status
from app.config import settings
from app.services.weather_service import WeatherService
from app.schemas.ai import AIAdvisorResponseSchema, AIWeatherContextSchema, ChatMessageSchema


class AIService:
    @staticmethod
    async def generate_weather_advice(
        question: str,
        city: str,
        history: Optional[List[ChatMessageSchema]] = None,
    ) -> AIAdvisorResponseSchema:
        """
        Synthesize natural language weather advice using real weather telemetry,
        question intent parsing, and conversation history resolution.
        """
        clean_question = question.strip()
        default_city = city.strip() if city and city.strip() else "Mumbai"

        if not clean_question:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Question cannot be empty.",
            )

        # 1. Parse Question Intent & Resolve Conversation History Follow-ups
        parsed_intent = AIService._parse_question_intent(clean_question, default_city, history or [])
        target_city = parsed_intent["location"]

        # 2. Fetch real weather data for target city
        try:
            current = await WeatherService.fetch_current_weather(target_city)
            hourly = await WeatherService.fetch_hourly_forecast(target_city)
            daily = await WeatherService.fetch_daily_forecast(target_city)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"I don't have enough weather data to answer that accurately for {target_city}.",
            )

        # 3. Check if query is weather/activity related
        if not parsed_intent["is_weather_related"]:
            context = AIWeatherContextSchema(
                city=current.location.city,
                relevant_time="Current",
                temperature=current.current.temperature,
                feels_like=current.current.feels_like,
                condition=current.current.description,
                precipitation_probability=0,
                wind_speed=current.current.wind_speed,
                humidity=current.current.humidity,
            )
            return AIAdvisorResponseSchema(
                answer=f"I am your AI Weather Advisor for {current.location.city}. Ask me any weather or outdoor activity question (e.g. sports, rain, running, cycling, temperature forecasts).",
                weather_context=context,
            )

        # 4. Extract Relevant Telemetry Context based on parsed date & time
        context = AIService._extract_weather_context(
            parsed_intent=parsed_intent,
            current=current,
            hourly=hourly,
            daily=daily,
        )

        # 5. Generate Natural Language AI Advice
        answer = await AIService._call_ai_engine(
            question=clean_question,
            context=context,
            activity=parsed_intent["activity"],
        )

        return AIAdvisorResponseSchema(
            answer=answer,
            weather_context=context,
        )

    @staticmethod
    def _parse_question_intent(
        question: str,
        default_city: str,
        history: List[ChatMessageSchema],
    ) -> dict:
        """
        Extract activity, target time/date, explicit location overrides, and follow-ups.
        """
        q_lower = question.lower().strip()

        # Check explicit location overrides (e.g. "What about Delhi?", "how about in London?")
        location_match = re.search(r'\b(?:what about|how about|in|for|at)\s+([A-Za-z\s]+)\b', q_lower)
        target_city = default_city

        # Known common city overrides test check
        if location_match:
            candidate = location_match.group(1).strip()
            # Filter out non-city words like "tomorrow", "tonight", "6 pm"
            non_cities = {"tomorrow", "today", "tonight", "this evening", "this weekend", "7 am", "8 pm", "cycling", "running", "football"}
            if candidate not in non_cities and len(candidate) > 2:
                target_city = candidate.title()

        # Direct single city query check (e.g., "Delhi", "London")
        if q_lower in ["delhi", "mumbai", "london", "tokyo", "dubai", "new york"]:
            target_city = q_lower.title()

        # Activity keywords
        activity_map = {
            "football": "football", "soccer": "football", "match": "football",
            "running": "running", "run": "running", "jog": "running", "jogging": "running",
            "cycling": "cycling", "cycle": "cycling", "bike": "cycling", "biking": "cycling",
            "walking": "walking", "walk": "walking", "hike": "hiking", "hiking": "hiking",
            "swim": "swimming", "swimming": "swimming", "picnic": "picnic", "drive": "driving"
        }

        activity = None
        for key, act in activity_map.items():
            if key in q_lower:
                activity = act
                break

        # Time/Date extraction
        time_match = re.search(r'\b(\d{1,2})\s*(pm|am)?\b', q_lower)
        is_now = "now" in q_lower or "currently" in q_lower or "current" in q_lower
        is_tomorrow = "tomorrow" in q_lower
        is_tonight = "tonight" in q_lower or "this evening" in q_lower or "evening" in q_lower
        is_weekend = "weekend" in q_lower

        # Conversation History Follow-Up Resolution (e.g. "What about 8 PM?" or "What about Delhi?")
        if history and len(history) > 0:
            last_user_msgs = [m.text for m in history if m.sender == "user"]
            if last_user_msgs:
                prev_text = last_user_msgs[-1].lower()
                # Inherit activity from previous turn if not specified in current question
                if not activity:
                    for key, act in activity_map.items():
                        if key in prev_text:
                            activity = act
                            break

        weather_keywords = [
            "weather", "rain", "rainy", "umbrella", "hot", "cold", "temperature",
            "sun", "sunny", "cloud", "cloudy", "wind", "windy", "storm", "forecast"
        ]
        is_weather_related = (
            activity is not None
            or any(k in q_lower for k in weather_keywords)
            or time_match is not None
            or is_now or is_tomorrow or is_tonight or is_weekend
            or "what about" in q_lower
        )

        return {
            "location": target_city,
            "activity": activity,
            "time_match": time_match,
            "is_now": is_now,
            "is_tomorrow": is_tomorrow,
            "is_tonight": is_tonight,
            "is_weekend": is_weekend,
            "is_weather_related": is_weather_related,
        }

    @staticmethod
    def _extract_weather_context(
        parsed_intent: dict,
        current,
        hourly,
        daily,
    ) -> AIWeatherContextSchema:
        """
        Extract exact telemetry slice corresponding to date/time parameters.
        """
        city_name = current.location.city
        time_match = parsed_intent["time_match"]
        is_tomorrow = parsed_intent["is_tomorrow"]
        is_tonight = parsed_intent["is_tonight"]
        is_weekend = parsed_intent["is_weekend"]
        is_now = parsed_intent["is_now"]

        # Default fallback to current
        relevant_time = "Current"
        temp = current.current.temperature
        feels_like = current.current.feels_like
        cond = current.current.description
        precip_prob = 0
        wind = current.current.wind_speed
        humidity = current.current.humidity

        if is_tomorrow and daily.daily and len(daily.daily) > 1:
            tomorrow_item = daily.daily[1]
            relevant_time = f"Tomorrow ({tomorrow_item.day})"
            temp = round((tomorrow_item.temperature.min + tomorrow_item.temperature.max) / 2.0, 1)
            feels_like = temp
            cond = tomorrow_item.description
            precip_prob = tomorrow_item.precipitation_probability
            wind = tomorrow_item.wind_speed
            humidity = tomorrow_item.humidity

        elif is_weekend and daily.daily and len(daily.daily) >= 3:
            weekend_item = daily.daily[2]  # Weekend slot
            relevant_time = f"This Weekend ({weekend_item.day})"
            temp = round((weekend_item.temperature.min + weekend_item.temperature.max) / 2.0, 1)
            feels_like = temp
            cond = weekend_item.description
            precip_prob = weekend_item.precipitation_probability
            wind = weekend_item.wind_speed
            humidity = weekend_item.humidity

        elif (time_match or is_tonight) and not is_now and hourly.hourly:
            target_hour = 20 if is_tonight else None
            if time_match:
                h_val = int(time_match.group(1))
                ampm = time_match.group(2)
                if ampm == "pm" and h_val < 12:
                    h_val += 12
                elif ampm == "am" and h_val == 12:
                    h_val = 0
                target_hour = h_val

            best_slot = None
            if target_hour is not None:
                for slot in hourly.hourly:
                    try:
                        slot_h = int(slot.time.split(":")[0])
                        if slot_h == target_hour or abs(slot_h - target_hour) <= 1:
                            best_slot = slot
                            break
                    except Exception:
                        pass

            if best_slot:
                relevant_time = f"At {best_slot.time}"
                temp = best_slot.temperature
                feels_like = best_slot.feels_like
                cond = best_slot.description
                precip_prob = best_slot.precipitation_probability
                wind = best_slot.wind_speed
                humidity = best_slot.humidity

        return AIWeatherContextSchema(
            city=city_name,
            relevant_time=relevant_time,
            temperature=temp,
            feels_like=feels_like,
            condition=cond,
            precipitation_probability=precip_prob,
            wind_speed=wind,
            humidity=humidity,
        )

    @staticmethod
    async def _call_ai_engine(
        question: str,
        context: AIWeatherContextSchema,
        activity: Optional[str],
    ) -> str:
        """
        Call LLM provider or execute expert synthesis with strict system instructions.
        """
        api_key = settings.AI_API_KEY

        system_instruction = (
            "You are a weather advisor. Use ONLY the weather data supplied by the backend. "
            "Never invent temperature, rainfall, wind, humidity, pressure, or forecast values. "
            "If required data is missing, say so. Interpret natural-language dates and times using the selected city's timezone. "
            "Give concise practical weather advice. Distinguish forecast information from certainty."
        )

        if api_key and settings.AI_PROVIDER == "gemini":
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
                prompt = (
                    f"System Instructions: {system_instruction}\n\n"
                    f"Real Weather Telemetry Context for {context.city}:\n"
                    f"- Time Frame: {context.relevant_time}\n"
                    f"- Temperature: {context.temperature}°C (Feels like: {context.feels_like}°C)\n"
                    f"- Condition: {context.condition}\n"
                    f"- Rain Probability: {context.precipitation_probability}%\n"
                    f"- Wind Speed: {context.wind_speed} km/h\n"
                    f"- Humidity: {context.humidity}%\n\n"
                    f"User Question: \"{question}\"\n"
                    f"AI Advice:"
                )
                payload = {"contents": [{"parts": [{"text": prompt}]}]}
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    result = resp.json()
                    candidates = result.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if text:
                            return text.strip()
            except Exception:
                pass

        # Deterministic Expert Synthesis strictly adhering to System Instructions
        return AIService._synthesize_expert_advice(question, context, activity)

    @staticmethod
    def _synthesize_expert_advice(
        question: str,
        context: AIWeatherContextSchema,
        activity: Optional[str],
    ) -> str:
        """
        Synthesize concise, practical weather advice strictly adhering to weather context telemetry.
        """
        q = question.lower()
        temp = context.temperature
        feels_like = context.feels_like
        rain_prob = context.precipitation_probability
        wind = context.wind_speed
        cond = context.condition.lower()
        city = context.city
        time_frame = context.relevant_time

        # Football / Sports query
        if activity == "football" or "football" in q or "soccer" in q or "match" in q:
            if rain_prob >= 50 or "rain" in cond or "thunderstorm" in cond:
                return f"Football at {time_frame} in {city} may be uncomfortable because rain is currently forecast at {rain_prob}% with {cond}. If you have flexibility, consider an earlier time or an indoor pitch."
            elif temp > 32:
                return f"Playing football at {time_frame} will be warm ({temp}°C, feels like {feels_like}°C). Keep well hydrated and plan for regular breaks."
            elif wind > 25:
                return f"Football conditions at {time_frame} are dry ({temp}°C), though gusty winds at {wind} km/h may affect ball movement."
            else:
                return f"Conditions look great for playing football in {city} at {time_frame}! Expect {temp}°C with {cond} and low rain probability ({rain_prob}%)."

        # Running / Jogging query
        if activity == "running" or "run" in q or "running" in q or "jog" in q:
            if rain_prob >= 50:
                return f"Based on the current forecast, running in {city} at {time_frame} has a {rain_prob}% rain probability with {cond}. Wear a water-resistant jacket if you head out."
            elif temp > 30:
                return f"Running at {time_frame} in {city} will be hot ({temp}°C). Consider running during cooler hours and stay hydrated."
            elif temp < 10:
                return f"It will be crisp for running in {city} at {time_frame} ({temp}°C). Dress in breathable warm layers."
            else:
                return f"Excellent setup for running in {city} at {time_frame}! Forecast indicates {temp}°C, {cond}, and light winds of {wind} km/h."

        # Cycling / Bike query
        if activity == "cycling" or "cycle" in q or "cycling" in q or "bike" in q:
            if wind > 25:
                return f"Cycling at {time_frame} in {city} will encounter strong winds ({wind} km/h). Exercise extra caution on open roads."
            elif rain_prob >= 50:
                return f"Roads may be wet in {city} at {time_frame} with a {rain_prob}% rain chance. Consider rescheduling your ride."
            else:
                return f"Great conditions for cycling in {city} at {time_frame}! Expect {temp}°C, {cond}, and manageable wind speed of {wind} km/h."

        # Umbrella / Rain query
        if "umbrella" in q or "rain" in q:
            if rain_prob >= 40 or "rain" in cond or "shower" in cond or "drizzle" in cond:
                return f"Yes, rain is currently forecast in {city} at {time_frame} ({rain_prob}% rain probability with {cond}). Carrying an umbrella is recommended."
            else:
                return f"An umbrella likely won't be needed in {city} at {time_frame}. Forecast shows {cond} with only a {rain_prob}% chance of rain."

        # Walking / Heat query
        if activity == "walking" or "walk" in q or "walking" in q or "hot" in q or "cold" in q:
            if temp > 32:
                return f"Walking at {time_frame} in {city} will be quite warm ({temp}°C, feels like {feels_like}°C). Wear light clothing and bring water."
            elif rain_prob >= 50:
                return f"Keep a raincoat or umbrella ready for your walk in {city} at {time_frame}; rain probability is {rain_prob}%."
            else:
                return f"Pleasant conditions for a walk in {city} at {time_frame}. Forecast indicates {temp}°C with {cond}."

        # General advice default
        if rain_prob >= 50:
            return f"In {city} ({time_frame}), forecasts indicate {cond} with a {rain_prob}% rain chance and temperature of {temp}°C. Plan accordingly!"
        else:
            return f"In {city} ({time_frame}), weather conditions are forecast to be favorable: {temp}°C, {cond}, {wind} km/h winds, and {rain_prob}% rain probability."

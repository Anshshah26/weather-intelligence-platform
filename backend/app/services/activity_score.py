import re
from typing import List, Dict, Tuple
from app.schemas.activities import ActivityScoreResponseSchema, ActivityWeatherSummarySchema


# Centralized Weather Thresholds Configuration
THRESHOLDS = {
    "TEMP_OPTIMAL_LOW": 14.0,
    "TEMP_OPTIMAL_HIGH": 24.0,
    "TEMP_HIGH": 32.0,
    "TEMP_EXTREME_HIGH": 38.0,
    "TEMP_LOW": 8.0,
    "TEMP_EXTREME_LOW": 2.0,
    "WIND_MODERATE": 18.0,
    "WIND_STRONG": 25.0,
    "WIND_EXTREME": 45.0,
    "RAIN_MODERATE": 30,
    "RAIN_HIGH": 50,
    "RAIN_EXTREME": 80,
    "HUMIDITY_HIGH": 75,
    "HUMIDITY_EXTREME": 90,
}


class ActivityScoreService:
    SUPPORTED_ACTIVITIES = {
        "running": "Running",
        "football": "Football",
        "walking": "Walking",
        "cycling": "Cycling",
        "cricket": "Cricket",
        "hiking": "Hiking",
        "outdoor_workout": "Outdoor Workout",
        "picnic": "Picnic",
    }

    @staticmethod
    def calculate_score(
        activity_key: str,
        weather: dict,
    ) -> ActivityScoreResponseSchema:
        """
        Calculate a deterministic suitability score (0-100) for a given activity
        based on real weather parameters.
        """
        normalized_act = activity_key.lower().replace(" ", "_").replace("-", "_")

        # Fallback to walking if unknown activity
        if normalized_act not in ActivityScoreService.SUPPORTED_ACTIVITIES:
            normalized_act = "walking"

        act_label = ActivityScoreService.SUPPORTED_ACTIVITIES[normalized_act]

        temp = float(weather.get("temperature", 22.0))
        feels_like = float(weather.get("feels_like", temp))
        rain_prob = int(weather.get("precipitation_probability", 0))
        wind = float(weather.get("wind_speed", 10.0))
        humidity = int(weather.get("humidity", 50))
        cond = str(weather.get("condition", "Clear")).strip()
        city = str(weather.get("city", "Selected Location"))
        time_str = str(weather.get("time", "Current"))

        reasons: List[str] = []
        warnings: List[str] = []

        # Execute activity-specific scoring logic
        score = 100

        if normalized_act == "running":
            score, reasons, warnings = ActivityScoreService._score_running(temp, rain_prob, wind, humidity, cond)
        elif normalized_act == "football":
            score, reasons, warnings = ActivityScoreService._score_football(temp, rain_prob, wind, humidity, cond)
        elif normalized_act == "walking":
            score, reasons, warnings = ActivityScoreService._score_walking(temp, rain_prob, wind, humidity, cond)
        elif normalized_act == "cycling":
            score, reasons, warnings = ActivityScoreService._score_cycling(temp, rain_prob, wind, humidity, cond)
        elif normalized_act == "cricket":
            score, reasons, warnings = ActivityScoreService._score_cricket(temp, rain_prob, wind, humidity, cond)
        elif normalized_act == "hiking":
            score, reasons, warnings = ActivityScoreService._score_hiking(temp, rain_prob, wind, humidity, cond)
        elif normalized_act == "outdoor_workout":
            score, reasons, warnings = ActivityScoreService._score_outdoor_workout(temp, rain_prob, wind, humidity, cond)
        elif normalized_act == "picnic":
            score, reasons, warnings = ActivityScoreService._score_picnic(temp, rain_prob, wind, humidity, cond)

        # Clamp score strictly between 0 and 100
        final_score = max(0, min(100, int(round(score))))

        # Determine application category
        category = ActivityScoreService._get_category(final_score)

        # Synthesize AI natural language explanation
        ai_exp = ActivityScoreService._generate_explanation(
            act_label=act_label,
            score=final_score,
            category=category,
            reasons=reasons,
            warnings=warnings,
            city=city,
            time_str=time_str,
            temp=temp,
            rain_prob=rain_prob,
        )

        weather_summary = ActivityWeatherSummarySchema(
            city=city,
            time=time_str,
            temperature=round(temp, 1),
            condition=cond,
            precipitation_probability=rain_prob,
            wind_speed=round(wind, 1),
            humidity=humidity,
        )

        return ActivityScoreResponseSchema(
            activity=act_label,
            score=final_score,
            category=category,
            reasons=reasons,
            warnings=warnings,
            weather_summary=weather_summary,
            ai_explanation=ai_exp,
        )

    @staticmethod
    def _get_category(score: int) -> str:
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Moderate"
        elif score >= 20:
            return "Poor"
        else:
            return "Very Poor"

    # --- ACTIVITY SCORING LOGIC IMPLEMENTATIONS ---

    @staticmethod
    def _score_running(temp: float, rain: int, wind: float, humidity: int, cond: str) -> Tuple[float, List[str], List[str]]:
        score = 100.0
        r, w = [], []

        # Temperature (Optimal: 12-20°C)
        if 12.0 <= temp <= 20.0:
            r.append("Optimal running temperature")
        elif temp > 32.0:
            score -= 35
            w.append("High heat warning for running")
        elif temp > 26.0:
            score -= 15
            w.append("Warm temperature may increase fatigue")
        elif temp < 5.0:
            score -= 20
            w.append("Chilly temperatures requiring thermal gear")
        else:
            r.append("Comfortable temperature")

        # Rain
        if rain >= 70 or "thunderstorm" in cond.lower():
            score -= 40
            w.append("Heavy rain/storm expected")
        elif rain >= 40 or "rain" in cond.lower():
            score -= 20
            w.append("Rain likely during workout")
        else:
            r.append("Low chance of rain")

        # Wind
        if wind >= THRESHOLDS["WIND_STRONG"]:
            score -= 15
            w.append("Strong wind resistance")
        else:
            r.append("Moderate wind conditions")

        # Humidity
        if humidity >= THRESHOLDS["HUMIDITY_HIGH"]:
            score -= 10
            w.append("High humidity may affect cooling")

        return score, r, w

    @staticmethod
    def _score_football(temp: float, rain: int, wind: float, humidity: int, cond: str) -> Tuple[float, List[str], List[str]]:
        score = 100.0
        r, w = [], []

        # Rain (Heavy penalty for wet pitch)
        if rain >= 60 or "thunderstorm" in cond.lower():
            score -= 45
            w.append("Wet or slippery pitch conditions")
        elif rain >= 30:
            score -= 20
            w.append("Drizzle/light rain possible")
        else:
            r.append("Dry pitch forecast")

        # Wind (Heavy penalty for ball trajectory)
        if wind >= THRESHOLDS["WIND_STRONG"]:
            score -= 25
            w.append("Gusty winds affecting ball trajectory")
        else:
            r.append("Favorable wind speed")

        # Temperature
        if temp > 33.0:
            score -= 25
            w.append("Hot conditions require extra hydration breaks")
        elif 15.0 <= temp <= 25.0:
            r.append("Ideal match temperature")

        return score, r, w

    @staticmethod
    def _score_walking(temp: float, rain: int, wind: float, humidity: int, cond: str) -> Tuple[float, List[str], List[str]]:
        score = 100.0
        r, w = [], []

        if 16.0 <= temp <= 25.0:
            r.append("Pleasant walking temperature")
        elif temp > 33.0:
            score -= 30
            w.append("Hot weather for walking")
        elif temp < 8.0:
            score -= 15
            w.append("Cold walking conditions")

        if rain >= 50:
            score -= 35
            w.append("Rain expected; bring umbrella/raincoat")
        else:
            r.append("Low rain probability")

        if wind >= THRESHOLDS["WIND_STRONG"]:
            score -= 15
            w.append("Breezy conditions")

        return score, r, w

    @staticmethod
    def _score_cycling(temp: float, rain: int, wind: float, humidity: int, cond: str) -> Tuple[float, List[str], List[str]]:
        score = 100.0
        r, w = [], []

        # Wind is top factor for cycling
        if wind >= THRESHOLDS["WIND_STRONG"]:
            score -= 35
            w.append("Strong headwinds expected")
        elif wind >= THRESHOLDS["WIND_MODERATE"]:
            score -= 15
            w.append("Moderate winds")
        else:
            r.append("Calm wind for smooth riding")

        if rain >= 50:
            score -= 35
            w.append("Slippery road surfaces")
        else:
            r.append("Dry road conditions")

        if temp > 32.0:
            score -= 20
            w.append("Warm riding conditions")
        elif 15.0 <= temp <= 24.0:
            r.append("Ideal cycling temperature")

        return score, r, w

    @staticmethod
    def _score_cricket(temp: float, rain: int, wind: float, humidity: int, cond: str) -> Tuple[float, List[str], List[str]]:
        score = 100.0
        r, w = [], []

        if rain >= 40 or "rain" in cond.lower():
            score -= 50
            w.append("High risk of rain interruptions")
        else:
            r.append("Clear play window forecast")

        if wind >= THRESHOLDS["WIND_STRONG"]:
            score -= 20
            w.append("High wind speed")

        if temp > 35.0:
            score -= 25
            w.append("Extreme heat on the field")
        else:
            r.append("Good match weather")

        return score, r, w

    @staticmethod
    def _score_hiking(temp: float, rain: int, wind: float, humidity: int, cond: str) -> Tuple[float, List[str], List[str]]:
        score = 100.0
        r, w = [], []

        if rain >= 50 or "thunderstorm" in cond.lower():
            score -= 40
            w.append("Muddy trails and rain risk")
        else:
            r.append("Clear trail conditions")

        if wind >= THRESHOLDS["WIND_STRONG"]:
            score -= 25
            w.append("High ridge winds")

        if temp > 32.0:
            score -= 25
            w.append("Hot trail conditions")
        elif 12.0 <= temp <= 22.0:
            r.append("Excellent hiking temperature")

        return score, r, w

    @staticmethod
    def _score_outdoor_workout(temp: float, rain: int, wind: float, humidity: int, cond: str) -> Tuple[float, List[str], List[str]]:
        score = 100.0
        r, w = [], []

        if temp > 33.0 or humidity >= THRESHOLDS["HUMIDITY_HIGH"]:
            score -= 30
            w.append("High heat/humidity combination")
        elif 16.0 <= temp <= 25.0:
            r.append("Comfortable workout climate")

        if rain >= 40:
            score -= 30
            w.append("Wet workout area")
        else:
            r.append("Dry outdoor area")

        return score, r, w

    @staticmethod
    def _score_picnic(temp: float, rain: int, wind: float, humidity: int, cond: str) -> Tuple[float, List[str], List[str]]:
        score = 100.0
        r, w = [], []

        if rain >= 40:
            score -= 45
            w.append("High chance of rain spoiling picnic")
        else:
            r.append("Dry park conditions")

        if wind >= THRESHOLDS["WIND_STRONG"]:
            score -= 25
            w.append("Windy conditions")

        if 18.0 <= temp <= 27.0:
            r.append("Perfect picnic temperature")
        elif temp > 33.0:
            score -= 20
            w.append("Hot picnic weather")

        return score, r, w

    @staticmethod
    def _generate_explanation(
        act_label: str,
        score: int,
        category: str,
        reasons: List[str],
        warnings: List[str],
        city: str,
        time_str: str,
        temp: float,
        rain_prob: int,
    ) -> str:
        """
        Generate natural language explanation based on exact score and telemetry.
        """
        if warnings and len(warnings) > 0:
            warn_text = f" However, note that {warnings[0].lower()}."
        else:
            warn_text = ""

        if score >= 80:
            return f"Conditions in {city} at {time_str} are rated {category} ({score}/100) for {act_label}. {reasons[0] if reasons else 'Weather is favorable'}.{warn_text}"
        elif score >= 60:
            return f"Weather in {city} at {time_str} is rated {category} ({score}/100) for {act_label}.{warn_text}"
        elif score >= 40:
            return f"Conditions in {city} at {time_str} are rated {category} ({score}/100) for {act_label}. Caution is advised due to weather factors."
        else:
            return f"Weather in {city} at {time_str} is rated {category} ({score}/100) for {act_label}. Consider rescheduling or choosing an indoor alternative due to adverse weather."

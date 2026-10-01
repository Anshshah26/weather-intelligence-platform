const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
import { getAuthHeader } from './authApi';

export interface ChatHistoryItem {
  sender: 'user' | 'ai';
  text: string;
}

export interface AIWeatherContext {
  city: string;
  relevant_time: string;
  temperature: number;
  feels_like: number;
  condition: string;
  precipitation_probability: number;
  wind_speed: number;
  humidity: number;
}

export interface AIAdvisorResponse {
  answer: string;
  weather_context: AIWeatherContext;
}

export async function getAIWeatherAdvice(
  question: string,
  city: string,
  history: ChatHistoryItem[] = []
): Promise<AIAdvisorResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai/weather-advisor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      question: question.trim(),
      city: city.trim(),
      history: history.slice(-6), // Send last 6 turns for context
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.detail || "Sorry, I couldn't analyze the weather right now. Please try again.";
    throw new Error(message);
  }

  return response.json();
}

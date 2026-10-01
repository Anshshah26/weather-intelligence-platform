import { useState, FormEvent, useRef, useEffect } from 'react';
import { getAIWeatherAdvice, AIWeatherContext, ChatHistoryItem } from '../services/aiApi';
import { CurrentWeatherResponse } from '../types/weather';
import { Bot, User, Send, Sparkles, MapPin, RefreshCw, AlertCircle, HelpCircle, Thermometer, CloudRain, Wind, Droplets } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  weather_context?: AIWeatherContext;
}

interface AIAdvisorPageProps {
  currentCityWeather?: CurrentWeatherResponse | null;
}

export const AIAdvisorPage = ({ currentCityWeather }: AIAdvisorPageProps) => {
  const selectedCity = currentCityWeather?.location.city || 'Mumbai';
  const country = currentCityWeather?.location.country || 'IN';

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial welcome message from AI
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I am your AI Weather Advisor for ${selectedCity}, ${country}. Ask me any practical question about your outdoor plans, rain predictions, or activity timing!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestions = [
    'Can I play football at 6 PM?',
    'Can I go running tomorrow morning?',
    'Will it rain tonight?',
    'What will the weather be tomorrow?',
    'Will it be hot at 3 PM?',
    'Can I go cycling at 7 AM?',
    'What about 8 PM?',
    'What about Delhi?',
    'How is the weather now?',
    'Will it rain this weekend?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);
    setError(null);

    // Prepare history payload for follow-up resolution
    const historyPayload: ChatHistoryItem[] = newMessages.map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    try {
      const response = await getAIWeatherAdvice(query, selectedCity, historyPayload);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        weather_context: response.weather_context,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sorry, I couldn't analyze the weather right now. Please try again.");
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "Sorry, I couldn't analyze the weather right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputQuery);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto flex flex-col min-h-[500px] lg:h-[calc(100vh-5.5rem)] pb-2 max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-0.5">
            <Bot className="w-4 h-4 text-cyan-400" /> Weather Intelligence • AI Advisor
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            AI Weather Advisor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ask anything about your weather.
          </p>
        </div>

        {/* Location Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active City: <strong>{selectedCity}, {country}</strong></span>
        </div>
      </div>

      {/* Suggested Questions Quick Chips */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Test Prompts:
        </span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSendMessage(suggestion)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-300 transition-all shrink-0 disabled:opacity-50 text-left focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Error Alert Bar */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300 text-xs shrink-0" role="alert">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Chat Messages Container */}
      <div className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 overflow-y-auto space-y-4 custom-scrollbar shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const ctx = msg.weather_context;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-cyan-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Content */}
              <div
                className={`space-y-2 p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600/20 border border-cyan-500/30 text-slate-100 rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Weather Checked Panel (Directly below AI responses) */}
                {ctx && (
                  <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-semibold">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Weather checked:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl text-[11px] font-mono text-slate-300">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>📍 {ctx.city}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <span>🕕 {ctx.relevant_time}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Thermometer className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>🌡️ {ctx.temperature}°C</span>
                      </span>
                      <span className="flex items-center gap-1 truncate capitalize">
                        <span>☁️ {ctx.condition}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <CloudRain className="w-3 h-3 text-blue-400 shrink-0" />
                        <span>🌧️ {ctx.precipitation_probability}% rain</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Wind className="w-3 h-3 text-teal-400 shrink-0" />
                        <span>💨 {ctx.wind_speed} km/h</span>
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono ${
                    isUser ? 'text-cyan-300/60 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3 mr-auto max-w-xs">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce text-cyan-400" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none text-xs text-cyan-300 font-mono flex items-center gap-2 shadow-md">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Analyzing weather...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="shrink-0 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about your weather..."
            disabled={loading}
            aria-label="Ask AI Weather Advisor a question"
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/50 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          aria-label="Send question to AI Weather Advisor"
          className="flex items-center gap-2 px-5 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold text-xs sm:text-sm rounded-2xl transition-all disabled:opacity-40 shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-lg"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

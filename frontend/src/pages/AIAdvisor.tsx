import { useState, FormEvent, useRef, useEffect } from 'react';
import { getAIWeatherAdvice, AIWeatherContext, ChatHistoryItem } from '../services/aiApi';
import { CurrentWeatherResponse } from '../types/weather';
import { Bot, User, Send, Sparkles, MapPin, RefreshCw, AlertCircle, HelpCircle, Thermometer, CloudRain, Wind } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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

  const { language, t, translateCondition } = useLanguage();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial welcome message from AI
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `${t('welcomeAdvisorPrefix', 'Meteorological Advisor online for')} ${selectedCity}, ${country}. ${t(
        'welcomeAdvisorSuffix',
        'Inquire regarding outdoor scheduling, precipitation timing, thermal projections, or multi-city planning.'
      )}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Keep welcome message text synchronized with language switches
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === 'welcome-1'
          ? {
              ...m,
              text: `${t('welcomeAdvisorPrefix', 'Meteorological Advisor online for')} ${selectedCity}, ${country}. ${t(
                'welcomeAdvisorSuffix',
                'Inquire regarding outdoor scheduling, precipitation timing, thermal projections, or multi-city planning.'
              )}`,
            }
          : m
      )
    );
  }, [language, selectedCity, country, t]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestions = [
    t('queryFootball', 'Can I play football at 6 PM?'),
    t('queryRunning', 'Can I go running tomorrow morning?'),
    t('queryRainTonight', 'Will it rain tonight?'),
    t('queryWeatherTomorrow', 'What will the weather be tomorrow?'),
    t('queryHot3PM', 'Will it be hot at 3 PM?'),
    t('queryCycling7AM', 'Can I go cycling at 7 AM?'),
    t('queryAbout8PM', 'What about 8 PM?'),
    t('queryWeatherNow', 'How is the weather now?'),
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
      const fallbackErr = t('unableToAnalyze', 'Unable to analyze weather data at this time. Please retry.');
      setError(err instanceof Error ? err.message : fallbackErr);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: fallbackErr,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#18232D] border border-[#2B3945] p-4 rounded-xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#56CCF2] mb-0.5">
            <Bot className="w-3.5 h-3.5 text-[#2F80ED]" /> {t('advisoryStation', 'Advisory Intelligence Station')}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7F9] tracking-tight">
            {t('aiAdvisor', 'AI Weather Advisor')}
          </h1>
          <p className="text-xs text-[#9AA8B2] mt-0.5">
            {t('aiAdvisorSubtitle', 'Contextual advisory engine for activity scheduling and weather risk analysis')}
          </p>
        </div>

        {/* Location Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#101820] border border-[#2B3945] rounded-lg text-xs font-mono text-[#F4F7F9] shrink-0">
          <MapPin className="w-3.5 h-3.5 text-[#56CCF2]" />
          <span>{t('station', 'Station:')} <strong>{selectedCity}, {country}</strong></span>
        </div>
      </div>

      {/* Suggested Questions Quick Chips */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
        <span className="text-[10px] font-mono text-[#9AA8B2] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#2F80ED]" /> {t('queries', 'Queries:')}
        </span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSendMessage(suggestion)}
            disabled={loading}
            className="px-2.5 py-1 rounded-lg bg-[#18232D] hover:bg-[#24313C] border border-[#2B3945] hover:border-[#3A4A57] text-xs text-[#9AA8B2] hover:text-[#F4F7F9] transition-colors shrink-0 disabled:opacity-50 text-left"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Error Alert Bar */}
      {error && (
        <div className="p-3 bg-[#EB5757]/10 border border-[#EB5757]/30 rounded-lg flex items-center gap-2 text-[#EB5757] text-xs shrink-0" role="alert">
          <AlertCircle className="w-4 h-4 text-[#EB5757] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Chat Messages Container */}
      <div className="flex-1 bg-[#101820] border border-[#2B3945] rounded-xl p-4 overflow-y-auto space-y-4 no-scrollbar">
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
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-[#2F80ED] border-[#2F80ED] text-white'
                    : 'bg-[#24313C] border-[#2B3945] text-[#56CCF2]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble Content */}
              <div
                className={`space-y-2 p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#24313C] border border-[#2B3945] text-[#F4F7F9] rounded-tr-none'
                    : 'bg-[#18232D] border border-[#2B3945] text-[#F4F7F9] rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Weather Checked Panel */}
                {ctx && (
                  <div className="pt-2.5 border-t border-[#2B3945] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#56CCF2] font-semibold">
                      <HelpCircle className="w-3.5 h-3.5 text-[#2F80ED]" />
                      <span>{t('telemetryReferenced', 'Telemetry Referenced:')}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#101820] border border-[#2B3945] p-2.5 rounded-lg text-[11px] font-mono text-[#F4F7F9]">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#56CCF2] shrink-0" />
                        <span>{ctx.city}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate text-[#9AA8B2]">
                        <span>{ctx.relevant_time}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Thermometer className="w-3 h-3 text-[#F2C94C] shrink-0" />
                        <span>{ctx.temperature}°C</span>
                      </span>
                      <span className="flex items-center gap-1 truncate capitalize">
                        <span>{translateCondition(ctx.condition)}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <CloudRain className="w-3 h-3 text-[#56CCF2] shrink-0" />
                        <span>{ctx.precipitation_probability}% {t('rainLabel', 'rain')}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Wind className="w-3 h-3 text-[#27AE9B] shrink-0" />
                        <span>{ctx.wind_speed} km/h</span>
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono ${
                    isUser ? 'text-[#9AA8B2] text-right' : 'text-[#9AA8B2]'
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
            <div className="w-7 h-7 rounded-lg bg-[#24313C] border border-[#2B3945] text-[#56CCF2] flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#18232D] border border-[#2B3945] p-2.5 rounded-lg rounded-tl-none text-xs text-[#56CCF2] font-mono flex items-center gap-2 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2F80ED]" />
              <span>{t('analyzingTelemetry', 'Analyzing atmospheric telemetry...')}</span>
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
            placeholder={t('askAdvisor', 'Ask regarding weather conditions, timing, or outdoor plans...')}
            disabled={loading}
            aria-label={t('askAdvisor', 'Ask regarding weather conditions, timing, or outdoor plans...')}
            className="w-full bg-[#18232D] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          aria-label={t('submit', 'Submit')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2F80ED] hover:bg-[#2570d4] text-white font-medium text-xs sm:text-sm rounded-lg transition-colors disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t('submit', 'Submit')}</span>
        </button>
      </form>
    </div>
  );
};

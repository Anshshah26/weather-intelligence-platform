import { useState, useEffect } from 'react';
import { getUmbrellaAlert, UmbrellaAlertResponse } from '../../services/umbrellaApi';
import { Umbrella, Bell, BellOff, CloudRain, Sun, AlertTriangle, RefreshCw, Clock, MapPin } from 'lucide-react';

interface SmartUmbrellaWidgetProps {
  city: string;
}

export const SmartUmbrellaWidget = ({ city }: SmartUmbrellaWidgetProps) => {
  const [alertData, setAlertData] = useState<UmbrellaAlertResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('umbrella_notifications_enabled') === 'true';
  });

  // Fetch alert when city changes
  useEffect(() => {
    fetchAlert(city);
  }, [city]);

  const fetchAlert = async (targetCity: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUmbrellaAlert(targetCity);
      setAlertData(res);
      triggerBrowserNotificationIfEligible(res);
    } catch {
      setError('Rain alerts are temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setNotificationsEnabled(true);
          localStorage.setItem('umbrella_notifications_enabled', 'true');
          if (alertData) triggerBrowserNotificationIfEligible(alertData, true);
        } else {
          alert('Notification permission was denied in your browser settings. In-app alerts will remain active.');
        }
      } else {
        alert('Browser notifications are not supported in this browser.');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('umbrella_notifications_enabled', 'false');
    }
  };

  const triggerBrowserNotificationIfEligible = (res: UmbrellaAlertResponse, force = false) => {
    if (!notificationsEnabled && !force) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (!res.needed || res.status === 'low') return;

    // Deduplication Key: location + expected_time + status
    const dedupKey = `umbrella_dedup_${res.location}_${res.expected_time || 'soon'}_${res.status}`;
    const alreadySent = localStorage.getItem(dedupKey);

    if (!alreadySent || force) {
      new Notification(`☔ Rain Alert: ${res.location}`, {
        body: res.message,
        icon: '/favicon.ico',
        tag: dedupKey,
      });
      localStorage.setItem(dedupKey, 'true');
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Evaluating umbrella forecast for {city}...</span>
        </div>
      </div>
    );
  }

  if (error || !alertData) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-2 text-xs text-slate-400 font-mono">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Rain alerts are temporarily unavailable.</span>
      </div>
    );
  }

  const isHigh = alertData.status === 'high';
  const isMedium = alertData.status === 'medium';

  return (
    <div
      className={`p-4 rounded-2xl border transition-all shadow-xl relative overflow-hidden text-slate-200 ${
        isHigh
          ? 'bg-rose-950/30 border-rose-800/80 shadow-rose-950/40'
          : isMedium
          ? 'bg-amber-950/30 border-amber-800/80 shadow-amber-950/40'
          : 'bg-slate-900/60 border-slate-800'
      }`}
      role="region"
      aria-label="Smart Umbrella Recommendation Widget"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Main Alert Info */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-2xl border shrink-0 ${
              isHigh
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : isMedium
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}
          >
            {isHigh ? (
              <Umbrella className="w-5 h-5 animate-bounce" />
            ) : isMedium ? (
              <CloudRain className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
                {isHigh ? '☔ Umbrella recommended' : isMedium ? '🌦️ Umbrella possible' : '☀️ No umbrella needed'}
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                  isHigh
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : isMedium
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {alertData.severity} priority
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-snug">{alertData.message}</p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-cyan-300">
                <MapPin className="w-3 h-3 text-cyan-400" /> {alertData.location}
              </span>
              {alertData.expected_time && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3 h-3 text-cyan-400" /> Expected: {alertData.expected_time}
                </span>
              )}
              <span className="flex items-center gap-1 text-blue-400 font-semibold">
                🌧️ {alertData.rain_probability}% rain probability
              </span>
            </div>
          </div>
        </div>

        {/* User Notification Preference Toggle */}
        <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          <button
            onClick={handleToggleNotifications}
            aria-pressed={notificationsEnabled}
            title={notificationsEnabled ? 'Disable rain notifications' : 'Enable browser rain notifications'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              notificationsEnabled
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {notificationsEnabled ? <Bell className="w-3.5 h-3.5 text-cyan-400" /> : <BellOff className="w-3.5 h-3.5 text-slate-500" />}
            <span>{notificationsEnabled ? 'Rain Alerts On' : 'Enable Rain Alerts'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
      <div className="bg-[#18232D] border border-[#2B3945] p-3.5 rounded-xl flex items-center justify-between text-xs text-[#9AA8B2] font-mono">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#2F80ED]" />
          <span>Evaluating umbrella forecast for {city}...</span>
        </div>
      </div>
    );
  }

  if (error || !alertData) {
    return (
      <div className="bg-[#18232D] border border-[#2B3945] p-3.5 rounded-xl flex items-center gap-2 text-xs text-[#9AA8B2] font-mono">
        <AlertTriangle className="w-4 h-4 text-[#F2C94C] shrink-0" />
        <span>Rain alerts are temporarily unavailable.</span>
      </div>
    );
  }

  const isHigh = alertData.status === 'high';
  const isMedium = alertData.status === 'medium';

  return (
    <div
      className={`p-4 rounded-xl border transition-colors shadow-sm relative overflow-hidden text-[#F4F7F9] bg-[#18232D] ${
        isHigh
          ? 'border-l-4 border-l-[#EB5757] border-[#2B3945]'
          : isMedium
          ? 'border-l-4 border-l-[#F2994A] border-[#2B3945]'
          : 'border-l-4 border-l-[#27AE9B] border-[#2B3945]'
      }`}
      role="region"
      aria-label="Smart Umbrella Recommendation Widget"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Main Alert Info */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg border shrink-0 ${
              isHigh
                ? 'bg-[#EB5757]/15 border-[#EB5757]/30 text-[#EB5757]'
                : isMedium
                ? 'bg-[#F2994A]/15 border-[#F2994A]/30 text-[#F2994A]'
                : 'bg-[#27AE9B]/15 border-[#27AE9B]/30 text-[#27AE9B]'
            }`}
          >
            {isHigh ? (
              <Umbrella className="w-5 h-5" />
            ) : isMedium ? (
              <CloudRain className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-[#F4F7F9] flex items-center gap-1.5">
                {isHigh ? 'Umbrella recommended' : isMedium ? 'Umbrella possible' : 'No umbrella needed'}
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                  isHigh
                    ? 'bg-[#EB5757]/10 border-[#EB5757]/30 text-[#EB5757]'
                    : isMedium
                    ? 'bg-[#F2994A]/10 border-[#F2994A]/30 text-[#F2994A]'
                    : 'bg-[#101820] border-[#2B3945] text-[#9AA8B2]'
                }`}
              >
                {alertData.severity} priority
              </span>
            </div>

            <p className="text-xs text-[#9AA8B2] leading-snug">{alertData.message}</p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#9AA8B2] pt-1">
              <span className="flex items-center gap-1 text-[#56CCF2]">
                <MapPin className="w-3 h-3 text-[#2F80ED]" /> {alertData.location}
              </span>
              {alertData.expected_time && (
                <span className="flex items-center gap-1 text-[#F4F7F9]">
                  <Clock className="w-3 h-3 text-[#9AA8B2]" /> Expected: {alertData.expected_time}
                </span>
              )}
              <span className="flex items-center gap-1 text-[#56CCF2] font-semibold">
                {alertData.rain_probability}% precipitation probability
              </span>
            </div>
          </div>
        </div>

        {/* User Notification Preference Toggle */}
        <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2B3945]">
          <button
            onClick={handleToggleNotifications}
            aria-pressed={notificationsEnabled}
            title={notificationsEnabled ? 'Disable rain notifications' : 'Enable browser rain notifications'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors ${
              notificationsEnabled
                ? 'bg-[#2F80ED]/15 border border-[#2F80ED] text-[#56CCF2]'
                : 'bg-[#24313C] border border-[#2B3945] text-[#9AA8B2] hover:text-[#F4F7F9]'
            }`}
          >
            {notificationsEnabled ? <Bell className="w-3.5 h-3.5 text-[#56CCF2]" /> : <BellOff className="w-3.5 h-3.5 text-[#9AA8B2]" />}
            <span>{notificationsEnabled ? 'Rain Alerts Active' : 'Enable Alerts'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState, FormEvent, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, CloudSun, MapPin, LogIn, LogOut, Navigation, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCitySuggestions } from '../../services/weatherApi';
import { CitySuggestion } from '../../types/weather';

interface HeaderProps {
  onToggleSidebar: () => void;
  selectedCity?: string;
  onSearchCity?: (city: string) => void;
  isSearching?: boolean;
  onUseGPSLocation?: () => void;
  isDetectingGPS?: boolean;
  locationSource?: 'search' | 'gps' | string | null;
  gpsError?: string | null;
  gpsSuccessMessage?: string | null;
}

export const Header = ({
  onToggleSidebar,
  selectedCity = 'Mumbai',
  onSearchCity,
  isSearching = false,
  onUseGPSLocation,
  isDetectingGPS = false,
  locationSource = 'search',
  gpsError = null,
  gpsSuccessMessage = null,
}: HeaderProps) => {
  const [query, setQuery] = useState<string>(selectedCity);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [suggestError, setSuggestError] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(selectedCity);
  }, [selectedCity]);

  // 300ms Debounced fetch for city suggestions with AbortController for stale requests
  useEffect(() => {
    const trimmed = query.trim();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsSuggesting(false);
      setSuggestError(false);
      setHighlightedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsSuggesting(true);
      setSuggestError(false);
      setShowDropdown(true);

      try {
        const list = await getCitySuggestions(trimmed, controller.signal);
        setSuggestions(list);
        setHighlightedIndex(-1);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setSuggestError(true);
        setSuggestions([]);
      } finally {
        if (abortControllerRef.current === controller) {
          setIsSuggesting(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [query]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = (item: CitySuggestion) => {
    const cityName = item.name;
    setQuery(cityName);
    setShowDropdown(false);
    if (onSearchCity) {
      onSearchCity(cityName);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (showDropdown && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelectSuggestion(suggestions[highlightedIndex]);
      return;
    }
    setShowDropdown(false);
    if (query.trim() && onSearchCity) {
      onSearchCity(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === 'ArrowDown' && query.trim().length >= 2) {
        setShowDropdown(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const maxIdx = suggestions.length - 1;
        if (maxIdx < 0) return -1;
        return prev < maxIdx ? prev + 1 : 0;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const maxIdx = suggestions.length - 1;
        if (maxIdx < 0) return -1;
        return prev > 0 ? prev - 1 : maxIdx;
      });
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#18232D] border-b border-[#2B3945] px-3 sm:px-6 py-2.5 sticky top-0 z-30 flex flex-col gap-2 max-w-full overflow-visible shadow-sm">
      {/* Main bar row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 w-full max-w-full overflow-visible">
        {/* Mobile brand & toggle */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-transparent hover:border-[#2B3945]"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#24313C] flex items-center justify-center text-[#2F80ED] border border-[#2B3945]">
                <CloudSun className="w-4 h-4 shrink-0" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-[#F4F7F9] tracking-tight whitespace-nowrap truncate max-w-[170px] sm:max-w-none">
                Weather Intelligence
              </span>
            </div>
          </div>

          {/* Authentication Controls on Mobile */}
          <div className="flex items-center sm:hidden">
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded bg-[#2F80ED] flex items-center justify-center font-bold text-xs text-white uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-[#9AA8B2] hover:text-[#EB5757] hover:bg-[#24313C] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F80ED] text-white font-medium text-xs transition-colors hover:bg-[#2570d4]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Search city & GPS Location Controls */}
        <div className="flex-1 max-w-full sm:max-w-xl flex items-center gap-2 w-full overflow-visible">
          <div ref={searchContainerRef} className="relative flex-1 min-w-0">
            <form onSubmit={handleSubmit} className="relative w-full">
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA8B2] hover:text-[#56CCF2] transition-colors z-10"
                title="Search City"
              >
                <Search className={`w-4 h-4 ${isSearching ? 'animate-spin text-[#2F80ED]' : ''}`} />
              </button>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (query.trim().length >= 2) {
                    setShowDropdown(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search city..."
                className="w-full bg-[#101820] border border-[#2B3945] focus:border-[#2F80ED] rounded-lg pl-9 pr-14 py-2 text-xs sm:text-sm text-[#F4F7F9] placeholder-[#9AA8B2] focus:outline-none transition-colors min-h-[38px]"
              />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="hidden md:flex items-center gap-1 absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-white bg-[#2F80ED] hover:bg-[#2570d4] px-2.5 py-1 rounded transition-colors disabled:opacity-40 z-10"
              >
                <MapPin className="w-3 h-3" />
                <span>Search</span>
              </button>
            </form>

            {/* Autocomplete Suggestions Dropdown */}
            {showDropdown && query.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#18232D] border border-[#2B3945] rounded-lg shadow-xl z-50 overflow-hidden text-xs max-h-64 overflow-y-auto no-scrollbar">
                {isSuggesting ? (
                  <div className="p-3 text-[#9AA8B2] font-mono text-xs flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2F80ED] shrink-0" />
                    <span>Searching locations...</span>
                  </div>
                ) : suggestError ? (
                  <div className="p-3 text-[#F2C94C] font-mono text-xs flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F2C94C] shrink-0" />
                    <span>Unable to find locations</span>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="p-3 text-[#9AA8B2] font-mono text-xs">
                    No locations found
                  </div>
                ) : (
                  suggestions.map((item, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    return (
                      <div
                        key={`${item.name}-${item.latitude}-${item.longitude}-${idx}`}
                        onClick={() => handleSelectSuggestion(item)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`px-3.5 py-2.5 cursor-pointer flex items-start gap-2.5 border-b border-[#2B3945] last:border-b-0 transition-colors ${
                          isHighlighted
                            ? 'bg-[#24313C] text-[#F4F7F9] border-l-2 border-l-[#2F80ED]'
                            : 'hover:bg-[#24313C]/80 text-[#F4F7F9]'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-[#56CCF2] shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#F4F7F9] text-xs sm:text-sm truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#9AA8B2] truncate">
                            {[item.state, item.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* GPS Location Button */}
          {onUseGPSLocation && (
            <button
              type="button"
              onClick={onUseGPSLocation}
              disabled={isDetectingGPS}
              title="Use My Location"
              aria-label="Use My Location"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors shrink-0 min-h-[38px] ${
                locationSource === 'gps'
                  ? 'bg-[#2F80ED]/15 border-[#2F80ED] text-[#56CCF2]'
                  : 'bg-[#18232D] hover:bg-[#24313C] border-[#3A4A57] text-[#F4F7F9]'
              } disabled:opacity-50`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingGPS ? 'animate-spin text-[#2F80ED]' : 'text-[#56CCF2]'}`} />
              <span className="hidden sm:inline">
                {isDetectingGPS ? 'Detecting...' : 'Use My Location'}
              </span>
              <span className="sm:hidden">
                {isDetectingGPS ? 'Detecting...' : 'GPS'}
              </span>
            </button>
          )}
        </div>

        {/* Right section: Authentication Controls on Desktop */}
        <div className="hidden sm:flex items-center shrink-0">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-lg border border-[#2B3945] bg-[#101820]">
                <div className="w-7 h-7 rounded bg-[#2F80ED] flex items-center justify-center font-bold text-xs text-white uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-[#F4F7F9] leading-none">{user.name}</div>
                  <div className="text-[10px] text-[#9AA8B2] mt-0.5 max-w-[120px] truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#9AA8B2] hover:text-[#EB5757] hover:bg-[#24313C] border border-transparent hover:border-[#2B3945] text-xs font-medium transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2F80ED] hover:bg-[#2570d4] text-white font-medium text-xs sm:text-sm transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* GPS Status Banners */}
      {gpsSuccessMessage && (
        <div className="px-3 py-1.5 rounded-lg bg-[#27AE9B]/10 border border-[#27AE9B]/30 text-[#27AE9B] text-xs flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#27AE9B] shrink-0" />
            <span>{gpsSuccessMessage}</span>
          </div>
        </div>
      )}

      {gpsError && (
        <div className="px-3 py-1.5 rounded-lg bg-[#EB5757]/10 border border-[#EB5757]/30 text-[#EB5757] text-xs flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#EB5757] shrink-0" />
            <span>{gpsError}</span>
          </div>
        </div>
      )}
    </header>
  );
};

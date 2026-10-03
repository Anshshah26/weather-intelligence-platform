import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  selectedCity?: string;
  onSearchCity?: (city: string) => void;
  isSearching?: boolean;
  onUseGPSLocation?: () => void;
  isDetectingGPS?: boolean;
  locationSource?: 'search' | 'gps' | string | null;
  gpsError?: string | null;
  gpsSuccessMessage?: string | null;
}

export const Layout = ({
  children,
  selectedCity,
  onSearchCity,
  isSearching,
  onUseGPSLocation,
  isDetectingGPS,
  locationSource,
  gpsError,
  gpsSuccessMessage,
}: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#101820] text-[#F4F7F9] flex flex-row overflow-x-hidden max-w-full">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          selectedCity={selectedCity}
          onSearchCity={onSearchCity}
          isSearching={isSearching}
          onUseGPSLocation={onUseGPSLocation}
          isDetectingGPS={isDetectingGPS}
          locationSource={locationSource}
          gpsError={gpsError}
          gpsSuccessMessage={gpsSuccessMessage}
        />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

import { ComponentType, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Radio,
  Bot,
  Activity,
  Compass,
  GitCompare,
  CloudSun,
  X,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  protected?: boolean;
}

export const coreNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Forecast', path: '/forecast', icon: CalendarDays },
  { name: 'Weather Map', path: '/map', icon: MapPin },
  { name: 'Radar', path: '/radar', icon: Radio },
];

export const advancedNavItems: NavItem[] = [
  { name: 'AI Weather Advisor', path: '/ai-advisor', icon: Bot, protected: true },
  { name: 'Activities', path: '/activities', icon: Activity, protected: true },
  { name: 'Travel Planner', path: '/travel', icon: Compass, protected: true },
  { name: 'City Comparison', path: '/compare', icon: GitCompare, protected: true },
];

export const navItems: NavItem[] = [...coreNavItems, ...advancedNavItems];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Prevent background scrolling and handle Escape key press when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    onClose();
    if (item.protected && !user) {
      e.preventDefault();
      navigate('/login', {
        state: {
          from: { pathname: item.path },
          message: 'Sign in to use this feature.',
        },
      });
    }
  };

  const renderNavList = (items: NavItem[]) => (
    items.map((item) => {
      const Icon = item.icon;
      const isItemLocked = item.protected && !user;

      return (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={(e) => handleNavClick(e, item)}
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150 ${
              isActive && !isItemLocked
                ? 'bg-[#24313C] text-[#F4F7F9] font-semibold border-l-2 border-[#2F80ED] pl-2.5 shadow-sm'
                : 'text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C]/60'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Icon className="w-4 h-4 shrink-0 text-[#9AA8B2]" />
            <span>{item.name}</span>
          </div>
          {isItemLocked && (
            <span title="Sign in required">
              <Lock className="w-3.5 h-3.5 text-[#F2C94C] shrink-0" />
            </span>
          )}
        </NavLink>
      );
    })
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#101820]/80 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#18232D] border-r border-[#2B3945] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#2B3945]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#24313C] border border-[#2B3945] rounded-lg text-[#2F80ED]">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#F4F7F9] tracking-tight leading-none">
                Weather Intelligence
              </div>
              <div className="text-[11px] text-[#9AA8B2] mt-1 font-mono">Meteorological Platform</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#9AA8B2] hover:text-[#F4F7F9] hover:bg-[#24313C]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Core Weather Navigation */}
          <div className="space-y-1">
            {renderNavList(coreNavItems)}
          </div>

          {/* Section Divider */}
          <div className="pt-3 pb-2">
            <div className="border-t border-[#2B3945]" />
            <div className="text-[10px] font-mono text-[#9AA8B2] uppercase tracking-wider px-3 pt-2">
              Intelligence & Tools
            </div>
          </div>

          {/* Advanced / Protected Intelligence Tools */}
          <div className="space-y-1">
            {renderNavList(advancedNavItems)}
          </div>
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-[#2B3945] text-xs text-[#9AA8B2] bg-[#141C24]">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#9AA8B2]">Telemetry Feed</span>
            <span className="flex items-center gap-1.5 text-[#27AE9B] font-medium font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#27AE9B]"></span>
              ONLINE
            </span>
          </div>
          <div className="text-[10px] text-[#9AA8B2]/70 font-mono">OpenWeather + CARTO Engine</div>
        </div>
      </aside>
    </>
  );
};

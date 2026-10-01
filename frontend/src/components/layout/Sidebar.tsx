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

export const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Forecast', path: '/forecast', icon: CalendarDays },
  { name: 'Weather Map', path: '/map', icon: MapPin },
  { name: 'Radar', path: '/radar', icon: Radio },
  { name: 'AI Weather Advisor', path: '/ai-advisor', icon: Bot, protected: true },
  { name: 'Activities', path: '/activities', icon: Activity, protected: true },
  { name: 'Travel Planner', path: '/travel', icon: Compass, protected: true },
  { name: 'City Comparison', path: '/compare', icon: GitCompare, protected: true },
];

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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 tracking-tight leading-none">
                Weather Intelligence
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Platform v1.0</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemLocked = item.protected && !user;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive && !isItemLocked
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {isItemLocked && (
                  <span title="Sign in required">
                    <Lock className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-800/80 text-xs text-slate-500">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">System Status</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Active
            </span>
          </div>
          <div className="text-[10px] text-slate-600">Enterprise Edition</div>
        </div>
      </aside>
    </>
  );
};

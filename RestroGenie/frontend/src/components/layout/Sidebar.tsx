import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PieChart,
  Sparkles,
  Send,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const { uploadData, backendStatus } = useApp();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      badge: null,
    },
    {
      to: '/customers',
      label: 'Customer Data',
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: uploadData ? `${uploadData.total_rows}` : null,
    },
    {
      to: '/segments',
      label: 'Customer Segments',
      icon: <PieChart className="w-5 h-5 shrink-0" />,
      badge: uploadData ? Object.keys(uploadData.segment_counts).length : null,
    },
    {
      to: '/messages',
      label: 'AI Message Studio',
      icon: <Sparkles className="w-5 h-5 shrink-0" />,
      badge: uploadData ? `${uploadData.generated_count}` : null,
    },
    {
      to: '/campaigns',
      label: 'Campaigns',
      icon: <Send className="w-5 h-5 shrink-0" />,
      badge: 'Drafts',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#F0EBF7] dark:border-[#2C2936] min-h-[68px]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#C5A3FF] to-[#9F72F5] flex items-center justify-center text-white shadow-sm shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#2D2D2D] dark:text-[#F5F3F8]">
                RestroGenie
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8654DE] dark:text-[#C5A3FF]">
                AI Marketing OS
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="hidden md:flex p-1.5 rounded-lg text-[#6F6A78] hover:text-[#2D2D2D] dark:text-[#A7A1B3] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#F5F0FF] text-[#6939C4] font-semibold dark:bg-[#2C233C] dark:text-[#C5A3FF] shadow-xs'
                  : 'text-[#6F6A78] hover:text-[#2D2D2D] hover:bg-black/4 dark:text-[#A7A1B3] dark:hover:text-[#F5F3F8] dark:hover:bg-white/5'
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            {!collapsed && item.badge && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  item.badgeClass ||
                  'bg-[#EFE7FD] text-[#6939C4] dark:bg-[#382E4D] dark:text-[#C5A3FF]'
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info Box */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-[#F8F6FC] dark:bg-[#1A1820] border border-[#EBE5F5] dark:border-[#312E3C] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#6F6A78] dark:text-[#A7A1B3] font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#8654DE] dark:text-[#C5A3FF]" />
              Data Source
            </span>
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                backendStatus === 'connected' ? 'bg-[#27845A]' : 'bg-[#D69A32]'
              }`}
            />
          </div>
          <div className="text-[11px] text-[#2D2D2D] dark:text-[#E2DFE8] font-semibold truncate">
            {uploadData ? uploadData.filename : 'No CSV loaded yet'}
          </div>
          <div className="text-[10px] text-[#6F6A78] dark:text-[#A7A1B3]">
            {uploadData
              ? `${uploadData.eligible_customers} eligible for campaign`
              : 'Upload CSV to analyze segments'}
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center border-t border-[#F0EBF7] dark:border-[#2C2936]">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              backendStatus === 'connected' ? 'bg-[#27845A]' : 'bg-[#D69A32]'
            }`}
            title={`Backend ${backendStatus}`}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 bg-white dark:bg-[#1E1C24] border-r border-[#E9E4F0] dark:border-[#312E3C] transition-all duration-300 ease-in-out z-20 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer Content */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#1E1C24] border-r border-[#E9E4F0] dark:border-[#312E3C] z-50 md:hidden transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

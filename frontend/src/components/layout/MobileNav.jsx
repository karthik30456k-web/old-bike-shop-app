import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import {
  ShoppingBag,
  GitPullRequest,
  CalendarCheck,
  Bike,
  LayoutDashboard,
  Shield
} from 'lucide-react';

export const MobileNav = ({ activeTab, onSelectTab }) => {
  const { currentRole } = useTheme();

  const navItems = [
    { id: 'catalog', label: 'Bikes', icon: ShoppingBag },
    { id: 'enquiries', label: 'Leads', icon: GitPullRequest, roleReq: ['admin', 'staff'] },
    { id: 'test-rides', label: 'Test Rides', icon: CalendarCheck, roleReq: ['admin', 'staff'] },
    { id: 'inventory', label: 'Stock', icon: Bike, roleReq: ['admin', 'staff'] },
    { id: 'dashboard', label: 'Owner', icon: LayoutDashboard, roleReq: ['admin'] }
  ];

  const visibleItems = navItems.filter(item => !item.roleReq || item.roleReq.includes(currentRole));

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--bg-sidebar)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 200,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      {visibleItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              border: 'none',
              background: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: isActive ? 700 : 500,
              transition: 'color var(--transition-fast)'
            }}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

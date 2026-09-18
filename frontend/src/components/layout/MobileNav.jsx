import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import {
  ShoppingBag,
  GitPullRequest,
  CalendarCheck,
  Bike,
  LayoutDashboard,
  Menu
} from 'lucide-react';

export const MobileNav = ({ activeTab, onSelectTab, onOpenMenu, isInsideMockup = false }) => {
  const { currentRole } = useTheme();

  // Role-aware primary tabs for bottom navigation
  const getNavItems = () => {
    if (currentRole === 'customer') {
      return [
        { id: 'catalog', label: 'Bikes', icon: ShoppingBag }
      ];
    }
    if (currentRole === 'staff') {
      return [
        { id: 'inventory', label: 'Stock', icon: Bike },
        { id: 'enquiries', label: 'Leads', icon: GitPullRequest },
        { id: 'test-rides', label: 'Rides', icon: CalendarCheck },
        { id: 'catalog', label: 'Catalog', icon: ShoppingBag }
      ];
    }
    // Admin / Owner
    return [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'inventory', label: 'Stock', icon: Bike },
      { id: 'enquiries', label: 'Leads', icon: GitPullRequest },
      { id: 'sales', label: 'Sales', icon: ShoppingBag }
    ];
  };

  const navItems = getNavItems();

  return (
    <nav
      className={`mobile-bottom-nav ${isInsideMockup ? 'inside-phone-mockup' : ''}`}
      style={{
        position: isInsideMockup ? 'absolute' : 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        backgroundColor: 'var(--bg-sidebar)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        paddingBottom: 'max(4px, env(safe-area-inset-bottom))',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.15)'
      }}
    >
      {navItems.map(item => {
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
              justifyContent: 'center',
              gap: '3px',
              padding: '6px 8px',
              border: 'none',
              background: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: isActive ? 700 : 500,
              transition: 'color var(--transition-fast)',
              flex: 1
            }}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Menu / Drawer Button */}
      <button
        type="button"
        onClick={onOpenMenu}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 8px',
          border: 'none',
          background: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '0.7rem',
          fontWeight: 600,
          transition: 'color var(--transition-fast)',
          flex: 1
        }}
      >
        <Menu size={19} />
        <span>Menu</span>
      </button>
    </nav>
  );
};

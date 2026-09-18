import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bike, Sun, Moon, ShieldCheck, UserCheck, Users } from 'lucide-react';

export const MobileAppBar = ({ onToggleMobileMenu }) => {
  const { theme, toggleTheme, currentRole, setCurrentRole } = useTheme();
  const { currentUser, quickLoginAs } = useAuth();

  const cycleRole = () => {
    if (currentRole === 'admin') {
      setCurrentRole('staff');
      quickLoginAs?.('staff');
    } else if (currentRole === 'staff') {
      setCurrentRole('customer');
      quickLoginAs?.('customer');
    } else {
      setCurrentRole('admin');
      quickLoginAs?.('admin');
    }
  };

  const getRoleInfo = () => {
    switch (currentRole) {
      case 'admin':
        return { label: 'Admin / Owner', short: '👑 Admin', color: 'var(--primary)', bg: 'var(--primary-bg)', border: 'var(--primary-border)' };
      case 'staff':
        return { label: 'Sales Staff', short: '💼 Staff', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)', border: 'rgba(2, 132, 199, 0.3)' };
      default:
        return { label: 'Customer View', short: '🛵 Customer', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div
      style={{
        height: '56px',
        backgroundColor: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        flexShrink: 0
      }}
    >
      {/* Left: Hamburger Button & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={onToggleMobileMenu}
          title="Open Menu Drawer"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Open Navigation Drawer"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}
          >
            <Bike size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.96rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                whiteSpace: 'nowrap'
              }}>
                VELOCE
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-bg)',
                color: 'var(--primary)',
                border: '1px solid var(--primary-border)'
              }}>
                v2.4
              </span>
            </div>
            <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
              Showroom Mobile
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Role Switcher, Theme Toggle & Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Clickable Role Switcher Pill */}
        <button
          type="button"
          onClick={cycleRole}
          title={`Active: ${roleInfo.label}. Click to switch role.`}
          style={{
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            border: `1px solid ${roleInfo.border}`,
            backgroundColor: roleInfo.bg,
            color: roleInfo.color,
            fontSize: '0.7rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            whiteSpace: 'nowrap'
          }}
        >
          <span>{roleInfo.short}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* User Profile Avatar */}
        {currentUser && (
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={currentUser.name}
            title={`${currentUser.name} (${roleInfo.label})`}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `1.5px solid ${roleInfo.border}`
            }}
          />
        )}
      </div>
    </div>
  );
};

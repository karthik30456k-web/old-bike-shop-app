import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  UserCheck,
  Users,
  Sun,
  Moon,
  Smartphone,
  Monitor,
  Palette,
import {
  ShieldCheck,
  UserCheck,
  Users,
  Sun,
  Moon,
  Smartphone,
  Monitor,
  Palette,
  Bike,
  LogOut,
  Menu
} from 'lucide-react';

export const Navbar = ({ onToggleMobileMenu }) => {
  const {
    theme,
    toggleTheme,
    accent,
    setAccent,
    paletteList,
    currentRole,
    setCurrentRole,
    deviceMode,
    setDeviceMode
  } = useTheme();

  const { currentUser, logout, quickLoginAs } = useAuth();

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      {/* Left: Mobile Hamburger + Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="mobile-menu-btn"
          title="Open Navigation Menu"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Open Navigation Drawer"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
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
            <Bike size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap'
              }}>
                VELOCE WHEELS
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-bg)',
                color: 'var(--primary)',
                border: '1px solid var(--primary-border)',
                textTransform: 'uppercase'
              }}>
                v2.4
              </span>
            </div>
            <span className="desktop-only-nav" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Used Bike Showroom & Customer Platform
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher (Admin / Staff / Customer) - Desktop */}
      <div
        className="desktop-only-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          backgroundColor: 'var(--bg-input)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)'
        }}
      >
        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0 8px' }}>
          Role:
        </span>
        <button
          type="button"
          onClick={() => { setCurrentRole('admin'); quickLoginAs('admin'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: currentRole === 'admin' ? 'var(--primary)' : 'transparent',
            color: currentRole === 'admin' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <ShieldCheck size={14} />
          <span>Admin / Owner</span>
        </button>

        <button
          type="button"
          onClick={() => { setCurrentRole('staff'); quickLoginAs('staff'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: currentRole === 'staff' ? 'var(--primary)' : 'transparent',
            color: currentRole === 'staff' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <UserCheck size={14} />
          <span>Staff / Sales</span>
        </button>

        <button
          type="button"
          onClick={() => { setCurrentRole('customer'); quickLoginAs('customer'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: currentRole === 'customer' ? 'var(--primary)' : 'transparent',
            color: currentRole === 'customer' ? 'var(--primary-text)' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Users size={14} />
          <span>Customer View</span>
        </button>
      </div>

      {/* Utilities: Accent Palette, Dark/Light Mode, Mobile Simulation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Color Palette Selector */}
        <div className="desktop-only-nav" style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '8px', borderRight: '1px solid var(--border-color)' }}>
          {paletteList.map((p) => (
            <button
              key={p.id}
              type="button"
              title={`Switch accent to ${p.name}`}
              onClick={() => setAccent(p.id)}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: p.color,
                border: accent === p.id ? '2px solid #ffffff' : '2px solid transparent',
                boxShadow: accent === p.id ? `0 0 8px ${p.color}` : 'none',
                cursor: 'pointer',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            />
          ))}
        </div>

        {/* Device Mode Toggle (Desktop vs Mobile Frame) */}
        <button
          className="desktop-only-nav"
          type="button"
          onClick={() => setDeviceMode(prev => prev === 'desktop' ? 'mobile' : 'desktop')}
          title={deviceMode === 'desktop' ? 'Preview Mobile App Layout' : 'Return to Desktop View'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: deviceMode === 'mobile' ? 'var(--primary-bg)' : 'transparent',
            color: deviceMode === 'mobile' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          {deviceMode === 'desktop' ? <Smartphone size={15} /> : <Monitor size={15} />}
          <span>{deviceMode === 'desktop' ? 'Mobile View' : 'Desktop'}</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Profile Pill & Logout Button */}
        {currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingLeft: '8px',
            borderLeft: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--border-color)'
                }}
              />
              <div className="desktop-only-nav" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {currentUser.role === 'admin' ? '👑 Owner' : currentUser.role === 'staff' ? '💼 Staff' : '🛵 Customer'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign out of Showroom ERP"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={13} />
              <span className="desktop-only-nav">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

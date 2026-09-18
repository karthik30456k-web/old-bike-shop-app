import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bike,
  PlusCircle,
  ClipboardCheck,
  Users,
  GitPullRequest,
  CalendarCheck,
  BookmarkCheck,
  Receipt,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  X,
  ShieldCheck,
  UserCheck,
  LogOut
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  onSelectTab,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer = () => {}
}) => {
  const { currentRole, setCurrentRole } = useTheme();
  const { currentUser, logout, quickLoginAs } = useAuth();

  const allNavItems = [
    { id: 'dashboard', label: 'Showroom Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'inventory', label: 'Bike Inventory', icon: Bike, roles: ['admin', 'staff'], badge: 'Live' },
    { id: 'purchase', label: 'Bike Purchase / Intake', icon: PlusCircle, roles: ['admin', 'staff'] },
    { id: 'inspection', label: '14-Point Inspection', icon: ClipboardCheck, roles: ['admin', 'staff'] },
    { id: 'enquiries', label: 'Enquiries & Leads', icon: GitPullRequest, roles: ['admin', 'staff'], badge: 'Pipeline' },
    { id: 'test-rides', label: 'Test Ride Schedules', icon: CalendarCheck, roles: ['admin', 'staff'] },
    { id: 'bookings', label: 'Token Bookings', icon: BookmarkCheck, roles: ['admin', 'staff'] },
    { id: 'sales', label: 'Sales & Invoices', icon: Receipt, roles: ['admin', 'staff'] },
    { id: 'expenses', label: 'Expenses & True Profit', icon: TrendingUp, roles: ['admin'] },
    { id: 'customers', label: 'Customer Directory', icon: Users, roles: ['admin', 'staff'] },
    { id: 'catalog', label: 'Customer Discovery Showroom', icon: ShoppingBag, roles: ['admin', 'staff', 'customer'], highlight: true }
  ];

  const filteredItems = allNavItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    onCloseMobileDrawer();
  };

  const renderNavList = () => (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavClick(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isActive ? 'var(--primary)' : item.highlight ? 'var(--primary-bg)' : 'transparent',
              color: isActive ? '#ffffff' : item.highlight ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: isActive || item.highlight ? 600 : 500,
              fontSize: '0.88rem',
              transition: 'all var(--transition-fast)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = item.highlight ? 'var(--primary-bg)' : 'transparent';
                e.currentTarget.style.color = item.highlight ? 'var(--primary)' : 'var(--text-secondary)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
            {item.badge && !isActive && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar */}
      <aside className="desktop-sidebar">
        <div>
          <div style={{
            padding: '0 10px 12px 10px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            {currentRole === 'admin' ? 'Owner / Management' : currentRole === 'staff' ? 'Sales Executive Console' : 'Customer Explorer'}
          </div>
          {renderNavList()}
        </div>

        {/* Lifecycle Flow Indicator Card */}
        <div
          style={{
            marginTop: '20px',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>
            <Sparkles size={14} />
            <span>Full Bike Lifecycle</span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Purchase → Inspection → Refurbish → Available → Enquiry → Test Ride → Booking → Invoicing → Profit
          </p>
        </div>
      </aside>

      {/* 2. Mobile Drawer Backdrop & Panel */}
      <div
        className={`mobile-drawer-backdrop ${isMobileDrawerOpen ? 'open' : ''}`}
        onClick={onCloseMobileDrawer}
        aria-hidden="true"
      />

      <aside
        className={`mobile-drawer-panel ${isMobileDrawerOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 18px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bike size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Menu & Modules
            </span>
          </div>

          <button
            type="button"
            onClick={onCloseMobileDrawer}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close Navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div style={{ padding: '16px 14px', flex: 1, overflowY: 'auto' }}>
          <div style={{
            padding: '0 8px 10px 8px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            Navigation
          </div>
          {renderNavList()}
        </div>

        {/* Mobile Drawer Role Switcher & User Footer */}
        <div style={{
          padding: '14px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface-elevated)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Switch Role
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            <button
              type="button"
              onClick={() => { setCurrentRole('admin'); quickLoginAs('admin'); }}
              style={{
                padding: '6px 4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentRole === 'admin' ? 'var(--primary)' : 'var(--bg-surface)',
                color: currentRole === 'admin' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              👑 Owner
            </button>
            <button
              type="button"
              onClick={() => { setCurrentRole('staff'); quickLoginAs('staff'); }}
              style={{
                padding: '6px 4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentRole === 'staff' ? 'var(--primary)' : 'var(--bg-surface)',
                color: currentRole === 'staff' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              💼 Staff
            </button>
            <button
              type="button"
              onClick={() => { setCurrentRole('customer'); quickLoginAs('customer'); }}
              style={{
                padding: '6px 4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentRole === 'customer' ? 'var(--primary)' : 'var(--bg-surface)',
                color: currentRole === 'customer' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              🛵 Customer
            </button>
          </div>

          {currentUser && (
            <button
              type="button"
              onClick={() => { logout(); onCloseMobileDrawer(); }}
              style={{
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} />
              <span>Log Out ({currentUser.name})</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};


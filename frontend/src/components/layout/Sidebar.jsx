import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
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
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  const { currentRole } = useTheme();

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

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 14px',
        overflowY: 'auto'
      }}
    >
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

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
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
  );
};

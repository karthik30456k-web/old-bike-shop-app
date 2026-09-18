import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  size = 'md'
}) => {
  return (
    <div
      className={`common-tabs ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px',
        backgroundColor: 'var(--bg-input)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        overflowX: 'auto',
        maxWidth: '100%'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: size === 'sm' ? '6px 12px' : '8px 16px',
              fontSize: size === 'sm' ? '0.8rem' : '0.86rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
              boxShadow: isActive ? '0 2px 8px var(--primary-glow)' : 'none',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'rgba(0, 0, 0, 0.2)' : 'var(--bg-surface-elevated)',
                  color: isActive ? 'currentColor' : 'var(--text-muted)'
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

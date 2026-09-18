import React from 'react';

export const InspectionRating = ({
  label,
  value = 'Good',
  onChange,
  disabled = false
}) => {
  const options = [
    { id: 'Good', label: 'Good', icon: '✓', color: 'var(--color-success)', bg: 'var(--color-success-bg)', border: 'var(--color-success-border)' },
    { id: 'Average', label: 'Average', icon: '•', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)' },
    { id: 'Need Repair', label: 'Need Repair', icon: '⚠', color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', border: 'var(--color-danger-border)' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-sm)',
      gap: '12px'
    }}>
      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {label}
      </span>

      <div style={{ display: 'flex', gap: '6px' }}>
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange && onChange(opt.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                border: `1px solid ${isSelected ? opt.border : 'var(--border-color)'}`,
                backgroundColor: isSelected ? opt.bg : 'transparent',
                color: isSelected ? opt.color : 'var(--text-muted)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

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
    { id: 'Need Repair', label: 'Repair', icon: '⚠', color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', border: 'var(--color-danger-border)' }
  ];

  return (
    <div className="inspection-rating-row">
      <span className="inspection-rating-label">
        {label}
      </span>

      <div className="inspection-rating-group">
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
                justifyContent: 'center',
                gap: '4px',
                padding: '6px 8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                border: `1px solid ${isSelected ? opt.border : 'var(--border-color)'}`,
                backgroundColor: isSelected ? opt.bg : 'transparent',
                color: isSelected ? opt.color : 'var(--text-muted)',
                transition: 'all var(--transition-fast)',
                flex: 1,
                textAlign: 'center'
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

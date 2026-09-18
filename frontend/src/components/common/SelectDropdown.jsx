import React from 'react';

export const SelectDropdown = ({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        id={id}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        className={className}
        style={{
          width: '100%',
          padding: '10px 36px 10px 14px',
          fontSize: '0.9rem',
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: 'pointer',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          boxShadow: 'var(--shadow-sm)'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.boxShadow = 'var(--shadow-sm)';
        }}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt, i) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={i} value={val} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
              {label}
            </option>
          );
        })}
      </select>

      {/* Custom Chevron Arrow */}
      <span style={{
        position: 'absolute',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: 'var(--text-muted)',
        fontSize: '0.75rem'
      }}>
        ▼
      </span>
    </div>
  );
};

import React from 'react';

export const NumberInput = ({
  id,
  name,
  value,
  onChange,
  placeholder = '0',
  disabled = false,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  className = '',
  ...props
}) => {
  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
      {prefix && (
        <span style={{
          position: 'absolute',
          left: '12px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          pointerEvents: 'none'
        }}>
          {prefix}
        </span>
      )}
      <input
        id={id}
        name={name}
        type="number"
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={className}
        style={{
          width: '100%',
          paddingLeft: prefix ? '34px' : '14px',
          paddingRight: suffix ? '50px' : '14px',
          paddingTop: '10px',
          paddingBottom: '10px',
          fontSize: '0.9rem',
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
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
      />
      {suffix && (
        <span style={{
          position: 'absolute',
          right: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }}>
          {suffix}
        </span>
      )}
    </div>
  );
};

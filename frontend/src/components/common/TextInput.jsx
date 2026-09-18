import React from 'react';

export const TextInput = ({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
      {Icon && (
        <span style={{
          position: 'absolute',
          left: '12px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <Icon size={18} />
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        style={{
          width: '100%',
          padding: Icon ? '10px 14px 10px 38px' : '10px 14px',
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
    </div>
  );
};

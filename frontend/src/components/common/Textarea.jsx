import React from 'react';

export const Textarea = ({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 3,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={className}
      style={{
        width: '100%',
        padding: '10px 14px',
        fontSize: '0.9rem',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        outline: 'none',
        resize: 'vertical',
        minHeight: '80px',
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
  );
};

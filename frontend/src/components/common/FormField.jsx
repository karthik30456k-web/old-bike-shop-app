import React from 'react';

/**
 * Reusable FormField Component
 * Standardized wrapper providing label, required indicator, error text, and helper tooltip.
 */
export const FormField = ({
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
  id
}) => {
  return (
    <div className={`common-form-field ${className}`} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{label}</span>
          {required && <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        {children}
      </div>

      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ⚠️ {error}
        </span>
      )}

      {helperText && !error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};

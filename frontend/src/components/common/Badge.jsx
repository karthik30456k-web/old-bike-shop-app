import React from 'react';

export const Badge = ({
  children,
  status, // 'available' | 'reserved' | 'sold' | 'passed' | 'failed' | 'new' | 'interested' | 'booking' | etc.
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline'
  size = 'sm', // 'sm' | 'md'
  className = '',
  style = {}
}) => {
  // Derive styling based on status keyword if provided
  let computedVariant = variant;
  let label = children;

  if (status) {
    const s = String(status).toLowerCase();
    if (s === 'available' || s === 'passed' || s === 'completed') {
      computedVariant = 'success';
      label = label || (s === 'available' ? 'Available' : s === 'passed' ? 'Inspection Passed' : 'Completed');
    } else if (s === 'reserved' || s === 'test_ride' || s === 'scheduled' || s === 'negotiation') {
      computedVariant = 'warning';
      label = label || (s === 'reserved' ? 'Reserved' : s === 'test_ride' ? 'Test Ride' : 'Scheduled');
    } else if (s === 'sold') {
      computedVariant = 'purple';
      label = label || 'Sold';
    } else if (s === 'failed' || s === 'cancelled' || s === 'lost') {
      computedVariant = 'danger';
      label = label || (s === 'failed' ? 'Failed' : s === 'cancelled' ? 'Cancelled' : 'Lost');
    } else if (s === 'new' || s === 'contacted' || s === 'interested') {
      computedVariant = 'info';
      label = label || (s === 'new' ? 'New Lead' : s === 'contacted' ? 'Contacted' : 'Interested');
    } else if (s === 'booking') {
      computedVariant = 'success';
      label = label || 'Booking Confirmed';
    }
  }

  const getVariantStyles = () => {
    switch (computedVariant) {
      case 'success':
        return {
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success-text)',
          border: '1px solid var(--color-success-border)'
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-warning-bg)',
          color: 'var(--color-warning-text)',
          border: '1px solid var(--color-warning-border)'
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger-text)',
          border: '1px solid var(--color-danger-border)'
        };
      case 'info':
        return {
          backgroundColor: 'var(--color-info-bg)',
          color: 'var(--color-info-text)',
          border: '1px solid var(--color-info-border)'
        };
      case 'purple':
        return {
          backgroundColor: 'var(--color-purple-bg)',
          color: 'var(--color-purple-text)',
          border: '1px solid var(--color-purple-border)'
        };
      case 'primary':
        return {
          backgroundColor: 'var(--primary-bg)',
          color: 'var(--primary)',
          border: '1px solid var(--primary-border)'
        };
      default:
        return {
          backgroundColor: 'var(--bg-surface-elevated)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        };
    }
  };

  return (
    <span
      className={`common-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '3px 8px' : '5px 12px',
        fontSize: size === 'sm' ? '0.75rem' : '0.82rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
        textTransform: 'capitalize',
        ...getVariantStyles(),
        ...style
      }}
    >
      {label || children}
    </span>
  );
};

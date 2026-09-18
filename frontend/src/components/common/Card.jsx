import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  return (
    <div
      className={`common-card ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      {...props}
    >
      {(title || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: subtitle ? '4px' : '16px',
          gap: '12px'
        }}>
          <div>
            {title && (
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em'
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: '2px'
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export const MetricCard = ({
  label,
  value,
  subvalue,
  icon: Icon,
  trend,
  color = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'purple'
  onClick
}) => {
  const getColorStyles = () => {
    switch (color) {
      case 'success':
        return { bg: 'var(--color-success-bg)', text: 'var(--color-success)', border: 'var(--color-success-border)' };
      case 'warning':
        return { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)', border: 'var(--color-warning-border)' };
      case 'danger':
        return { bg: 'var(--color-danger-bg)', text: 'var(--color-danger)', border: 'var(--color-danger-border)' };
      case 'purple':
        return { bg: 'var(--color-purple-bg)', text: 'var(--color-purple)', border: 'rgba(139, 92, 246, 0.3)' };
      default:
        return { bg: 'var(--primary-bg)', text: 'var(--primary)', border: 'var(--primary-border)' };
    }
  };

  const cStyle = getColorStyles();

  return (
    <Card
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: cStyle.bg,
            color: cStyle.text,
            border: `1px solid ${cStyle.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div style={{
          fontSize: '1.75rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: '1.2'
        }}>
          {value}
        </div>
        {(subvalue || trend) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '6px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            {trend && (
              <span style={{
                color: trend.isPositive ? 'var(--color-success)' : 'var(--color-danger)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                {trend.isPositive ? '↑' : '↓'} {trend.text}
              </span>
            )}
            {subvalue && <span>{subvalue}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};

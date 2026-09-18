import React, { useState } from 'react';
import { TextInput } from './TextInput';

export const DataTable = ({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKey = '',
  emptyMessage = 'No records found',
  emptyIcon: EmptyIcon,
  onRowClick,
  mobileLayout = 'card'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (searchKey && row[searchKey]) {
      return String(row[searchKey]).toLowerCase().includes(term);
    }
    return Object.values(row).some(
      (val) => val && String(val).toLowerCase().includes(term)
    );
  });

  // Identify semantic column roles for mobile card view
  const statusCol = columns.find(
    (c) => c.key === 'status' || c.label?.toLowerCase() === 'status' || c.key?.endsWith('_status')
  );
  const actionsCol = columns.find(
    (c) =>
      c.key === 'actions' ||
      c.key === 'action' ||
      c.label?.toLowerCase() === 'actions' ||
      c.label?.toLowerCase() === 'action'
  );
  // Pick primary column (first non-status, non-action column if possible)
  const primaryCol = columns.find((c) => c !== statusCol && c !== actionsCol) || columns[0] || null;
  // Pick secondary column (next available non-status, non-action column)
  const secondaryCol =
    columns.find((c) => c !== statusCol && c !== actionsCol && c !== primaryCol) || null;

  const bodyCols = columns.filter(
    (c) =>
      c !== primaryCol &&
      c !== secondaryCol &&
      c !== statusCol &&
      c !== actionsCol
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {searchable && (
        <div style={{ maxWidth: '340px' }}>
          <TextInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Desktop Table View */}
      <div className="data-table-desktop-wrapper">
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.88rem'
        }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderBottom: '1px solid var(--border-color)'
            }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '12px 16px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    width: col.width || 'auto'
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    borderBottom: idx < filteredData.length - 1 ? '1px solid var(--border-color)' : 'none',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: '14px 16px',
                        color: 'var(--text-primary)',
                        verticalAlign: 'middle'
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    {EmptyIcon && <EmptyIcon size={36} />}
                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Type View */}
      {mobileLayout === 'card' && (
        <div className="data-table-cards-wrapper">
          {filteredData.length > 0 ? (
            filteredData.map((row, idx) => (
              <div
                key={row.id || idx}
                className="data-table-card"
                onClick={(e) => {
                  if (e.target.closest('button, input, select, a, textarea')) return;
                  if (onRowClick) onRowClick(row);
                }}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default'
                }}
              >
                {/* Card Header: Primary Identifier & Status Badge */}
                {(primaryCol || statusCol) && (
                  <div className="data-table-card-header">
                    <div className="data-table-card-header-left">
                      {primaryCol && (
                        <div className="data-table-card-primary-val">
                          {primaryCol.render
                            ? primaryCol.render(row[primaryCol.key], row)
                            : (row[primaryCol.key] ?? '—')}
                        </div>
                      )}
                      {secondaryCol && (
                        <div className="data-table-card-secondary-val">
                          {secondaryCol.render
                            ? secondaryCol.render(row[secondaryCol.key], row)
                            : (row[secondaryCol.key] ?? '—')}
                        </div>
                      )}
                    </div>
                    {statusCol && (
                      <div className="data-table-card-header-right">
                        {statusCol.render
                          ? statusCol.render(row[statusCol.key], row)
                          : (row[statusCol.key] ?? '—')}
                      </div>
                    )}
                  </div>
                )}

                {/* Card Body: Structured Attribute Grid */}
                {bodyCols.length > 0 && (
                  <div className="data-table-card-grid">
                    {bodyCols.map((col) => {
                      const isFullWidth = [
                        'feedback',
                        'notes',
                        'description',
                        'address',
                        'seller_notes',
                        'reason'
                      ].includes(col.key.toLowerCase());

                      return (
                        <div
                          key={col.key}
                          className={`data-table-card-field ${isFullWidth ? 'full-width' : ''}`}
                        >
                          <span className="data-table-card-label">{col.label}</span>
                          <div className="data-table-card-value">
                            {col.render
                              ? col.render(row[col.key], row)
                              : (row[col.key] ?? '—')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Card Footer: Action Buttons */}
                {actionsCol && (
                  <div className="data-table-card-footer">
                    {actionsCol.render
                      ? actionsCol.render(row[actionsCol.key], row)
                      : row[actionsCol.key]}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="data-table-card-empty">
              {EmptyIcon && <EmptyIcon size={36} />}
              <span>{emptyMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

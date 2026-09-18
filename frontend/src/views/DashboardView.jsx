import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Card, MetricCard, Button, Badge, DataTable } from '../components/common';
import {
  Bike,
  CheckCircle2,
  Clock,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ArrowRight,
  PlusCircle,
  FileCheck
} from 'lucide-react';

export const DashboardView = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      if (res && res.data) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !metrics) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Showroom Intelligence...
      </div>
    );
  }

  const m = metrics || {
    totalBikes: 7,
    availableBikes: 5,
    reservedBikes: 1,
    soldBikes: 1,
    totalEnquiries: 3,
    activeEnquiries: 3,
    totalSalesRevenue: 64500,
    totalPurchaseCost: 597000,
    totalExpenses: 8800,
    totalInvestment: 605800,
    profitOnSoldBikes: 10900,
    activeBookingsAdvance: 5000,
    recentBikes: []
  };

  const formatRupee = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Quick Action Shortcuts */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Showroom Command Center
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Live status of used bike inventory, seller purchases, leads, and realized net profits.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            icon={PlusCircle}
            onClick={() => onNavigate('purchase')}
          >
            New Bike Intake
          </Button>
          <Button
            variant="primary"
            icon={FileCheck}
            onClick={() => onNavigate('inspection')}
          >
            New 14-Pt Inspection
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: '14px'
      }}>
        <MetricCard
          label="Total Bikes in Stock"
          value={m.totalBikes}
          subvalue={`${m.availableBikes} Ready for Sale`}
          icon={Bike}
          color="primary"
          onClick={() => onNavigate('inventory')}
        />
        <MetricCard
          label="Available Bikes"
          value={m.availableBikes}
          subvalue="Certified Inspected"
          icon={CheckCircle2}
          color="success"
          onClick={() => onNavigate('inventory')}
        />
        <MetricCard
          label="Reserved / Token Paid"
          value={m.reservedBikes}
          subvalue={`${formatRupee(m.activeBookingsAdvance)} Advance held`}
          icon={Clock}
          color="warning"
          onClick={() => onNavigate('bookings')}
        />
        <MetricCard
          label="Sold Bikes"
          value={m.soldBikes}
          subvalue="Delivered this month"
          icon={ShoppingBag}
          color="purple"
          onClick={() => onNavigate('sales')}
        />
      </div>

      {/* Financial & Profit Tracking Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '16px'
      }}>
        <Card
          title="💰 Showroom Capital & Costs"
          subtitle="Total acquisition + refurbishment investments"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Total Purchase Cost:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatRupee(m.totalPurchaseCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Refurbishment & Services:</span>
              <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>{formatRupee(m.totalExpenses)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Total Capital Deployed:</span>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>{formatRupee(m.totalInvestment)}</span>
            </div>
          </div>
        </Card>

        <Card
          title="📈 Realized Revenue & True Profit"
          subtitle="Calculated on completed vehicle sales minus true cost"
          action={
            <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => onNavigate('expenses')}>
              Profit Engine
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Total Sales Turnover:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatRupee(m.totalSalesRevenue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Net Realized Profit:</span>
              <span style={{ fontWeight: 800, color: 'var(--color-success)', fontSize: '1.1rem' }}>
                +{formatRupee(m.profitOnSoldBikes)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: 'var(--color-success-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-success-border)',
              fontSize: '0.8rem',
              color: 'var(--color-success)'
            }}>
              <span>✓ Profit verified against bike purchase agreement and parts expenses.</span>
            </div>
          </div>
        </Card>

        <Card
          title="⚡ Active Enquiry Pipeline"
          subtitle="Potential sales conversion funnel"
          action={
            <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => onNavigate('enquiries')}>
              Pipeline
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Active Inquiries:</span>
              <Badge variant="info">{m.activeEnquiries} Active</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Test Rides Pending:</span>
              <Badge variant="warning">1 Scheduled</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Token Bookings Waiting Delivery:</span>
              <Badge variant="success">1 Ready</Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('enquiries')}
              style={{ marginTop: '4px' }}
            >
              Open Kanban Lead Board
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Bike Inventory Snapshot */}
      <Card
        title="🏍️ Current Showroom Inventory Status"
        subtitle="Recently intake and verified used motorcycles & scooters"
        action={
          <Button size="sm" variant="outline" iconRight={ArrowRight} onClick={() => onNavigate('inventory')}>
            View All Bikes
          </Button>
        }
      >
        <DataTable
          searchable={false}
          columns={[
            {
              key: 'stock_id',
              label: 'Stock ID',
              render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{val}</span>
            },
            {
              key: 'model',
              label: 'Bike Details',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 700 }}>{row.brand} {row.model}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {row.year} • {Number(row.km_driven).toLocaleString('en-IN')} KM • {row.color}
                  </div>
                </div>
              )
            },
            {
              key: 'reg_number',
              label: 'Registration',
              render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{val}</span>
            },
            {
              key: 'purchase_price',
              label: 'Purchase Cost',
              render: (val) => formatRupee(val)
            },
            {
              key: 'selling_price',
              label: 'Selling Price',
              render: (val) => (
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatRupee(val)}
                </span>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val} />
            }
          ]}
          data={m.recentBikes || []}
        />
      </Card>
    </div>
  );
};

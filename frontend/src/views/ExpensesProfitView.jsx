import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Card,
  Button,
  Badge,
  DataTable,
  Modal,
  FormField,
  TextInput,
  NumberInput,
  SelectDropdown,
  DateInput,
  Textarea
} from '../components/common';
import {
  TrendingUp,
  Plus,
  DollarSign,
  Wrench,
  Truck,
  Sparkles,
  Receipt,
  CheckCircle2
} from 'lucide-react';

export const ExpensesProfitView = () => {
  const [bikes, setBikes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [expenseType, setExpenseType] = useState('service');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bikesRes, expRes, salesRes] = await Promise.all([
        api.getBikes(),
        api.getExpenses(),
        api.getSales()
      ]);
      if (bikesRes && bikesRes.data) {
        setBikes(bikesRes.data);
        if (bikesRes.data.length > 0 && !selectedBikeId) {
          setSelectedBikeId(bikesRes.data[0].id);
        }
      }
      if (expRes && expRes.data) setExpenses(expRes.data);
      if (salesRes && salesRes.data) setSales(salesRes.data);
    } catch (err) {
      console.error('Failed to load financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!selectedBikeId || !amount || !description) {
      alert('Please select bike, amount, and description.');
      return;
    }

    try {
      await api.createExpense({
        bike_id: selectedBikeId,
        expense_type: expenseType,
        amount: Number(amount),
        description,
        expense_date: expenseDate
      });
      setIsModalOpen(false);
      setAmount('');
      setDescription('');
      alert('✅ Expense recorded against bike investment!');
      loadData();
    } catch (err) {
      alert('Failed to log expense: ' + err.message);
    }
  };

  const formatRupee = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

  // Build per-bike true profit matrix
  const bikeProfitMatrix = bikes.map((bike) => {
    const bikeExpenses = expenses.filter(e => e.bike_id === bike.id);
    const totalExp = bikeExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const purchaseCost = Number(bike.purchase_price || 0);
    const trueCost = purchaseCost + totalExp;
    const saleRecord = sales.find(s => s.bike_id === bike.id);
    const revenue = saleRecord ? Number(saleRecord.total_amount || 0) : Number(bike.selling_price || 0);
    const profit = revenue - trueCost;
    const margin = trueCost > 0 ? Math.round((profit / trueCost) * 100) : 0;

    return {
      ...bike,
      totalExpenses: totalExp,
      trueCost,
      revenue,
      profit,
      margin,
      isSold: Boolean(saleRecord)
    };
  });

  const totalCapitalPurchases = bikes.reduce((sum, b) => sum + Number(b.purchase_price || 0), 0);
  const totalRefurbishment = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalInvested = totalCapitalPurchases + totalRefurbishment;
  const realizedProfitTotal = bikeProfitMatrix
    .filter(b => b.isSold)
    .reduce((sum, b) => sum + b.profit, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            True Profit & Refurbishment Engine
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Accurate vehicle economics: Purchase Price + Service + Detailing + Transport = True Cost vs Realized Profit.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Add Bike Expense
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <Card title="Acquisition Capital" subtitle="Base purchase cost">
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
            {formatRupee(totalCapitalPurchases)}
          </div>
        </Card>

        <Card title="Refurbishment & Parts" subtitle="Mechanical & detailing">
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '8px' }}>
            {formatRupee(totalRefurbishment)}
          </div>
        </Card>

        <Card title="True Total Deployed" subtitle="Purchase + all expenses">
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '8px' }}>
            {formatRupee(totalInvested)}
          </div>
        </Card>

        <Card title="Realized Net Profit" subtitle="On delivered sold units">
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '8px' }}>
            +{formatRupee(realizedProfitTotal)}
          </div>
        </Card>
      </div>

      {/* Per-Bike True Profit Ledger */}
      <Card
        title="Vehicle-by-Vehicle Profit & Cost Breakdown"
        subtitle="Individual accounting showing exact ROI for every motorcycle in your showroom"
      >
        <DataTable
          searchable={true}
          searchPlaceholder="Filter by model, stock id..."
          columns={[
            {
              key: 'stock_id',
              label: 'Stock ID',
              render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{val}</span>
            },
            {
              key: 'model',
              label: 'Vehicle',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 700 }}>{row.brand} {row.model}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.year} • {row.reg_number}</div>
                </div>
              )
            },
            {
              key: 'purchase_price',
              label: 'Purchase Cost',
              render: (val) => formatRupee(val)
            },
            {
              key: 'totalExpenses',
              label: 'Refurbishment',
              render: (val) => (
                <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>
                  +{formatRupee(val)}
                </span>
              )
            },
            {
              key: 'trueCost',
              label: 'True Cost Basis',
              render: (val) => (
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatRupee(val)}
                </span>
              )
            },
            {
              key: 'revenue',
              label: 'Selling Value',
              render: (val, row) => (
                <div>
                  <span style={{ fontWeight: 700 }}>{formatRupee(val)}</span>
                  <div style={{ fontSize: '0.7rem', color: row.isSold ? 'var(--color-purple)' : 'var(--text-muted)' }}>
                    {row.isSold ? 'Sold Price' : 'Target Price'}
                  </div>
                </div>
              )
            },
            {
              key: 'profit',
              label: 'Net Margin',
              render: (val, row) => (
                <div>
                  <span style={{
                    fontWeight: 800,
                    color: val >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                    fontSize: '0.95rem'
                  }}>
                    {val >= 0 ? `+${formatRupee(val)}` : `-${formatRupee(Math.abs(val))}`}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {row.margin}% ROI
                  </div>
                </div>
              )
            },
            {
              key: 'status',
              label: 'Lifecycle Stage',
              render: (val) => <Badge status={val} />
            }
          ]}
          data={bikeProfitMatrix}
        />
      </Card>

      {/* Itemized Expenses Ledger */}
      <Card title="Itemized Service, Detailing & Transport Bills">
        <DataTable
          searchable={false}
          columns={[
            {
              key: 'expense_date',
              label: 'Date',
              render: (val) => <span style={{ color: 'var(--text-muted)' }}>{val}</span>
            },
            {
              key: 'expense_type',
              label: 'Category',
              render: (val) => (
                <Badge variant={val === 'service' ? 'primary' : val === 'repair' ? 'warning' : 'info'}>
                  {val}
                </Badge>
              )
            },
            {
              key: 'amount',
              label: 'Expense Amount',
              render: (val) => <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>{formatRupee(val)}</span>
            },
            {
              key: 'description',
              label: 'Work Completed / Parts Replaced',
              render: (val) => <span style={{ fontSize: '0.85rem' }}>{val}</span>
            }
          ]}
          data={expenses}
        />
      </Card>

      {/* NEW EXPENSE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Vehicle Refurbishment / Service Expense"
        subtitle="This expense will be added to the bike's cost basis for net profit calculation"
        maxWidth="540px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateExpense}>
              Record Expense
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <FormField label="Target Bike" required>
            <SelectDropdown
              value={selectedBikeId}
              onChange={(e) => setSelectedBikeId(e.target.value)}
              options={bikes.map(b => ({
                value: b.id,
                label: `${b.brand} ${b.model} - ${b.reg_number}`
              }))}
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Expense Category" required>
              <SelectDropdown
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
                options={[
                  { value: 'service', label: 'General Service & Oil Change' },
                  { value: 'repair', label: 'Mechanical / Parts Repair' },
                  { value: 'detailing', label: 'Body Polish & Detailing' },
                  { value: 'transport', label: 'Vehicle Transport / Towing' },
                  { value: 'documentation', label: 'RTO Stamp & Documentation' }
                ]}
              />
            </FormField>

            <FormField label="Amount Spent (₹)" required>
              <NumberInput
                prefix="₹"
                placeholder="2500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Date">
            <DateInput
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
          </FormField>

          <FormField label="Description of Work & Replaced Parts" required>
            <Textarea
              placeholder="e.g. Replaced front brake pads, Castrol 15W50 engine oil, Teflon body coat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
        </form>
      </Modal>
    </div>
  );
};

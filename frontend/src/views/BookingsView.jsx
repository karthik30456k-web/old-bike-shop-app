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
  DateInput
} from '../components/common';
import {
  BookmarkCheck,
  Plus,
  DollarSign,
  Receipt,
  Calendar,
  Phone,
  ArrowRight
} from 'lucide-react';

export const BookingsView = ({ onNavigate, onProceedToSale }) => {
  const [bookings, setBookings] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Booking State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [bookingAmount, setBookingAmount] = useState('5000');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('Google Pay / UPI');

  const loadData = async () => {
    try {
      setLoading(true);
      const [bkgRes, bikesRes] = await Promise.all([
        api.getBookings(),
        api.getBikes()
      ]);
      if (bkgRes && bkgRes.data) setBookings(bkgRes.data);
      if (bikesRes && bikesRes.data) {
        // Allow booking of available bikes
        const avail = bikesRes.data.filter(b => b.status === 'available');
        setBikes(avail.length > 0 ? avail : bikesRes.data);
        if (avail.length > 0 && !selectedBikeId) {
          setSelectedBikeId(avail[0].id);
          setAgreedPrice(avail[0].selling_price);
        }
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBikeChange = (id) => {
    setSelectedBikeId(id);
    const bike = bikes.find(b => b.id === id);
    if (bike) {
      setAgreedPrice(bike.selling_price);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedBikeId || !bookingAmount) {
      alert('Please fill customer name, phone, bike, and advance token amount.');
      return;
    }

    const bike = bikes.find(b => b.id === selectedBikeId);
    const pending = Number(agreedPrice || 0) - Number(bookingAmount || 0);

    try {
      await api.createBooking({
        bike_id: selectedBikeId,
        bike_title: bike ? `${bike.brand} ${bike.model} (${bike.reg_number})` : 'Bike',
        customer_name: customerName,
        customer_phone: customerPhone,
        booking_amount: Number(bookingAmount),
        agreed_price: Number(agreedPrice),
        pending_amount: pending > 0 ? pending : 0,
        expected_delivery: expectedDelivery,
        payment_mode: paymentMode,
        status: 'active'
      });
      setIsModalOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      alert('🎉 Booking confirmed! Token advance received and bike marked as RESERVED.');
      loadData();
    } catch (err) {
      alert('Failed to create booking: ' + err.message);
    }
  };

  const formatRupee = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

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
            Customer Token Bookings
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Hold stock with advance deposit, lock agreed price, and prepare delivery transfer.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          New Token Booking
        </Button>
      </div>

      {/* Bookings Table */}
      <Card title="Active & Completed Bookings">
        <DataTable
          searchable={true}
          searchPlaceholder="Search booking id, customer or bike..."
          columns={[
            {
              key: 'booking_number',
              label: 'Booking ID',
              render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{val}</span>
            },
            {
              key: 'customer_name',
              label: 'Customer',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 700 }}>{row.customer_name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.customer_phone}</div>
                </div>
              )
            },
            {
              key: 'bike_title',
              label: 'Reserved Motorcycle',
              render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
            },
            {
              key: 'booking_amount',
              label: 'Token Paid',
              render: (val) => (
                <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                  {formatRupee(val)}
                </span>
              )
            },
            {
              key: 'pending_amount',
              label: 'Balance Due',
              render: (val) => (
                <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>
                  {formatRupee(val)}
                </span>
              )
            },
            {
              key: 'expected_delivery',
              label: 'Exp. Delivery',
              render: (val) => <span style={{ fontSize: '0.82rem' }}>{val}</span>
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val === 'active' ? 'reserved' : val} />
            },
            {
              key: 'actions',
              label: 'Action',
              render: (_, row) => (
                row.status === 'active' ? (
                  <Button
                    size="sm"
                    variant="primary"
                    iconRight={ArrowRight}
                    onClick={() => {
                      if (onProceedToSale) {
                        onProceedToSale(row);
                      } else {
                        onNavigate('sales');
                      }
                    }}
                  >
                    Generate Invoice
                  </Button>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sale Finalized</span>
                )
              )
            }
          ]}
          data={bookings}
        />
      </Card>

      {/* NEW BOOKING MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Customer Token Booking"
        subtitle="Advance deposit will lock the vehicle from other buyers"
        maxWidth="600px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateBooking}>
              Confirm Booking & Reserve Bike
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Customer Name" required>
              <TextInput
                placeholder="e.g. Murugan Selvam"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </FormField>

            <FormField label="Mobile Number" required>
              <TextInput
                placeholder="+91 9840X XXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Select Bike to Reserve" required>
            <SelectDropdown
              value={selectedBikeId}
              onChange={(e) => handleBikeChange(e.target.value)}
              options={bikes.map(b => ({
                value: b.id,
                label: `${b.brand} ${b.model} - ${b.reg_number} (${formatRupee(b.selling_price)})`
              }))}
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Agreed Selling Price" required>
              <NumberInput
                prefix="₹"
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(e.target.value)}
              />
            </FormField>

            <FormField label="Booking Token Advance (₹)" required>
              <NumberInput
                prefix="₹"
                value={bookingAmount}
                onChange={(e) => setBookingAmount(e.target.value)}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Expected Delivery Date">
              <DateInput
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
              />
            </FormField>

            <FormField label="Payment Mode">
              <SelectDropdown
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                options={[
                  { value: 'Google Pay / UPI', label: 'Google Pay / UPI' },
                  { value: 'Cash Advance', label: 'Cash Advance' },
                  { value: 'Credit/Debit Card', label: 'Credit/Debit Card' },
                  { value: 'Bank Transfer (IMPS)', label: 'Bank Transfer (IMPS)' }
                ]}
              />
            </FormField>
          </div>

          <div style={{
            padding: '12px',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calculated Balance Pending:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-warning)' }}>
              {formatRupee(Number(agreedPrice || 0) - Number(bookingAmount || 0))}
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
};

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
  ThermalBill4Inch
} from '../components/common';
import { printA4Document } from '../utils/printHelper';
import {
  Receipt,
  Plus,
  Printer,
  FileCheck,
  CheckCircle,
  DollarSign,
  Bike,
  User,
  ShieldCheck
} from 'lucide-react';

export const SalesInvoicingView = ({ incomingBooking }) => {
  const [sales, setSales] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);
  const [invoiceViewMode, setInvoiceViewMode] = useState('4inch');

  // Form State
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [rtoCharges, setRtoCharges] = useState('1500');
  const [insuranceCharges, setInsuranceCharges] = useState('0');
  const [paymentMode, setPaymentMode] = useState('UPI + Bank Transfer');

  const loadData = async () => {
    try {
      setLoading(true);
      const [salesRes, bikesRes] = await Promise.all([
        api.getSales(),
        api.getBikes()
      ]);
      if (salesRes && salesRes.data) setSales(salesRes.data);
      if (bikesRes && bikesRes.data) {
        // Can sell available or reserved bikes
        const sellable = bikesRes.data.filter(b => b.status !== 'sold');
        setBikes(sellable);
        if (sellable.length > 0 && !selectedBikeId) {
          setSelectedBikeId(sellable[0].id);
          setVehiclePrice(sellable[0].selling_price);
        }
      }
    } catch (err) {
      console.error('Failed to load sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pre-fill from booking if opened from bookings view
  useEffect(() => {
    if (incomingBooking) {
      setIsModalOpen(true);
      setCustomerName(incomingBooking.customer_name);
      setCustomerPhone(incomingBooking.customer_phone);
      setSelectedBikeId(incomingBooking.bike_id);
      setVehiclePrice(incomingBooking.agreed_price);
      if (incomingBooking.booking_amount) {
        // Discount or advance handled
        setDiscount('0');
      }
    }
  }, [incomingBooking]);

  const handleBikeChange = (id) => {
    setSelectedBikeId(id);
    const bike = bikes.find(b => b.id === id);
    if (bike) {
      setVehiclePrice(bike.selling_price);
    }
  };

  const calculateTotal = () => {
    const vp = Number(vehiclePrice || 0);
    const disc = Number(discount || 0);
    const rto = Number(rtoCharges || 0);
    const ins = Number(insuranceCharges || 0);
    return Math.max(0, vp - disc + rto + ins);
  };

  const handleFinalizeSale = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedBikeId || !vehiclePrice) {
      alert('Please fill customer details, selected bike, and vehicle price.');
      return;
    }

    const total = calculateTotal();
    const bike = bikes.find(b => b.id === selectedBikeId);

    try {
      const res = await api.createSale({
        bike_id: selectedBikeId,
        bike_title: bike ? `${bike.brand} ${bike.model} (${bike.reg_number})` : 'Vehicle',
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress || 'Local Resident',
        vehicle_price: Number(vehiclePrice),
        discount: Number(discount || 0),
        rto_transfer_charges: Number(rtoCharges || 0),
        insurance_charges: Number(insuranceCharges || 0),
        paid_amount: total,
        payment_mode: paymentMode,
        delivery_date: new Date().toISOString().split('T')[0],
        documents_handed: ['Original RC', 'Form 29/30 Transfer', 'Sale Agreement', 'Two Keys', 'Showroom Warranty']
      });

      setIsModalOpen(false);
      alert('🎉 Sale finalized! Invoice generated and vehicle status changed to SOLD.');
      loadData();

      // Show invoice immediately for printing
      setSelectedInvoiceForPrint({
        ...res.data,
        bike
      });
    } catch (err) {
      alert('Failed to finalize sale: ' + err.message);
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
            Sales & Vehicle Invoicing
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Final sales settlement, RTO documentation charges, delivery handover, and tax invoice generation.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          New Sales Billing
        </Button>
      </div>

      {/* Sales Invoices List */}
      <Card title="Completed Sales & Tax Invoices">
        <DataTable
          searchable={true}
          searchPlaceholder="Search invoice #, customer or bike..."
          columns={[
            {
              key: 'invoice_number',
              label: 'Invoice #',
              render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{val}</span>
            },
            {
              key: 'sale_date',
              label: 'Date',
              render: (val) => <span style={{ color: 'var(--text-muted)' }}>{val}</span>
            },
            {
              key: 'customer_name',
              label: 'Customer Details',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 700 }}>{row.customer_name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.customer_phone}</div>
                </div>
              )
            },
            {
              key: 'bike_title',
              label: 'Sold Two-Wheeler',
              render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
            },
            {
              key: 'total_amount',
              label: 'Final Invoice Value',
              render: (val) => (
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {formatRupee(val)}
                </span>
              )
            },
            {
              key: 'payment_mode',
              label: 'Payment Mode',
              render: (val) => <Badge variant="secondary">{val}</Badge>
            },
            {
              key: 'delivery_status',
              label: 'Delivery',
              render: (val) => <Badge status="available">{val || 'Delivered'}</Badge>
            },
            {
              key: 'actions',
              label: 'Bill / Invoice',
              render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Receipt}
                    onClick={() => {
                      setSelectedInvoiceForPrint(row);
                      setInvoiceViewMode('4inch');
                    }}
                    title="Print 4-Inch Thermal POS Bill"
                  >
                    4" Bill
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Printer}
                    onClick={() => {
                      setSelectedInvoiceForPrint(row);
                      setInvoiceViewMode('a4');
                    }}
                    title="Print Standard A4 Tax Invoice"
                  >
                    A4
                  </Button>
                </div>
              )
            }
          ]}
          data={sales}
        />
      </Card>

      {/* NEW SALE BILLING MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Vehicle Sale & Tax Invoice"
        subtitle="This action will deduct discounts, calculate RTO charges, and mark bike as SOLD."
        maxWidth="680px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFinalizeSale}>
              Confirm Payment & Generate Invoice
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Customer */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '10px' }}>
              1. Buyer Information
            </h4>
            <div className="form-grid-2">
              <FormField label="Buyer Full Name" required>
                <TextInput
                  placeholder="e.g. Rajesh Kumar"
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

              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Buyer Address (For RTO RC Transfer)">
                  <TextInput
                    placeholder="e.g. No 15, Mylapore, Chennai - 600004"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Vehicle & Pricing Breakdown */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '10px' }}>
              2. Vehicle & Financial Settlement
            </h4>

            <FormField label="Select Bike to Sell" required>
              <SelectDropdown
                value={selectedBikeId}
                onChange={(e) => handleBikeChange(e.target.value)}
                options={bikes.map(b => ({
                  value: b.id,
                  label: `${b.brand} ${b.model} - ${b.reg_number} (${formatRupee(b.selling_price)})`
                }))}
              />
            </FormField>

            <div className="form-grid-2">
              <FormField label="Base Vehicle Price (₹)" required>
                <NumberInput
                  prefix="₹"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(e.target.value)}
                />
              </FormField>

              <FormField label="Showroom Discount (₹)">
                <NumberInput
                  prefix="₹"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </FormField>

              <FormField label="RTO Ownership Transfer (₹)">
                <NumberInput
                  prefix="₹"
                  value={rtoCharges}
                  onChange={(e) => setRtoCharges(e.target.value)}
                />
              </FormField>

              <FormField label="Insurance Endorsement (₹)">
                <NumberInput
                  prefix="₹"
                  value={insuranceCharges}
                  onChange={(e) => setInsuranceCharges(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Payment Mode">
              <SelectDropdown
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                options={[
                  { value: 'UPI / Google Pay', label: 'UPI / Google Pay' },
                  { value: 'Bank Transfer (NEFT/RTGS)', label: 'Bank Transfer (NEFT/RTGS)' },
                  { value: 'Cash + UPI', label: 'Cash + UPI' },
                  { value: 'Full Cash', label: 'Full Cash' },
                  { value: 'Debit/Credit Card', label: 'Debit/Credit Card' }
                ]}
              />
            </FormField>

            {/* Total Calculation Display */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Net Payable Amount</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Vehicle ₹{vehiclePrice || 0} - Disc ₹{discount || 0} + RTO ₹{rtoCharges || 0}
                </span>
              </div>
              <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary)' }}>
                {formatRupee(calculateTotal())}
              </span>
            </div>
          </div>
        </form>
      </Modal>

      {/* PRINTABLE INVOICE / 4-INCH BILL MODAL */}
      {selectedInvoiceForPrint && (() => {
        const selectedBike = bikes.find(b => b.id === selectedInvoiceForPrint.bike_id);
        return (
          <Modal
            isOpen={Boolean(selectedInvoiceForPrint)}
            onClose={() => setSelectedInvoiceForPrint(null)}
            title={invoiceViewMode === '4inch' ? `4-Inch Thermal POS Bill #${selectedInvoiceForPrint.invoice_number}` : `Sales Tax Invoice #${selectedInvoiceForPrint.invoice_number}`}
            subtitle={invoiceViewMode === '4inch' ? '3" (80mm TVS-E RP 3230) & 4" (100mm) Thermal Roll • Ready to Print' : 'Standard A4 Tax & Delivery Invoice Copy'}
            maxWidth={invoiceViewMode === '4inch' ? '460px' : '720px'}
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Format: <strong>{invoiceViewMode === '4inch' ? 'Thermal Roll (80mm TVS-E / 100mm)' : 'Standard A4'}</strong>
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {invoiceViewMode === 'a4' && (
                    <Button
                      variant="primary"
                      icon={Printer}
                      onClick={() => printA4Document('printable-a4-invoice', `Invoice-${selectedInvoiceForPrint.invoice_number}`)}
                    >
                      Print A4 Invoice
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => setSelectedInvoiceForPrint(null)}>
                    Done
                  </Button>
                </div>
              </div>
            }
          >
            {/* Format Switcher Pills */}
            <div style={{
              display: 'flex',
              gap: '6px',
              padding: '4px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              border: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => setInvoiceViewMode('4inch')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  backgroundColor: invoiceViewMode === '4inch' ? 'var(--primary)' : 'transparent',
                  color: invoiceViewMode === '4inch' ? '#ffffff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Receipt size={15} />
                <span>🧾 Thermal POS Bill (80mm TVS-E / 100mm)</span>
              </button>

              <button
                onClick={() => setInvoiceViewMode('a4')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  backgroundColor: invoiceViewMode === 'a4' ? 'var(--primary)' : 'transparent',
                  color: invoiceViewMode === 'a4' ? '#ffffff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={15} />
                <span>📄 Standard A4 Tax Invoice</span>
              </button>
            </div>

            {/* View Mode 1: 4-Inch Thermal POS Bill */}
            {invoiceViewMode === '4inch' ? (
              <ThermalBill4Inch
                invoice={selectedInvoiceForPrint}
                bike={selectedBike}
                onClose={() => setSelectedInvoiceForPrint(null)}
              />
            ) : (
              /* View Mode 2: Standard A4 Tax Invoice */
              <div
                id="printable-a4-invoice"
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  fontFamily: 'sans-serif'
                }}
              >
                {/* Showroom Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '14px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>VELOCE WHEELS</h2>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>Premium Certified Pre-Owned Two-Wheelers</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>GSTIN: 33ABCDE1234F1Z5 • Chennai, Tamil Nadu</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>TAX INVOICE</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>{selectedInvoiceForPrint.invoice_number}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {selectedInvoiceForPrint.sale_date}</div>
                  </div>
                </div>

                {/* Customer & Vehicle Grid */}
                <div className="form-grid-2" style={{ gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>BUYER DETAILS</div>
                    <div><strong>Name:</strong> {selectedInvoiceForPrint.customer_name}</div>
                    <div><strong>Phone:</strong> {selectedInvoiceForPrint.customer_phone}</div>
                    <div><strong>Address:</strong> {selectedInvoiceForPrint.customer_address || 'Chennai, Tamil Nadu'}</div>
                  </div>

                  <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>VEHICLE SOLD</div>
                    <div><strong>Model:</strong> {selectedInvoiceForPrint.bike_title}</div>
                    <div><strong>Fuel Mileage:</strong> <span style={{ color: '#047857', fontWeight: 700 }}>⚡ {selectedBike?.mileage || '48 km/l'}</span></div>
                    <div><strong>Delivery Status:</strong> Delivered</div>
                    <div><strong>Payment Mode:</strong> {selectedInvoiceForPrint.payment_mode}</div>
                  </div>
                </div>

                {/* Financial Line Items */}
                <div className="table-container-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginTop: '8px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Item Description</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px' }}>Pre-Owned Two-Wheeler ({selectedInvoiceForPrint.bike_title})</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>{formatRupee(selectedInvoiceForPrint.vehicle_price)}</td>
                      </tr>
                      {Number(selectedInvoiceForPrint.discount || 0) > 0 && (
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#10b981' }}>
                          <td style={{ padding: '8px' }}>Special Showroom Discount</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>-{formatRupee(selectedInvoiceForPrint.discount)}</td>
                        </tr>
                      )}
                      {Number(selectedInvoiceForPrint.rto_transfer_charges || 0) > 0 && (
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px' }}>RTO RC Ownership Transfer & Documentation</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>+{formatRupee(selectedInvoiceForPrint.rto_transfer_charges)}</td>
                        </tr>
                      )}
                      <tr style={{ fontWeight: 800, fontSize: '1.05rem', backgroundColor: '#f8fafc' }}>
                        <td style={{ padding: '12px 8px' }}>Total Amount Paid (Full Settlement)</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', color: '#0f172a' }}>
                          {formatRupee(selectedInvoiceForPrint.total_amount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Handover & Stamp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Documents Handed Over:</div>
                    <div style={{ color: '#64748b' }}>• Original RC Book • Valid Insurance • Form 29 & 30 • 2 Sets of Keys</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ border: '2px solid #0f172a', padding: '6px 14px', borderRadius: '4px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      VELOCE WHEELS OFFICIAL SEAL
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Authorized Signatory</span>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        );
      })()}
    </div>
  );
};

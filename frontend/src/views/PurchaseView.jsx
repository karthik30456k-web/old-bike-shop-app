import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Card,
  Button,
  DataTable,
  Modal,
  FormField,
  TextInput,
  NumberInput,
  SelectDropdown,
  Textarea,
  Badge,
  BikePhotoUploader,
  validateBikePhotos
} from '../components/common';
import {
  PlusCircle,
  FileCheck,
  CheckCircle,
  User,
  Bike,
  Receipt,
  FileText,
  DollarSign
} from 'lucide-react';

export const PurchaseView = ({ onNavigate, onIntakeComplete }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Intake Form
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [sellerIdProof, setSellerIdProof] = useState('Aadhaar Card');

  // Bike Details
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState(2021);
  const [regNumber, setRegNumber] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [color, setColor] = useState('');
  const [mileage, setMileage] = useState('45 km/l');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [expectedSellingPrice, setExpectedSellingPrice] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer (NEFT/RTGS)');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState(['', '', '', '']);

  // Documents verified
  const [docsVerified, setDocsVerified] = useState({
    rc: true,
    form29: true,
    form30: true,
    noc: false,
    insurance: true
  });

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const res = await api.getPurchases();
      if (res && res.data) {
        setPurchases(res.data);
      }
    } catch (err) {
      console.error('Failed to load purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleCreatePurchase = async (e) => {
    e.preventDefault();
    if (!sellerName || !sellerPhone || !brand || !model || !purchasePrice) {
      alert('Please fill in Seller Name, Phone, Brand, Model, and Purchase Price.');
      return;
    }

    // Enforce 4 mandatory photos (Front, Front Tyre, Back Tyre, Back Look)
    const photoCheck = validateBikePhotos(photos);
    if (!photoCheck.isValid) {
      alert(`⚠️ ${photoCheck.errorMessage}`);
      return;
    }

    try {
      const payload = {
        seller_name: sellerName,
        seller_phone: sellerPhone,
        seller_address: sellerAddress,
        seller_id_proof: sellerIdProof,
        purchase_price: Number(purchasePrice),
        expected_selling_price: Number(expectedSellingPrice || purchasePrice * 1.2),
        payment_mode: paymentMode,
        notes,
        bike: {
          brand,
          model,
          variant,
          year: Number(year),
          reg_number: regNumber.toUpperCase(),
          km_driven: Number(kmDriven || 0),
          mileage: mileage || '45 km/l',
          color,
          bike_condition: 'Purchase Intake Inspected',
          photos: photos.filter(p => p && p.trim())
        }
      };

      const result = await api.createPurchase(payload);
      setIsModalOpen(false);
      loadPurchases();

      // Reset form
      setSellerName('');
      setSellerPhone('');
      setModel('');
      setRegNumber('');
      setPurchasePrice('');
      setExpectedSellingPrice('');
      setPhotos(['', '', '', '']);

      alert('🎉 Bike successfully purchased and added to inventory stock as "Available"!');
      if (onIntakeComplete && result.data && result.data.bike) {
        onIntakeComplete(result.data.bike);
      }
    } catch (err) {
      alert('Failed to record purchase: ' + err.message);
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
            Bike Purchase & Seller Intake
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Showroom buying process: Seller KYC, inspection agreement, document transfer, and automatic inventory entry.
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setIsModalOpen(true)}
        >
          New Seller Bike Purchase
        </Button>
      </div>

      {/* Showroom Purchase Workflow Banner */}
      <Card style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              1
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'block' }}>Seller KYC</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Name, phone, Aadhaar</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              2
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'block' }}>Bike Valuation</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Inspect specs & price</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              3
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'block' }}>Documents</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>RC, Form 29 & 30</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              ✓
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'block' }}>Stock Active</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-success)' }}>Auto listed for sale</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Purchases Record Table */}
      <Card
        title="Purchase Ledger & Seller Agreements"
        subtitle="Historical records of all acquired two-wheelers"
      >
        <DataTable
          searchable={true}
          searchPlaceholder="Search seller name, phone, agreement..."
          columns={[
            {
              key: 'purchase_date',
              label: 'Date',
              render: (val) => <span style={{ color: 'var(--text-muted)' }}>{val}</span>
            },
            {
              key: 'seller_name',
              label: 'Seller Details',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 700 }}>{row.seller_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.seller_phone}</div>
                </div>
              )
            },
            {
              key: 'seller_id_proof',
              label: 'KYC Document',
              render: (val) => <span style={{ fontSize: '0.8rem' }}>{val || 'Verified'}</span>
            },
            {
              key: 'purchase_price',
              label: 'Acquisition Price',
              render: (val) => (
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatRupee(val)}
                </span>
              )
            },
            {
              key: 'payment_mode',
              label: 'Payment Method',
              render: (val) => <Badge variant="secondary">{val}</Badge>
            },
            {
              key: 'notes',
              label: 'Transfer Remarks',
              render: (val) => (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px', display: 'inline-block' }}>
                  {val || 'Form 29 & 30 received'}
                </span>
              )
            }
          ]}
          data={purchases}
        />
      </Card>

      {/* NEW PURCHASE INTAKE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Bike Purchase Intake"
        subtitle="Fill seller agreement details. This bike will automatically be registered in stock."
        maxWidth="720px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreatePurchase}>
              Finalize Purchase & Add to Stock
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Seller Details */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> 1. Seller Information (Owner Details)
            </h4>
            <div className="form-grid-2">
              <FormField label="Seller Full Name" required>
                <TextInput
                  placeholder="e.g. Vigneshwaran S"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                />
              </FormField>
              <FormField label="Seller Mobile Number" required>
                <TextInput
                  placeholder="+91 9840X XXXXX"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                />
              </FormField>
              <FormField label="ID Proof Type">
                <SelectDropdown
                  value={sellerIdProof}
                  onChange={(e) => setSellerIdProof(e.target.value)}
                  options={[
                    { value: 'Aadhaar Card', label: 'Aadhaar Card' },
                    { value: 'Driving License', label: 'Driving License' },
                    { value: 'PAN Card', label: 'PAN Card' },
                    { value: 'Voter ID', label: 'Voter ID' }
                  ]}
                />
              </FormField>
              <FormField label="Seller Address / Area">
                <TextInput
                  placeholder="e.g. T. Nagar, Chennai"
                  value={sellerAddress}
                  onChange={(e) => setSellerAddress(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Section 2: Bike Specifications */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bike size={16} /> 2. Vehicle Details
            </h4>
            <div className="form-grid-2">
              <FormField label="Brand" required>
                <SelectDropdown
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  options={[
                    { value: 'Royal Enfield', label: 'Royal Enfield' },
                    { value: 'Yamaha', label: 'Yamaha' },
                    { value: 'KTM', label: 'KTM' },
                    { value: 'Honda', label: 'Honda' },
                    { value: 'TVS', label: 'TVS' },
                    { value: 'Bajaj', label: 'Bajaj' },
                    { value: 'Suzuki', label: 'Suzuki' },
                    { value: 'Hero', label: 'Hero' }
                  ]}
                />
              </FormField>
              <FormField label="Model Name" required>
                <TextInput
                  placeholder="e.g. Classic 350 / FZ-S / Activa 6G"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </FormField>
              <FormField label="Variant / Edition">
                <TextInput
                  placeholder="e.g. Stealth Black ABS"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                />
              </FormField>
              <FormField label="Reg Number" required>
                <TextInput
                  placeholder="e.g. TN 07 CW 7721"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                />
              </FormField>
              <FormField label="Reg Year">
                <NumberInput
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min={2005}
                  max={2026}
                />
              </FormField>
              <FormField label="KM Driven">
                <NumberInput
                  suffix="KM"
                  value={kmDriven}
                  onChange={(e) => setKmDriven(e.target.value)}
                />
              </FormField>
              <FormField label="Fuel Mileage (km/l)">
                <TextInput
                  placeholder="e.g. 45 km/l"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                />
              </FormField>
              <FormField label="Color">
                <TextInput
                  placeholder="e.g. Stealth Black"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Section 3: Financial & Payment */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={16} /> 3. Purchase Price & Payment Mode
            </h4>
            <div className="form-grid-2">
              <FormField label="Purchase Price (Paid to Seller)" required helperText="Cost basis for profit calculations">
                <NumberInput
                  prefix="₹"
                  placeholder="80000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </FormField>

              <FormField label="Target Selling Price" helperText="Expected listing price in showroom">
                <NumberInput
                  prefix="₹"
                  placeholder="95000"
                  value={expectedSellingPrice}
                  onChange={(e) => setExpectedSellingPrice(e.target.value)}
                />
              </FormField>

              <FormField label="Payment Mode">
                <SelectDropdown
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  options={[
                    { value: 'Bank Transfer (NEFT/RTGS)', label: 'Bank Transfer (NEFT/RTGS)' },
                    { value: 'IMPS Instant Transfer', label: 'IMPS Instant Transfer' },
                    { value: 'Google Pay / PhonePe UPI', label: 'Google Pay / PhonePe UPI' },
                    { value: 'Cash Settlement', label: 'Cash Settlement' },
                    { value: 'Cheque', label: 'Cheque' }
                  ]}
                />
              </FormField>

              <FormField label="Handover Remarks">
                <TextInput
                  placeholder="e.g. 2 sets of keys, duplicate RC, tool kit"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Section 4: Mandatory 4-Photo Pack (Front, Front Tyre, Back Tyre, Back Look) */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <BikePhotoUploader
              photos={photos}
              onChange={setPhotos}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

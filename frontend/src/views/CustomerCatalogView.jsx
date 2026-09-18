import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Card,
  Button,
  Badge,
  Modal,
  FormField,
  TextInput,
  NumberInput,
  SelectDropdown,
  DateInput,
  Textarea,
  BikeViewer3D,
  BikeCardImageWith3D
} from '../components/common';
import {
  Bike,
  ShieldCheck,
  CalendarCheck,
  BookmarkCheck,
  Phone,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  Gauge,
  Fuel,
  CreditCard,
  MessageCircle,
  RotateCw
} from 'lucide-react';

export const CustomerCatalogView = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedBike, setSelectedBike] = useState(null);
  const [modal3D, setModal3D] = useState(null);
  const [isTestRideModalOpen, setIsTestRideModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Test Ride Form
  const [trCustomerName, setTrCustomerName] = useState('');
  const [trCustomerPhone, setTrCustomerPhone] = useState('');
  const [trDate, setTrDate] = useState(new Date().toISOString().split('T')[0]);
  const [trTime, setTrTime] = useState('11:00 AM');

  // Booking Form
  const [bkCustomerName, setBkCustomerName] = useState('');
  const [bkCustomerPhone, setBkCustomerPhone] = useState('');
  const [bkPaymentMode, setBkPaymentMode] = useState('Google Pay / PhonePe');

  const loadBikes = async () => {
    try {
      setLoading(true);
      const res = await api.getBikes({
        status: 'all', // Show all but mark availability
        brand: selectedBrand,
        maxPrice,
        search: searchQuery
      });
      if (res && res.data) setBikes(res.data);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBikes();
  }, [selectedBrand, maxPrice, searchQuery]);

  const handleBookTestRide = async (e) => {
    e.preventDefault();
    if (!trCustomerName || !trCustomerPhone) {
      alert('Please enter your name and phone number.');
      return;
    }

    try {
      await api.createTestRide({
        customer_name: trCustomerName,
        customer_phone: trCustomerPhone,
        bike_id: selectedBike.id,
        bike_title: `${selectedBike.brand} ${selectedBike.model} (${selectedBike.reg_number})`,
        scheduled_date: trDate,
        scheduled_time: trTime,
        staff_name: 'Karthik Raja',
        status: 'requested',
        feedback: 'Online customer request from website'
      });

      // Also create an enquiry in pipeline
      await api.createEnquiry({
        customer_name: trCustomerName,
        phone: trCustomerPhone,
        bike_id: selectedBike.id,
        bike_title: `${selectedBike.brand} ${selectedBike.model}`,
        budget: selectedBike.selling_price,
        source: 'Website Online Enquiry',
        stage: 'test_ride',
        notes: `Customer requested test ride on ${trDate} at ${trTime}`
      });

      setIsTestRideModalOpen(false);
      setTrCustomerName('');
      setTrCustomerPhone('');
      alert('🎉 Test Ride Request Received! Our showroom team will call you within 15 minutes to confirm.');
    } catch (err) {
      alert('Failed to submit request: ' + err.message);
    }
  };

  const handleBookToken = async (e) => {
    e.preventDefault();
    if (!bkCustomerName || !bkCustomerPhone) {
      alert('Please enter your name and phone number.');
      return;
    }

    try {
      await api.createBooking({
        bike_id: selectedBike.id,
        bike_title: `${selectedBike.brand} ${selectedBike.model} (${selectedBike.reg_number})`,
        customer_name: bkCustomerName,
        customer_phone: bkCustomerPhone,
        booking_amount: 5000,
        agreed_price: selectedBike.selling_price,
        pending_amount: selectedBike.selling_price - 5000,
        expected_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payment_mode: bkPaymentMode,
        status: 'active'
      });

      setIsBookingModalOpen(false);
      setBkCustomerName('');
      setBkCustomerPhone('');
      alert('🎉 Congratulations! Your bike has been reserved with ₹5,000 token advance. Delivery transfer initiated!');
      loadBikes();
    } catch (err) {
      alert('Failed to book: ' + err.message);
    }
  };

  const formatRupee = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Banner */}
      <div
        style={{
          padding: '32px 28px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--primary-bg)',
          color: 'var(--primary)',
          fontSize: '0.78rem',
          fontWeight: 700,
          width: 'fit-content',
          border: '1px solid var(--primary-border)'
        }}>
          <ShieldCheck size={14} /> 100% 14-Point Inspected & Certified Showroom Bikes
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
          Find Your Perfect Pre-Owned Two-Wheeler
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: 0 }}>
          Hand-picked motorcycles and scooters with verified single ownership, genuine service records, original RC transfer assistance, and doorstep delivery.
        </p>
      </div>

      {/* Customer Filter Bar */}
      <Card style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          alignItems: 'center'
        }}>
          <TextInput
            placeholder="Search Yamaha, Bullet, Duke, Activa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />

          <SelectDropdown
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            options={[
              { value: 'all', label: 'All Brands (All Makes)' },
              { value: 'Yamaha', label: 'Yamaha' },
              { value: 'Royal Enfield', label: 'Royal Enfield' },
              { value: 'KTM', label: 'KTM' },
              { value: 'Honda', label: 'Honda' },
              { value: 'TVS', label: 'TVS' },
              { value: 'Bajaj', label: 'Bajaj' },
              { value: 'Suzuki', label: 'Suzuki' }
            ]}
          />

          <SelectDropdown
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            options={[
              { value: '', label: 'Any Budget (All Prices)' },
              { value: '60000', label: 'Under ₹60,000' },
              { value: '90000', label: 'Under ₹90,000' },
              { value: '120000', label: 'Under ₹1,20,000' },
              { value: '160000', label: 'Under ₹1,60,000' },
              { value: '200000', label: 'Under ₹2,00,000' }
            ]}
          />
        </div>
      </Card>

      {/* Bike Showcase Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '18px'
      }}>
        {bikes.map((bike) => {
          const isAvailable = bike.status === 'available';
          return (
            <Card
              key={bike.id}
              onClick={() => setSelectedBike(bike)}
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* 3D Interactive Bike Image with hover scroller & 360 badge */}
              <div style={{ position: 'relative' }}>
                <BikeCardImageWith3D
                  bike={bike}
                  photos={bike.photos}
                  onOpen3D={(b) => setModal3D(b)}
                  height="210px"
                />

                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 7 }}>
                  <Badge status={bike.status} />
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  zIndex: 7
                }}>
                  <ShieldCheck size={12} color="var(--color-success)" />
                  <span>Certified 14-Pt Checked</span>
                </div>
              </div>

              {/* Bike Details */}
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {bike.brand}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {bike.model}
                  </h3>
                  {bike.variant && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bike.variant}</p>
                  )}

                  {/* Specs Quick Strip */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))',
                    gap: '6px',
                    margin: '12px 0',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-xs)',
                    textAlign: 'center',
                    fontSize: '0.76rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Year</span>
                      <strong>{bike.year}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>KM</span>
                      <strong>{Number(bike.km_driven).toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Mileage</span>
                      <strong style={{ color: 'var(--color-success-text)' }}>{bike.mileage || '45 km/l'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Owner</span>
                      <strong>{bike.owner_count || 1}st</strong>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      Fixed Price
                    </span>
                    <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatRupee(bike.selling_price)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isAvailable ? 'primary' : 'secondary'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBike(bike);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* BIKE DETAILS MODAL */}
      {selectedBike && (
        <Modal
          isOpen={Boolean(selectedBike)}
          onClose={() => setSelectedBike(null)}
          title={`${selectedBike.brand} ${selectedBike.model}`}
          subtitle={`${selectedBike.year} Model • ${selectedBike.reg_number} • ${selectedBike.color}`}
          maxWidth="720px"
          footer={
            <>
              <a
                href={`https://wa.me/919840123456?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(selectedBike.brand + ' ' + selectedBike.model)}%20(${selectedBike.stock_id})`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  borderRadius: 'var(--radius-sm)',
                  marginRight: 'auto'
                }}
              >
                <MessageCircle size={15} /> WhatsApp Showroom
              </a>

              {selectedBike.status === 'available' ? (
                <>
                  <Button
                    variant="outline"
                    icon={CalendarCheck}
                    onClick={() => {
                      setIsTestRideModalOpen(true);
                    }}
                  >
                    Request Free Test Ride
                  </Button>
                  <Button
                    variant="primary"
                    icon={BookmarkCheck}
                    onClick={() => {
                      setIsBookingModalOpen(true);
                    }}
                  >
                    Book with Token ₹5,000
                  </Button>
                </>
              ) : (
                <Badge status={selectedBike.status} size="md" />
              )}
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Image Preview with 3D Turntable launcher */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#000' }}>
              <BikeCardImageWith3D
                bike={selectedBike}
                photos={selectedBike.photos}
                onOpen3D={(b) => setModal3D(b)}
                height="260px"
              />
            </div>

            <Button
              variant="outline"
              icon={RotateCw}
              onClick={() => setModal3D(selectedBike)}
              style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--primary-border)', color: 'var(--primary)', fontWeight: 700 }}
            >
              ⚡ Launch Full 360° 3D Virtual Showroom (Spin & Inspect)
            </Button>

            {/* 4-Angle Certified Inspection Pack (Front, Front Tyre, Back Tyre, Back Look) */}
            {selectedBike.photos && selectedBike.photos.length > 0 && (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    📸 4-Angle Verified Inspection Photos
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>
                    ⭐ Front & Back Tyres Inspected
                  </span>
                </div>
                <div className="mobile-photo-grid">
                  {['1. Front Look', '2. Front Tyre ⭐', '3. Back Tyre ⭐', '4. Back Look'].map((label, idx) => {
                    const pic = selectedBike.photos[idx];
                    return (
                      <div key={idx} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#000', position: 'relative' }}>
                        {pic ? (
                          <img src={pic} alt={label} style={{ width: '100%', height: '75px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>No photo</div>
                        )}
                        <span style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: idx === 1 || idx === 2 ? 'rgba(217, 119, 6, 0.88)' : 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          textAlign: 'center',
                          padding: '2px 4px'
                        }}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pricing Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showroom Drive-Away Price</span>
                <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatRupee(selectedBike.selling_price)}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>Estimated EMI from: <strong>₹{Math.round(selectedBike.selling_price / 24 * 1.08)} /mo</strong></div>
                <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>Zero Down Payment Available</div>
              </div>
            </div>

            {/* Key Specifications Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>KM Driven</span>
                <strong>{Number(selectedBike.km_driven).toLocaleString('en-IN')} KM</strong>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Engine</span>
                <strong>{selectedBike.engine_cc} CC ({selectedBike.fuel_type})</strong>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Fuel Mileage</span>
                <strong style={{ color: 'var(--color-success-text)' }}>{selectedBike.mileage || '45 km/l'}</strong>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Ownership</span>
                <strong>{selectedBike.owner_count || 1}st Owner</strong>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Registration</span>
                <strong>{selectedBike.reg_number}</strong>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Insurance</span>
                <strong>{selectedBike.insurance_status}</strong>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>RC Document</span>
                <strong>{selectedBike.rc_status || 'Original RC'}</strong>
              </div>
            </div>

            {/* Vehicle Description */}
            {selectedBike.description && (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {selectedBike.description}
              </p>
            )}

            {/* 14-Point Certification Guarantee Box */}
            <div style={{
              padding: '14px',
              backgroundColor: 'var(--color-success-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-success-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <ShieldCheck size={32} color="var(--color-success)" />
              <div>
                <strong style={{ color: 'var(--color-success)', fontSize: '0.9rem', display: 'block' }}>
                  Veloce Wheels 14-Point Certified Quality Assurance
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Clean engine compression, verified electrical harness, no accident history, and full RTO transfer guarantee.
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* REQUEST TEST RIDE MODAL */}
      {isTestRideModalOpen && selectedBike && (
        <Modal
          isOpen={isTestRideModalOpen}
          onClose={() => setIsTestRideModalOpen(false)}
          title={`Book Free Test Ride: ${selectedBike.brand} ${selectedBike.model}`}
          subtitle="Experience the bike with zero commitment at our showroom"
          maxWidth="520px"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsTestRideModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleBookTestRide}>
                Confirm Test Ride Request
              </Button>
            </>
          }
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FormField label="Your Full Name" required>
              <TextInput
                placeholder="e.g. Anand Natarajan"
                value={trCustomerName}
                onChange={(e) => setTrCustomerName(e.target.value)}
              />
            </FormField>

            <FormField label="Your Mobile Number" required>
              <TextInput
                placeholder="+91 9840X XXXXX"
                value={trCustomerPhone}
                onChange={(e) => setTrCustomerPhone(e.target.value)}
              />
            </FormField>

            <div className="form-grid-2">
              <FormField label="Preferred Date" required>
                <DateInput
                  value={trDate}
                  onChange={(e) => setTrDate(e.target.value)}
                />
              </FormField>

              <FormField label="Preferred Time Slot">
                <SelectDropdown
                  value={trTime}
                  onChange={(e) => setTrTime(e.target.value)}
                  options={[
                    { value: '10:00 AM', label: '10:00 AM' },
                    { value: '11:30 AM', label: '11:30 AM' },
                    { value: '02:00 PM', label: '02:00 PM' },
                    { value: '04:00 PM', label: '04:00 PM' },
                    { value: '05:30 PM', label: '05:30 PM' }
                  ]}
                />
              </FormField>
            </div>
          </form>
        </Modal>
      )}

      {/* BOOK WITH TOKEN MODAL */}
      {isBookingModalOpen && selectedBike && (
        <Modal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          title={`Reserve Bike: ${selectedBike.brand} ${selectedBike.model}`}
          subtitle="Pay token advance of ₹5,000 to hold this motorcycle exclusively"
          maxWidth="520px"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleBookToken}>
                Reserve with ₹5,000 Token
              </Button>
            </>
          }
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FormField label="Customer Full Name" required>
              <TextInput
                placeholder="e.g. Murugan Selvam"
                value={bkCustomerName}
                onChange={(e) => setBkCustomerName(e.target.value)}
              />
            </FormField>

            <FormField label="Mobile Number" required>
              <TextInput
                placeholder="+91 9840X XXXXX"
                value={bkCustomerPhone}
                onChange={(e) => setBkCustomerPhone(e.target.value)}
              />
            </FormField>

            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Advance Token Deposit:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹5,000</span>
            </div>

            <FormField label="Payment Mode">
              <SelectDropdown
                value={bkPaymentMode}
                onChange={(e) => setBkPaymentMode(e.target.value)}
                options={[
                  { value: 'Google Pay / PhonePe', label: 'Google Pay / PhonePe (UPI)' },
                  { value: 'Debit/Credit Card', label: 'Debit / Credit Card' },
                  { value: 'Net Banking', label: 'Net Banking (IMPS)' },
                  { value: 'Cash at Showroom', label: 'Pay Cash at Showroom Desk' }
                ]}
              />
            </FormField>
          </form>
        </Modal>
      )}

      {/* 3D VIRTUAL SHOWROOM TURNTABLE MODAL */}
      <BikeViewer3D
        bike={modal3D}
        isOpen={Boolean(modal3D)}
        onClose={() => setModal3D(null)}
      />
    </div>
  );
};

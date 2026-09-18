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
  Tabs,
  Textarea,
  BikeViewer3D,
  BikeCardImageWith3D,
  BikePhotoUploader,
  validateBikePhotos
} from '../components/common';
import {
  Bike,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  FileCheck,
  Eye,
  SlidersHorizontal,
  DollarSign,
  AlertCircle,
  RotateCw
} from 'lucide-react';

export const InventoryView = ({ onNavigate, onSelectBikeForInspection }) => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBikeDetails, setSelectedBikeDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modal3D, setModal3D] = useState(null);

  const defaultNewBikeForm = {
    brand: 'Yamaha',
    model: '',
    variant: '',
    year: new Date().getFullYear(),
    reg_number: '',
    km_driven: '',
    fuel_type: 'Petrol',
    engine_cc: 150,
    mileage: '45 km/l',
    color: '',
    owner_count: 1,
    insurance_status: 'Active',
    rc_status: 'Original Available',
    bike_condition: 'Excellent',
    purchase_price: '',
    selling_price: '',
    expected_price: '',
    description: '',
    photos: ['', '', '', '']
  };

  // New Bike Form state
  const [formData, setFormData] = useState(defaultNewBikeForm);

  const loadBikes = async () => {
    try {
      setLoading(true);
      const res = await api.getBikes({
        status: statusFilter,
        brand: brandFilter,
        search: searchQuery
      });
      if (res && res.data) {
        setBikes(res.data);
      }
    } catch (err) {
      console.error('Failed to load bikes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBikes();
  }, [statusFilter, brandFilter, searchQuery]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateBike = async (e) => {
    e.preventDefault();
    try {
      if (!formData.brand || !formData.model || !formData.selling_price) {
        alert('Please fill required brand, model, and selling price fields.');
        return;
      }

      // Enforce 4 mandatory photos (Front, Front Tyre, Back Tyre, Back Look)
      const photoCheck = validateBikePhotos(formData.photos);
      if (!photoCheck.isValid) {
        alert(`⚠️ ${photoCheck.errorMessage}`);
        return;
      }

      await api.createBike({
        ...formData,
        purchase_price: Number(formData.purchase_price || 0),
        selling_price: Number(formData.selling_price || 0),
        expected_price: Number(formData.expected_price || formData.selling_price),
        km_driven: Number(formData.km_driven || 0),
        year: Number(formData.year || 2021),
        photos: formData.photos.filter(p => p && p.trim())
      });
      setIsAddModalOpen(false);
      setFormData(defaultNewBikeForm);
      loadBikes();
    } catch (err) {
      alert('Failed to add bike: ' + err.message);
    }
  };

  const handleOpenDetails = async (bike) => {
    try {
      const res = await api.getBikeById(bike.id);
      setSelectedBikeDetails(res.data || bike);
      setIsDetailsModalOpen(true);
    } catch (err) {
      setSelectedBikeDetails(bike);
      setIsDetailsModalOpen(true);
    }
  };

  const handleStatusChange = async (bikeId, newStatus) => {
    try {
      await api.updateBike(bikeId, { status: newStatus });
      loadBikes();
      if (selectedBikeDetails && selectedBikeDetails.id === bikeId) {
        setSelectedBikeDetails(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const formatRupee = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

  const brandOptions = [
    { value: 'all', label: 'All Brands' },
    { value: 'Yamaha', label: 'Yamaha' },
    { value: 'Royal Enfield', label: 'Royal Enfield' },
    { value: 'KTM', label: 'KTM' },
    { value: 'Honda', label: 'Honda' },
    { value: 'TVS', label: 'TVS' },
    { value: 'Bajaj', label: 'Bajaj' },
    { value: 'Suzuki', label: 'Suzuki' },
    { value: 'Hero', label: 'Hero' }
  ];

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
            Bike Inventory Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Complete stock inventory with full specs, RC/Insurance status, and price breakdown.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Bike
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Status Tabs */}
          <Tabs
            activeTab={statusFilter}
            onChange={(tab) => setStatusFilter(tab)}
            tabs={[
              { id: 'all', label: 'All Stock' },
              { id: 'available', label: 'Available' },
              { id: 'reserved', label: 'Reserved' },
              { id: 'sold', label: 'Sold' }
            ]}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '640px' }}>
            {/* Brand Dropdown */}
            <div style={{ flex: '1 1 140px', minWidth: '130px' }}>
              <SelectDropdown
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                options={brandOptions}
                placeholder=""
              />
            </div>

            {/* Search Input */}
            <div style={{ flex: '2 1 180px', minWidth: '160px' }}>
              <TextInput
                placeholder="Search stock, reg no, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  background: viewMode === 'grid' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: viewMode === 'grid' ? 'var(--primary-text)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  background: viewMode === 'table' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: viewMode === 'table' ? 'var(--primary-text)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Inventory Grid View */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '18px'
        }}>
          {bikes.map((bike) => {
            return (
            <Card
              key={bike.id}
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* 3D Interactive Bike Image Banner with Hover Scroller & 360 Spin */}
              <div style={{ position: 'relative' }}>
                <BikeCardImageWith3D
                  bike={bike}
                  photos={bike.photos}
                  onOpen3D={(b) => setModal3D(b)}
                  height="190px"
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 7 }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: '#ffffff',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {bike.stock_id}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: '12px', left: '120px', zIndex: 7 }}>
                  <Badge status={bike.status} />
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {bike.brand}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {bike.model}
                      </h3>
                      {bike.variant && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bike.variant}</p>
                      )}
                    </div>
                  </div>

                  {/* Specs Chips */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    margin: '12px 0',
                    fontSize: '0.76rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
                      📅 {bike.year}
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
                      🛣️ {Number(bike.km_driven).toLocaleString('en-IN')} KM
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
                      👤 {bike.owner_count || 1}st Owner
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
                      🎨 {bike.color}
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', color: 'var(--color-success-text)', fontWeight: 600 }}>
                      ⚡ {bike.mileage || '45 km/l'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Reg: <strong style={{ color: 'var(--text-secondary)' }}>{bike.reg_number}</strong>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      Showroom Price
                    </span>
                    <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatRupee(bike.selling_price)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenDetails(bike)}
                      title="View Full Details & True Cost"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectBikeForInspection ? onSelectBikeForInspection(bike) : onNavigate('inspection')}
                      title="Run 14-Point Inspection"
                    >
                      <FileCheck size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ); })}
        </div>
      ) : (
        /* Table View */
        <Card>
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
                label: 'Bike',
                render: (_, row) => (
                  <div>
                    <div style={{ fontWeight: 700 }}>{row.brand} {row.model}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.year} • {row.color}</div>
                  </div>
                )
              },
              {
                key: 'reg_number',
                label: 'Reg Number',
                render: (val) => <span style={{ fontFamily: 'monospace' }}>{val}</span>
              },
              {
                key: 'km_driven',
                label: 'KM Driven',
                render: (val) => `${Number(val).toLocaleString('en-IN')} KM`
              },
              {
                key: 'mileage',
                label: 'Mileage',
                render: (val) => <span style={{ fontWeight: 600, color: 'var(--color-success-text)' }}>{val || '45 km/l'}</span>
              },
              {
                key: 'purchase_price',
                label: 'Purchase Cost',
                render: (val) => formatRupee(val)
              },
              {
                key: 'selling_price',
                label: 'Selling Price',
                render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatRupee(val)}</span>
              },
              {
                key: 'status',
                label: 'Status',
                render: (val, row) => (
                  <select
                    value={val}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                )
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  <Button size="sm" variant="secondary" onClick={() => handleOpenDetails(row)}>
                    Details
                  </Button>
                )
              }
            ]}
            data={bikes}
          />
        </Card>
      )}

      {/* ADD NEW BIKE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Bike to Inventory"
        subtitle="Enter vehicle specifications, purchase details, and selling pricing"
        maxWidth="680px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateBike}>
              Save to Stock
            </Button>
          </>
        }
        <form className="form-grid-2">
          <FormField label="Brand" required>
            <SelectDropdown
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              options={brandOptions.filter(b => b.value !== 'all')}
            />
          </FormField>

          <FormField label="Model Name" required>
            <TextInput
              placeholder="e.g. Classic 350 / FZ-S V3"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
            />
          </FormField>

          <FormField label="Variant / Edition">
            <TextInput
              placeholder="e.g. Dark Stealth ABS"
              value={formData.variant}
              onChange={(e) => handleInputChange('variant', e.target.value)}
            />
          </FormField>

          <FormField label="Manufacturing / Reg Year" required>
            <NumberInput
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              min={2005}
              max={2026}
            />
          </FormField>

          <FormField label="Registration Number" required>
            <TextInput
              placeholder="e.g. TN 09 BX 4589"
              value={formData.reg_number}
              onChange={(e) => handleInputChange('reg_number', e.target.value.toUpperCase())}
            />
          </FormField>

          <FormField label="KM Driven" required>
            <NumberInput
              suffix="KM"
              value={formData.km_driven}
              onChange={(e) => handleInputChange('km_driven', e.target.value)}
            />
          </FormField>

          <FormField label="Engine CC">
            <NumberInput
              suffix="CC"
              value={formData.engine_cc}
              onChange={(e) => handleInputChange('engine_cc', e.target.value)}
            />
          </FormField>

          <FormField label="Fuel Mileage (km/l)">
            <TextInput
              placeholder="e.g. 45 km/l"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
            />
          </FormField>

          <FormField label="Color">
            <TextInput
              placeholder="e.g. Stealth Black / Matte Blue"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
            />
          </FormField>

          <FormField label="Owner Count">
            <SelectDropdown
              value={formData.owner_count}
              onChange={(e) => handleInputChange('owner_count', e.target.value)}
              options={[
                { value: 1, label: '1st Owner (Single Owner)' },
                { value: 2, label: '2nd Owner' },
                { value: 3, label: '3rd Owner+' }
              ]}
            />
          </FormField>

          <FormField label="Insurance Status">
            <TextInput
              placeholder="e.g. Active Comprehensive"
              value={formData.insurance_status}
              onChange={(e) => handleInputChange('insurance_status', e.target.value)}
            />
          </FormField>

          <FormField label="Purchase Cost (₹)" required helperText="Amount paid to seller">
            <NumberInput
              prefix="₹"
              value={formData.purchase_price}
              onChange={(e) => handleInputChange('purchase_price', e.target.value)}
            />
          </FormField>

          <FormField label="Target Selling Price (₹)" required helperText="Listing price in showroom">
            <NumberInput
              prefix="₹"
              value={formData.selling_price}
              onChange={(e) => handleInputChange('selling_price', e.target.value)}
            />
          </FormField>

          <div style={{ gridColumn: 'span 2' }}>
            <FormField label="Condition & Feature Highlights">
              <Textarea
                placeholder="Showroom service record, new tyres, scratchless bodywork..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </FormField>
          </div>

          {/* Mandatory 4-Photo Pack (Front, Front Tyre, Back Tyre, Back Look) */}
          <BikePhotoUploader
            photos={formData.photos}
            onChange={(updatedPhotos) => handleInputChange('photos', updatedPhotos)}
          />
        </form>
      </Modal>

      {/* BIKE DETAILS & TRUE PROFIT MODAL */}
      {selectedBikeDetails && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`${selectedBikeDetails.brand} ${selectedBikeDetails.model}`}
          subtitle={`Stock ID: ${selectedBikeDetails.stock_id} • Reg: ${selectedBikeDetails.reg_number}`}
          maxWidth="640px"
          footer={
            <>
              <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                <Badge status={selectedBikeDetails.status} />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  if (onSelectBikeForInspection) onSelectBikeForInspection(selectedBikeDetails);
                  else onNavigate('inspection');
                }}
              >
                Inspect Bike
              </Button>
              <Button variant="primary" onClick={() => setIsDetailsModalOpen(false)}>
                Done
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 3D Turntable Launcher & Image Banner */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#000' }}>
              <BikeCardImageWith3D
                bike={selectedBikeDetails}
                photos={selectedBikeDetails.photos}
                onOpen3D={(b) => setModal3D(b)}
                height="220px"
              />
            </div>

            <Button
              variant="outline"
              icon={RotateCw}
              onClick={() => setModal3D(selectedBikeDetails)}
              style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--primary-border)', color: 'var(--primary)', fontWeight: 700 }}
            >
              ⚡ Launch Full 360° 3D Virtual Showroom (Spin & Inspect)
            </Button>

            {/* Quick Financial Lifecycle Bar */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '12px',
              textAlign: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Acquisition Cost</span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {formatRupee(selectedBikeDetails.purchase_price)}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Services & Parts</span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-warning)' }}>
                  +{formatRupee(selectedBikeDetails.totalExpenses || 0)}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Est. Margin / Profit</span>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-success)' }}>
                  {formatRupee(
                    Number(selectedBikeDetails.selling_price || 0) -
                    (Number(selectedBikeDetails.purchase_price || 0) + Number(selectedBikeDetails.totalExpenses || 0))
                  )}
                </span>
              </div>
            </div>

            {/* Vehicle Specs Grid */}
            <div className="form-grid-2" style={{ gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Year / KM:</span> {selectedBikeDetails.year} • {Number(selectedBikeDetails.km_driven).toLocaleString('en-IN')} KM
              </div>
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Engine:</span> {selectedBikeDetails.engine_cc} CC • {selectedBikeDetails.fuel_type}
              </div>
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)' }}>RC Status:</span> {selectedBikeDetails.rc_status || 'Original RC'}
              </div>
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Insurance:</span> {selectedBikeDetails.insurance_status}
              </div>
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fuel Mileage:</span> <strong style={{ color: 'var(--color-success-text)' }}>{selectedBikeDetails.mileage || '45 km/l'}</strong>
              </div>
            </div>

            {/* 4-Angle Photo Inspection Pack Display */}
            {selectedBikeDetails.photos && selectedBikeDetails.photos.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  📸 4-Angle Certified Inspection Pack (Tyres & Profiles)
                </span>
                <div className="mobile-photo-grid">
                  {['Front Look', 'Front Tyre ⭐', 'Back Tyre ⭐', 'Back Look'].map((label, idx) => {
                    const pic = selectedBikeDetails.photos[idx];
                    return (
                      <div key={idx} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#000', position: 'relative' }}>
                        {pic ? (
                          <img src={pic} alt={label} style={{ width: '100%', height: '70px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>No photo</div>
                        )}
                        <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: idx === 1 || idx === 2 ? 'rgba(217, 119, 6, 0.85)' : 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, textAlign: 'center', padding: '2px 4px' }}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedBikeDetails.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {selectedBikeDetails.description}
              </p>
            )}

            {/* Change Status Fast Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quick Status:</span>
              <Button
                size="sm"
                variant={selectedBikeDetails.status === 'available' ? 'primary' : 'secondary'}
                onClick={() => handleStatusChange(selectedBikeDetails.id, 'available')}
              >
                Available
              </Button>
              <Button
                size="sm"
                variant={selectedBikeDetails.status === 'reserved' ? 'primary' : 'secondary'}
                onClick={() => handleStatusChange(selectedBikeDetails.id, 'reserved')}
              >
                Reserved
              </Button>
              <Button
                size="sm"
                variant={selectedBikeDetails.status === 'sold' ? 'primary' : 'secondary'}
                onClick={() => handleStatusChange(selectedBikeDetails.id, 'sold')}
              >
                Sold
              </Button>
            </div>
          </div>
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

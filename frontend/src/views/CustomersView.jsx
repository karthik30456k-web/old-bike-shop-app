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
  SelectDropdown
} from '../components/common';
import {
  Users,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Bike
} from 'lucide-react';

export const CustomersView = ({ onNavigate }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [budget, setBudget] = useState('');
  const [brand, setBrand] = useState('Yamaha');
  const [model, setModel] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomers();
      if (res && res.data) setCustomers(res.data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill name and phone number.');
      return;
    }

    try {
      await api.createCustomer({
        name,
        phone,
        email,
        address,
        budget: Number(budget || 0),
        interested_brand: brand,
        interested_model: model
      });
      setIsModalOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setBudget('');
      loadData();
    } catch (err) {
      alert('Failed to add customer: ' + err.message);
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
            Customer Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Showroom client profiles, budget preferences, targeted motorcycle models, and contact details.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Customer
        </Button>
      </div>

      {/* Customer Directory Table */}
      <Card title="Showroom Customer Directory">
        <DataTable
          searchable={true}
          searchPlaceholder="Search customer name, phone, email, brand..."
          columns={[
            {
              key: 'name',
              label: 'Customer',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {row.address || 'Chennai'}
                  </div>
                </div>
              )
            },
            {
              key: 'phone',
              label: 'Contact Info',
              render: (_, row) => (
                <div>
                  <a href={`tel:${row.phone}`} style={{ color: 'var(--primary)', fontWeight: 600, display: 'block' }}>
                    {row.phone}
                  </a>
                  {row.email && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email}</span>
                  )}
                </div>
              )
            },
            {
              key: 'interested_brand',
              label: 'Interested Motorcycle',
              render: (_, row) => (
                <div>
                  <span style={{ fontWeight: 600 }}>{row.interested_brand} {row.interested_model}</span>
                </div>
              )
            },
            {
              key: 'budget',
              label: 'Budget Range',
              render: (val) => (
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {val ? formatRupee(val) : 'Flexible'}
                </span>
              )
            },
            {
              key: 'created_at',
              label: 'Enquiry Date',
              render: (val) => <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{val}</span>
            },
            {
              key: 'actions',
              label: 'Action',
              render: () => (
                <Button size="sm" variant="secondary" onClick={() => onNavigate('enquiries')}>
                  View Leads
                </Button>
              )
            }
          ]}
          data={customers}
        />
      </Card>

      {/* NEW CUSTOMER MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer Profile"
        subtitle="Record showroom visitor details and vehicle preferences"
        maxWidth="540px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCustomer}>
              Save Customer
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Customer Name" required>
              <TextInput
                placeholder="e.g. Anand Natarajan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormField>

            <FormField label="Mobile Number" required>
              <TextInput
                placeholder="+91 9840X XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Email Address">
              <TextInput
                placeholder="anand@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Budget (₹)">
              <NumberInput
                prefix="₹"
                placeholder="100000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Preferred Brand">
              <SelectDropdown
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                options={[
                  { value: 'Yamaha', label: 'Yamaha' },
                  { value: 'Royal Enfield', label: 'Royal Enfield' },
                  { value: 'KTM', label: 'KTM' },
                  { value: 'Honda', label: 'Honda' },
                  { value: 'TVS', label: 'TVS' },
                  { value: 'Bajaj', label: 'Bajaj' },
                  { value: 'Suzuki', label: 'Suzuki' }
                ]}
              />
            </FormField>

            <FormField label="Model / Type">
              <TextInput
                placeholder="e.g. FZ-S / Classic 350"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Residential Address / Area">
            <TextInput
              placeholder="e.g. Velachery, Chennai"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormField>
        </form>
      </Modal>
    </div>
  );
};

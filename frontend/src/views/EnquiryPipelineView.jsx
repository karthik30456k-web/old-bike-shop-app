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
  Textarea,
  DateInput
} from '../components/common';
import {
  Plus,
  GitPullRequest,
  Phone,
  Calendar,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  BookmarkCheck,
  User
} from 'lucide-react';

export const EnquiryPipelineView = ({ onNavigate }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [budget, setBudget] = useState('');
  const [source, setSource] = useState('Walk-in Showroom');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const stages = [
    { id: 'new', label: 'New Enquiry', color: 'info' },
    { id: 'contacted', label: 'Contacted', color: 'cyan' },
    { id: 'interested', label: 'Interested', color: 'primary' },
    { id: 'test_ride', label: 'Test Ride', color: 'warning' },
    { id: 'negotiation', label: 'Negotiation', color: 'purple' },
    { id: 'booking', label: 'Booking', color: 'success' },
    { id: 'sold', label: 'Sold / Closed', color: 'success' }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [enqRes, bikesRes] = await Promise.all([
        api.getEnquiries(),
        api.getBikes()
      ]);
      if (enqRes && enqRes.data) setEnquiries(enqRes.data);
      if (bikesRes && bikesRes.data) {
        setBikes(bikesRes.data);
        if (bikesRes.data.length > 0 && !selectedBikeId) {
          setSelectedBikeId(bikesRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please enter customer name and phone number.');
      return;
    }

    try {
      const bike = bikes.find(b => b.id === selectedBikeId);
      await api.createEnquiry({
        customer_name: customerName,
        phone: customerPhone,
        bike_id: selectedBikeId,
        bike_title: bike ? `${bike.brand} ${bike.model}` : 'Open Inquiry',
        budget: Number(budget || 0),
        source,
        follow_up_date: followUpDate,
        notes,
        stage: 'new',
        assigned_to: 'Karthik Raja'
      });
      setIsNewModalOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      setBudget('');
      setNotes('');
      loadData();
    } catch (err) {
      alert('Failed to create enquiry: ' + err.message);
    }
  };

  const handleMoveStage = async (enquiryId, currentStage, direction) => {
    const stageIds = stages.map(s => s.id);
    const currentIndex = stageIds.indexOf(currentStage);
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < stageIds.length) {
      const nextStage = stageIds[newIndex];
      try {
        await api.updateEnquiryStage(enquiryId, nextStage);
        setEnquiries(prev =>
          prev.map(e => (e.id === enquiryId ? { ...e, stage: nextStage } : e))
        );
      } catch (err) {
        alert('Failed to update stage: ' + err.message);
      }
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
            Customer Enquiry & Lead Pipeline
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Track every customer inquiry through the sales conversion funnel: Inquiry → Test Ride → Negotiation → Sale.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsNewModalOpen(true)}
        >
          Add New Customer Enquiry
        </Button>
      </div>

      {/* Interactive Kanban Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '16px',
        alignItems: 'start'
      }}>
        {stages.map((stage) => {
          const itemsInStage = enquiries.filter(e => e.stage === stage.id);
          return (
            <div
              key={stage.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '480px',
                overflow: 'hidden'
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {stage.label}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {itemsInStage.length}
                  </span>
                </div>
              </div>

              {/* Column Items */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
                {itemsInStage.map((enq) => (
                  <Card
                    key={enq.id}
                    hoverEffect={true}
                    style={{
                      padding: '14px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {enq.customer_name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {enq.source}
                        </span>
                      </div>
                      <a
                        href={`tel:${enq.phone}`}
                        style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
                      >
                        <Phone size={12} /> {enq.phone}
                      </a>
                    </div>

                    <div style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.8rem'
                    }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        🏍️ {enq.bike_title || 'General Enquiry'}
                      </div>
                      {enq.budget > 0 && (
                        <div style={{ color: 'var(--text-muted)', marginTop: '2px', fontSize: '0.76rem' }}>
                          Budget: <strong style={{ color: 'var(--text-secondary)' }}>{formatRupee(enq.budget)}</strong>
                        </div>
                      )}
                    </div>

                    {enq.notes && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                        "{enq.notes}"
                      </p>
                    )}

                    {enq.follow_up_date && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> Next Follow-up: {enq.follow_up_date}
                      </div>
                    )}

                    {/* Stage Transition Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-color)'
                    }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveStage(enq.id, enq.stage, -1)}
                        disabled={stage.id === 'new'}
                        title="Move back"
                      >
                        <ArrowLeft size={13} />
                      </Button>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        {enq.stage === 'test_ride' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate('test-rides')}
                            title="Open Test Ride Scheduler"
                          >
                            <CalendarCheck size={13} />
                          </Button>
                        )}
                        {enq.stage === 'booking' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onNavigate('bookings')}
                            title="Collect Token Amount"
                          >
                            <BookmarkCheck size={13} />
                          </Button>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveStage(enq.id, enq.stage, 1)}
                        disabled={stage.id === 'sold'}
                        title="Advance to next stage"
                      >
                        <ArrowRight size={13} />
                      </Button>
                    </div>
                  </Card>
                ))}

                {itemsInStage.length === 0 && (
                  <div style={{
                    padding: '30px 10px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem'
                  }}>
                    No inquiries in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW ENQUIRY MODAL */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Add Customer Inquiry"
        subtitle="Capture customer interest, budget, and targeted motorcycle"
        maxWidth="580px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateEnquiry}>
              Create Lead
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-grid-2">
            <FormField label="Customer Name" required>
              <TextInput
                placeholder="e.g. Dinesh Kumar"
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

          <div className="form-grid-2">
            <FormField label="Interested Bike">
              <SelectDropdown
                value={selectedBikeId}
                onChange={(e) => setSelectedBikeId(e.target.value)}
                options={bikes.map(b => ({
                  value: b.id,
                  label: `${b.brand} ${b.model} (${formatRupee(b.selling_price)})`
                }))}
              />
            </FormField>

            <FormField label="Customer Budget (₹)">
              <NumberInput
                prefix="₹"
                placeholder="e.g. 90000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </FormField>
          </div>

          <div className="form-grid-2">
            <FormField label="Lead Source">
              <SelectDropdown
                value={source}
                onChange={(e) => setSource(e.target.value)}
                options={[
                  { value: 'Walk-in Showroom', label: 'Walk-in Showroom' },
                  { value: 'Website Online Enquiry', label: 'Website Online Enquiry' },
                  { value: 'Instagram / Social Media', label: 'Instagram / Social Media' },
                  { value: 'Referral / Friend', label: 'Referral / Friend' },
                  { value: 'Phone Inquiry', label: 'Phone Inquiry' }
                ]}
              />
            </FormField>

            <FormField label="Follow-up Date">
              <DateInput
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Discussion Notes & Customer Requirements">
            <Textarea
              placeholder="e.g. Looking for single owner bike, wants test ride with friend on Sunday..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </FormField>
        </form>
      </Modal>
    </div>
  );
};

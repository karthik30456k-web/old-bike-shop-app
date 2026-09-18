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
  SelectDropdown,
  DateInput,
  Textarea
} from '../components/common';
import {
  CalendarCheck,
  Plus,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  MessageSquare
} from 'lucide-react';

export const TestRidesView = () => {
  const [testRides, setTestRides] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);

  // New Test Ride Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [staffName, setStaffName] = useState('Karthik Raja');

  // Feedback State
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('completed');

  const loadData = async () => {
    try {
      setLoading(true);
      const [trRes, bikesRes] = await Promise.all([
        api.getTestRides(),
        api.getBikes({ status: 'available' })
      ]);
      if (trRes && trRes.data) setTestRides(trRes.data);
      if (bikesRes && bikesRes.data) {
        setBikes(bikesRes.data);
        if (bikesRes.data.length > 0 && !selectedBikeId) {
          setSelectedBikeId(bikesRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load test rides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTestRide = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedBikeId) {
      alert('Please fill customer name, phone, and select a bike.');
      return;
    }

    const bike = bikes.find(b => b.id === selectedBikeId);
    try {
      await api.createTestRide({
        customer_name: customerName,
        customer_phone: customerPhone,
        bike_id: selectedBikeId,
        bike_title: bike ? `${bike.brand} ${bike.model} (${bike.reg_number})` : 'Vehicle',
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        staff_name: staffName,
        status: 'scheduled',
        feedback: 'Scheduled'
      });
      setIsModalOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      loadData();
    } catch (err) {
      alert('Failed to schedule test ride: ' + err.message);
    }
  };

  const handleUpdateStatus = async (id, status, feedback) => {
    try {
      await api.updateTestRideStatus(id, status, feedback);
      loadData();
      if (feedbackModal) setFeedbackModal(null);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

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
            Test Ride Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Coordinate customer ride appointments, safety agreements, sales executive accompaniment, and rider feedback.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Book Test Ride Appointment
        </Button>
      </div>

      {/* Table */}
      <Card title="Test Ride Appointments & History">
        <DataTable
          searchable={true}
          searchPlaceholder="Search customer, bike or phone..."
          columns={[
            {
              key: 'scheduled_date',
              label: 'Slot Date & Time',
              render: (_, row) => (
                <div>
                  <div style={{ fontWeight: 700 }}>{row.scheduled_date}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.scheduled_time}</div>
                </div>
              )
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
              label: 'Bike Selected',
              render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
            },
            {
              key: 'staff_name',
              label: 'Assigned Executive',
              render: (val) => <span style={{ fontSize: '0.85rem' }}>{val || 'Showroom Staff'}</span>
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val} />
            },
            {
              key: 'feedback',
              label: 'Customer Feedback',
              render: (val) => (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '240px', display: 'inline-block' }}>
                  {val || 'Pending ride'}
                </span>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                  {row.status === 'scheduled' && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setFeedbackModal(row);
                          setFeedbackText('');
                          setFeedbackStatus('completed');
                        }}
                      >
                        Complete Ride
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateStatus(row.id, 'cancelled', 'Cancelled by customer')}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              )
            }
          ]}
          data={testRides}
        />
      </Card>

      {/* SCHEDULE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Customer Test Ride"
        subtitle="Reserve bike for customer trial run with sales accompaniment"
        maxWidth="560px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTestRide}>
              Confirm Schedule
            </Button>
          </>
        }
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <FormField label="Customer Full Name" required>
            <TextInput
              placeholder="e.g. Anand Natarajan"
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

          <FormField label="Select Available Bike" required>
            <SelectDropdown
              value={selectedBikeId}
              onChange={(e) => setSelectedBikeId(e.target.value)}
              options={bikes.map(b => ({
                value: b.id,
                label: `${b.brand} ${b.model} - ${b.reg_number} (${b.color})`
              }))}
            />
          </FormField>

          <div className="form-grid-2">
            <FormField label="Date" required>
              <DateInput
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </FormField>

            <FormField label="Time Slot" required>
              <SelectDropdown
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
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

          <FormField label="Accompanying Sales Executive">
            <SelectDropdown
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              options={[
                { value: 'Karthik Raja', label: 'Karthik Raja (Lead Sales)' },
                { value: 'Suresh Kumar', label: 'Suresh Kumar (Showroom Manager)' }
              ]}
            />
          </FormField>
        </form>
      </Modal>

      {/* FEEDBACK & COMPLETION MODAL */}
      {feedbackModal && (
        <Modal
          isOpen={Boolean(feedbackModal)}
          onClose={() => setFeedbackModal(null)}
          title="Record Test Ride Feedback"
          subtitle={`Ride completed for ${feedbackModal.customer_name} on ${feedbackModal.bike_title}`}
          maxWidth="500px"
          footer={
            <>
              <Button variant="ghost" onClick={() => setFeedbackModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleUpdateStatus(feedbackModal.id, feedbackStatus, feedbackText)}
              >
                Submit Feedback & Update
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FormField label="Ride Result">
              <SelectDropdown
                value={feedbackStatus}
                onChange={(e) => setFeedbackStatus(e.target.value)}
                options={[
                  { value: 'completed', label: 'Completed - Customer Highly Interested' },
                  { value: 'completed', label: 'Completed - Wants Price Negotiation' },
                  { value: 'cancelled', label: 'Cancelled / Did Not Show Up' }
                ]}
              />
            </FormField>

            <FormField label="Customer Remarks & Experience">
              <Textarea
                placeholder="Liked engine sound, satisfied with clutch and disc brake feel..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </FormField>
          </div>
        </Modal>
      )}
    </div>
  );
};

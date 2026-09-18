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
  Textarea,
  InspectionRating
} from '../components/common';
import { printA4Document } from '../utils/printHelper';
import {
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  Bike
} from 'lucide-react';

export const InspectionView = ({ preselectedBike, onNavigate }) => {
  const [bikes, setBikes] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [selectedBikeId, setSelectedBikeId] = useState(preselectedBike ? preselectedBike.id : '');
  const [loading, setLoading] = useState(true);
  const [certificateModal, setCertificateModal] = useState(null);

  // 14-Point Checklist State
  const [ratings, setRatings] = useState({
    engine: 'Good',
    battery: 'Good',
    tyres: 'Good',
    brake: 'Good',
    suspension: 'Good',
    clutch: 'Good',
    gearbox: 'Good',
    electrical: 'Good',
    lights: 'Good',
    body: 'Good',
    paint: 'Good',
    accident_history: 'None (Clean Frame)',
    service_history: 'Showroom Verified'
  });

  const [notes, setNotes] = useState('Clean compression, responsive brakes, and smooth gearbox transition.');
  const [inspectedBy, setInspectedBy] = useState('Karthik Raja (Chief Mechanic & Lead Sales)');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (preselectedBike) {
      setSelectedBikeId(preselectedBike.id);
    }
  }, [preselectedBike]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [bikesRes, inspRes] = await Promise.all([
        api.getBikes(),
        api.getInspections()
      ]);
      if (bikesRes && bikesRes.data) {
        setBikes(bikesRes.data);
        if (!selectedBikeId && bikesRes.data.length > 0) {
          setSelectedBikeId(bikesRes.data[0].id);
        }
      }
      if (inspRes && inspRes.data) {
        setInspections(inspRes.data);
      }
    } catch (err) {
      console.error('Failed to load inspection data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (item, val) => {
    setRatings(prev => ({ ...prev, [item]: val }));
  };

  // Calculate live health score
  const calculateScore = () => {
    const items = [
      ratings.engine, ratings.battery, ratings.tyres, ratings.brake,
      ratings.suspension, ratings.clutch, ratings.gearbox, ratings.electrical,
      ratings.lights, ratings.body, ratings.paint
    ];
    let good = 0;
    let avg = 0;
    let repair = 0;
    items.forEach(r => {
      if (r === 'Good') good++;
      else if (r === 'Average') avg++;
      else repair++;
    });

    const score = Math.round(((good * 100) + (avg * 70) + (repair * 20)) / items.length);
    const passed = repair <= 2 && score >= 75;
    return { score, passed, good, avg, repair };
  };

  const health = calculateScore();

  const handleSaveInspection = async () => {
    if (!selectedBikeId) {
      alert('Please select a bike to inspect.');
      return;
    }

    try {
      const payload = {
        bike_id: selectedBikeId,
        ...ratings,
        overall_score: health.score,
        status: health.passed ? 'Passed' : 'Failed',
        notes,
        inspected_by: inspectedBy
      };

      const res = await api.saveInspection(payload);
      alert(`✅ 14-Point Inspection Saved! Result: ${health.passed ? 'PASSED (Certificate Generated)' : 'NEEDS REPAIR'}`);
      loadInitialData();

      // Show certificate preview
      const currentBike = bikes.find(b => b.id === selectedBikeId);
      setCertificateModal({
        bike: currentBike,
        inspection: res.data
      });
    } catch (err) {
      alert('Failed to save inspection: ' + err.message);
    }
  };

  const currentSelectedBike = bikes.find(b => b.id === selectedBikeId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ flex: '1 1 240px' }}>
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)' }}>
            14-Point Bike Quality Inspection
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Comprehensive mechanical, electrical, and structural evaluation with automated showroom certificate grading.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '360px', flex: '1 1 260px' }}>
          <div style={{ width: '100%' }}>
            <SelectDropdown
              value={selectedBikeId}
              onChange={(e) => setSelectedBikeId(e.target.value)}
              options={bikes.map(b => ({
                value: b.id,
                label: `${b.brand} ${b.model} (${b.reg_number})`
              }))}
              placeholder="Select bike to inspect"
            />
          </div>
        </div>
      </div>

      {/* Main Inspection Grid (Single Column on mobile & mockup, 2-column on desktop) */}
      <div className="responsive-split-view">
        {/* Left Column: 14-Point Checklist */}
        <Card
          title="Mechanical & Safety Evaluation Checklist"
          subtitle="Grade each component: Good (Green), Average (Amber), or Need Repair (Red)"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <InspectionRating
              label="1. Engine & Compression"
              value={ratings.engine}
              onChange={(v) => handleRatingChange('engine', v)}
            />
            <InspectionRating
              label="2. Battery & Self-Start Voltage"
              value={ratings.battery}
              onChange={(v) => handleRatingChange('battery', v)}
            />
            <InspectionRating
              label="3. Tyres (Front & Rear Tread Life)"
              value={ratings.tyres}
              onChange={(v) => handleRatingChange('tyres', v)}
            />
            <InspectionRating
              label="4. Brakes (Disc & Drum Bite)"
              value={ratings.brake}
              onChange={(v) => handleRatingChange('brake', v)}
            />
            <InspectionRating
              label="5. Suspension (Front Forks & Rear Monoshock)"
              value={ratings.suspension}
              onChange={(v) => handleRatingChange('suspension', v)}
            />
            <InspectionRating
              label="6. Clutch & Cable Free-play"
              value={ratings.clutch}
              onChange={(v) => handleRatingChange('clutch', v)}
            />
            <InspectionRating
              label="7. Gearbox & Neutral Engagement"
              value={ratings.gearbox}
              onChange={(v) => handleRatingChange('gearbox', v)}
            />
            <InspectionRating
              label="8. Electrical & Wiring Harness"
              value={ratings.electrical}
              onChange={(v) => handleRatingChange('electrical', v)}
            />
            <InspectionRating
              label="9. Headlight, Indicators & Brake Light"
              value={ratings.lights}
              onChange={(v) => handleRatingChange('lights', v)}
            />
            <InspectionRating
              label="10. Chassis & Bodywork Alignment"
              value={ratings.body}
              onChange={(v) => handleRatingChange('body', v)}
            />
            <InspectionRating
              label="11. Paint & Original Decals Condition"
              value={ratings.paint}
              onChange={(v) => handleRatingChange('paint', v)}
            />

            <div className="form-grid-2" style={{ marginTop: '8px' }}>
              <FormField label="Accident History">
                <SelectDropdown
                  value={ratings.accident_history}
                  onChange={(e) => handleRatingChange('accident_history', e.target.value)}
                  options={[
                    { value: 'None (Clean Frame)', label: 'None (Clean Frame & Forks)' },
                    { value: 'Minor Scratches Only', label: 'Minor Surface Scuffs' },
                    { value: 'Repaired Incident', label: 'Repaired Incident' }
                  ]}
                />
              </FormField>

              <FormField label="Service Records">
                <SelectDropdown
                  value={ratings.service_history}
                  onChange={(e) => handleRatingChange('service_history', e.target.value)}
                  options={[
                    { value: 'Showroom Verified', label: 'Authorized Showroom Verified' },
                    { value: 'Local Service History', label: 'Third-party Service History' },
                    { value: 'Unverified', label: 'No Service Logbook' }
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Inspector Observations & Refurbishment Remarks">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="List any parts to be replaced before customer delivery..."
              />
            </FormField>

            <FormField label="Lead Mechanical Inspector">
              <TextInput
                value={inspectedBy}
                onChange={(e) => setInspectedBy(e.target.value)}
              />
            </FormField>

            <div style={{ marginTop: '12px' }}>
              <Button
                variant="primary"
                size="lg"
                icon={CheckCircle2}
                onClick={handleSaveInspection}
                style={{ width: '100%' }}
              >
                Save Inspection & Issue Certificate
              </Button>
            </div>
          </div>
        </Card>

        {/* Right Column: Live Health Score & Certificate Preview */}
        <div className="inspection-score-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card style={{ textAlign: 'center', padding: '24px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Automated Showroom Score
            </span>

            {/* Circular Gauge Score */}
            <div style={{
              margin: '18px auto',
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              border: `6px solid ${health.passed ? 'var(--color-success)' : 'var(--color-danger)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: health.passed ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
              boxShadow: health.passed ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
            }}>
              <span style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: health.passed ? 'var(--color-success)' : 'var(--color-danger)', lineHeight: 1 }}>
                {health.score}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>/ 100</span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <Badge
                status={health.passed ? 'passed' : 'failed'}
                size="md"
              >
                {health.passed ? '✓ INSPECTION PASSED' : '⚠ NEEDS REFURBISHMENT'}
              </Badge>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {health.passed
                ? 'Bike meets 100% roadworthy standards and is eligible for Showroom Certified Warranty.'
                : 'Over 2 components require repair before listing as available for sale.'}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.78rem'
            }}>
              <div>
                <span style={{ color: 'var(--color-success)', fontWeight: 700, display: 'block' }}>{health.good}</span>
                <span style={{ color: 'var(--text-muted)' }}>Good</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-warning)', fontWeight: 700, display: 'block' }}>{health.avg}</span>
                <span style={{ color: 'var(--text-muted)' }}>Average</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-danger)', fontWeight: 700, display: 'block' }}>{health.repair}</span>
                <span style={{ color: 'var(--text-muted)' }}>Repair</span>
              </div>
            </div>
          </Card>

          {/* Selected Bike Summary */}
          {currentSelectedBike && (
            <Card
              title="Target Vehicle"
              subtitle={`Stock: ${currentSelectedBike.stock_id}`}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img
                  src={currentSelectedBike.photos && currentSelectedBike.photos[0] ? currentSelectedBike.photos[0] : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
                  alt={currentSelectedBike.model}
                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    {currentSelectedBike.brand} {currentSelectedBike.model}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {currentSelectedBike.year} • {currentSelectedBike.reg_number} • <span style={{ color: 'var(--color-success-text)', fontWeight: 600 }}>⚡ {currentSelectedBike.mileage || '45 km/l'}</span>
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* INSPECTION CERTIFICATE MODAL */}
      {certificateModal && (
        <Modal
          isOpen={Boolean(certificateModal)}
          onClose={() => setCertificateModal(null)}
          title="Showroom Quality Certificate"
          subtitle="Official pre-owned two wheeler health verification document"
          maxWidth="640px"
          footer={
            <>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => printA4Document('printable-inspection-cert', `Inspection-${certificateModal.bike.reg_number}`)}
              >
                Print Certificate
              </Button>
              <Button variant="secondary" onClick={() => setCertificateModal(null)}>
                Done
              </Button>
            </>
          }
        >
          <div
            id="printable-inspection-cert"
            style={{
              padding: '20px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: 'var(--radius-md)',
              border: '2px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>VELOCE WHEELS</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>CERTIFIED USED BIKE SHOWROOM INSPECTION</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{certificateModal.inspection.overall_score}/100</span>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981' }}>STATUS: PASSED</div>
              </div>
            </div>

            {/* Bike details */}
            <div className="form-grid-2" style={{ gap: '8px', fontSize: '0.85rem' }}>
              <div><strong>Vehicle:</strong> {certificateModal.bike?.brand} {certificateModal.bike?.model}</div>
              <div><strong>Reg Number:</strong> {certificateModal.bike?.reg_number}</div>
              <div><strong>Stock ID:</strong> {certificateModal.bike?.stock_id}</div>
              <div><strong>KM Driven:</strong> {certificateModal.bike?.km_driven} KM</div>
              <div><strong>Fuel Mileage:</strong> {certificateModal.bike?.mileage || '45 km/l'}</div>
              <div><strong>Inspection Date:</strong> {certificateModal.inspection?.inspected_date || new Date().toISOString().split('T')[0]}</div>
              <div><strong>Certified By:</strong> {certificateModal.inspection?.inspected_by}</div>
            </div>

            {/* Checklist summary table */}
            <div style={{ fontSize: '0.8rem', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <strong>14-Point Checks:</strong> Engine: {certificateModal.inspection?.engine} • Brakes: {certificateModal.inspection?.brake} • Battery: {certificateModal.inspection?.battery} • Tyres: {certificateModal.inspection?.tyres} • Electrical: {certificateModal.inspection?.electrical} • Suspension: {certificateModal.inspection?.suspension}
            </div>

            <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
              Remarks: "{certificateModal.inspection?.notes}"
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

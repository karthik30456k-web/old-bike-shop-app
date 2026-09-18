import React, { useState } from 'react';
import { Printer, Copy, Check, Share2, Settings } from 'lucide-react';
import { Button } from './Button';
import { printThermalReceipt } from '../../utils/printHelper';

/**
 * 4-Inch (100mm) & 3-Inch (80mm) Thermal POS Bill Receipt Component
 * Specifically calibrated for TVS-E RP 3230, Epson TM-T82, Munbyn, and standard POS continuous rolls.
 */
export const ThermalBill4Inch = ({
  invoice,
  bike,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [rollWidth, setRollWidth] = useState('80mm'); // '80mm' (TVS-E RP 3230) or '100mm' (4-Inch)

  if (!invoice) return null;

  const formatRupee = (num) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

  const printThermalBill = () => {
    document.body.classList.add('printing-thermal');
    printThermalReceipt('printable-thermal-bill', rollWidth);
    setTimeout(() => {
      document.body.classList.remove('printing-thermal');
    }, 1500);
  };

  const copyReceiptText = () => {
    const text = `
========================================
           VELOCE WHEELS ERP
   PRE-OWNED TWO-WHEELER SHOWROOM
        GSTIN: 33ABCDE1234F1Z5
  No. 42, Anna Salai, Chennai - 600002
      Phone: +91 98401 23456
========================================
TAX INVOICE / POS CASH MEMO
----------------------------------------
Bill No : ${invoice.invoice_number}
Date    : ${invoice.sale_date}
Cashier : Suresh Kumar (Admin)
----------------------------------------
CUSTOMER PARTICULARS:
Name    : ${invoice.customer_name}
Mobile  : ${invoice.customer_phone}
Address : ${invoice.customer_address || 'Chennai, Tamil Nadu'}
----------------------------------------
VEHICLE PARTICULARS:
Model   : ${invoice.bike_title || (bike ? `${bike.brand} ${bike.model}` : 'Motorcycle')}
Reg No  : ${bike?.reg_number || 'Showroom Registered'}
Year/KM : ${bike?.year || 2021} | ${Number(bike?.km_driven || 15000).toLocaleString('en-IN')} KM
Mileage : ${bike?.mileage || '48 km/l'} (Verified)
Stock ID: ${bike?.stock_id || 'VB-2023'}
----------------------------------------
ITEM PARTICULARS                 AMOUNT
----------------------------------------
1. Vehicle Purchase Price    ${formatRupee(invoice.vehicle_price)}
${Number(invoice.rto_transfer_charges || 0) > 0 ? `2. RTO RC Ownership Transfer   +${formatRupee(invoice.rto_transfer_charges)}\n` : ''}${Number(invoice.discount || 0) > 0 ? `3. Showroom Discount           -${formatRupee(invoice.discount)}\n` : ''}----------------------------------------
NET PAYABLE TOTAL            ${formatRupee(invoice.total_amount)}
========================================
PAYMENT MODE: ${invoice.payment_mode || 'UPI / Bank Transfer'}
STATUS      : FULL PAYMENT SETTLED (DELIVERED)
----------------------------------------
DOCUMENTS HANDED OVER:
[X] Original RC Smart Card
[X] Active Insurance Certificate
[X] Form 29 & Form 30 Signed
[X] 2 Sets Original Keys
[X] 14-Point Quality Inspection Report
----------------------------------------
WARRANTY & SERVICE:
* 6 Months Engine & Gearbox Warranty
* 1st General Service Free within 30 Days
========================================
       THANK YOU FOR CHOOSING US!
      SAFE RIDING & HAPPY MOTORING!
         www.velocewheels.com
========================================
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
      {/* Roll Width Calibration Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: rollWidth === '80mm' ? '310px' : '384px',
        padding: '6px 10px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        fontSize: '0.75rem'
      }}>
        <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Roll Paper:</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setRollWidth('80mm')}
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: rollWidth === '80mm' ? 'var(--primary)' : 'transparent',
              color: rollWidth === '80mm' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            3" (80mm TVS-E)
          </button>
          <button
            type="button"
            onClick={() => setRollWidth('100mm')}
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: rollWidth === '100mm' ? 'var(--primary)' : 'transparent',
              color: rollWidth === '100mm' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            4" (100mm Roll)
          </button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div style={{
        display: 'flex',
        gap: '10px',
        width: '100%',
        maxWidth: rollWidth === '80mm' ? '310px' : '384px',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          variant="primary"
          icon={Printer}
          onClick={printThermalBill}
          style={{ flex: 1 }}
        >
          Print Thermal Bill
        </Button>
        <Button
          variant="secondary"
          icon={copied ? Check : Copy}
          onClick={copyReceiptText}
          style={{ flex: 1 }}
        >
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>
      </div>

      {/* Thermal Bill Container */}
      <div
        id="printable-thermal-bill"
        className="thermal-pos-bill"
        style={{
          width: '100%',
          maxWidth: rollWidth === '80mm' ? '300px' : '384px',
          backgroundColor: '#ffffff',
          color: '#111827',
          padding: '16px 12px',
          borderRadius: '4px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          fontFamily: 'Courier, "Courier New", monospace, monospace',
          fontSize: rollWidth === '80mm' ? '11px' : '12px',
          lineHeight: '1.34',
          border: '1px solid #d1d5db',
          position: 'relative'
        }}
      >
        {/* Serrated Top Edge */}
        <div style={{
          position: 'absolute',
          top: '-6px',
          left: 0,
          right: 0,
          height: '6px',
          background: 'radial-gradient(circle, transparent, transparent 50%, #ffffff 50%, #ffffff 100%)',
          backgroundSize: '12px 12px'
        }} />

        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '0.05em', margin: '0 0 2px 0' }}>
            VELOCE WHEELS
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
            Certified Used Two-Wheeler Showroom
          </div>
          <div style={{ fontSize: '10px', color: '#4b5563', marginTop: '2px' }}>
            GSTIN: 33ABCDE1234F1Z5 • Reg: TN-09-2023-SHOWROOM
          </div>
          <div style={{ fontSize: '10px', color: '#4b5563' }}>
            No. 42, Mount Road, Anna Salai, Chennai - 600002
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>
            Phone: +91 98401 23456 / +91 98402 34567
          </div>
        </div>

        {/* Double divider */}
        <div style={{ borderTop: '2px solid #111827', borderBottom: '1px solid #111827', height: '3px', margin: '8px 0' }} />

        {/* Receipt Memo Type */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '11px' }}>
          <span>TAX INVOICE / POS CASH MEMO</span>
          <span style={{ border: '1px solid #111827', padding: '1px 5px', fontSize: '9px' }}>ORIGINAL</span>
        </div>

        <div style={{ borderTop: '1px dashed #6b7280', margin: '6px 0' }} />

        {/* Meta Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '3px', fontSize: '11px' }}>
          <span style={{ color: '#4b5563' }}>Bill No:</span>
          <strong>{invoice.invoice_number}</strong>

          <span style={{ color: '#4b5563' }}>Date & Time:</span>
          <span>{invoice.sale_date} 04:30 PM</span>

          <span style={{ color: '#4b5563' }}>Executive:</span>
          <span>Karthik Raja (Lead Sales)</span>
        </div>

        <div style={{ borderTop: '1px dashed #6b7280', margin: '6px 0' }} />

        {/* Customer Particulars */}
        <div style={{ fontSize: '11px' }}>
          <div style={{ fontWeight: 800, textDecoration: 'underline', marginBottom: '3px' }}>
            CUSTOMER PARTICULARS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '2px' }}>
            <span style={{ color: '#4b5563' }}>Name:</span>
            <strong>{invoice.customer_name}</strong>

            <span style={{ color: '#4b5563' }}>Mobile:</span>
            <strong>{invoice.customer_phone}</strong>

            <span style={{ color: '#4b5563' }}>Address:</span>
            <span>{invoice.customer_address || 'Chennai, Tamil Nadu'}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed #6b7280', margin: '6px 0' }} />

        {/* Vehicle Particulars */}
        <div style={{ fontSize: '11px' }}>
          <div style={{ fontWeight: 800, textDecoration: 'underline', marginBottom: '3px' }}>
            VEHICLE PARTICULARS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '2px' }}>
            <span style={{ color: '#4b5563' }}>Model:</span>
            <strong>{invoice.bike_title || (bike ? `${bike.brand} ${bike.model}` : 'Motorcycle')}</strong>

            <span style={{ color: '#4b5563' }}>Reg Number:</span>
            <strong>{bike?.reg_number || 'Showroom Registered'}</strong>

            <span style={{ color: '#4b5563' }}>Year / KM:</span>
            <span>{bike?.year || 2021} • {Number(bike?.km_driven || 15000).toLocaleString('en-IN')} KM</span>

            <span style={{ color: '#4b5563' }}>Fuel Mileage:</span>
            <strong style={{ color: '#047857' }}>⚡ {bike?.mileage || '48 km/l'} (Verified)</strong>

            <span style={{ color: '#4b5563' }}>Chassis / ID:</span>
            <span>{bike?.stock_id || 'VB-2023-CH'}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed #6b7280', margin: '8px 0' }} />

        {/* Itemized Table Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '11px', paddingBottom: '3px' }}>
          <span>DESCRIPTION</span>
          <span>AMOUNT (₹)</span>
        </div>

        <div style={{ borderTop: '1px solid #111827', margin: '2px 0 6px 0' }} />

        {/* Line Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>1. Pre-Owned Two-Wheeler</span>
            <span>{formatRupee(invoice.vehicle_price)}</span>
          </div>

          {Number(invoice.rto_transfer_charges || 0) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>2. RTO RC Transfer & Docs</span>
              <span>+{formatRupee(invoice.rto_transfer_charges)}</span>
            </div>
          )}

          {Number(invoice.discount || 0) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#047857' }}>
              <span>3. Showroom Special Discount</span>
              <span>-{formatRupee(invoice.discount)}</span>
            </div>
          )}
        </div>

        {/* Total separator */}
        <div style={{ borderTop: '1px dashed #6b7280', margin: '8px 0 6px 0' }} />

        {/* Grand Total */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: 900,
          padding: '4px 0'
        }}>
          <span>NET PAYABLE TOTAL:</span>
          <span>{formatRupee(invoice.total_amount)}</span>
        </div>

        <div style={{ borderTop: '2px solid #111827', borderBottom: '1px solid #111827', height: '3px', margin: '6px 0' }} />

        {/* Settlement Info */}
        <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Payment Mode:</span>
            <strong>{invoice.payment_mode || 'UPI / Bank Transfer'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Amount Received:</span>
            <strong>{formatRupee(invoice.total_amount)} (PAID IN FULL)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Balance Due:</span>
            <strong>₹0.00</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery Status:</span>
            <strong style={{ color: '#047857' }}>✓ VEHICLE HANDED OVER</strong>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed #6b7280', margin: '8px 0' }} />

        {/* Documents Checklist */}
        <div style={{ fontSize: '10px' }}>
          <div style={{ fontWeight: 800, marginBottom: '2px' }}>DOCUMENTS HANDOVER CHECKLIST:</div>
          <div>[✓] Original RC Smart Card</div>
          <div>[✓] Active Comprehensive Insurance</div>
          <div>[✓] Signed Form 29 & Form 30 (RTO)</div>
          <div>[✓] 14-Point Quality Certificate (Passed)</div>
          <div>[✓] 2 Sets of Original Ignition Keys</div>
        </div>

        <div style={{ borderTop: '1px dashed #6b7280', margin: '8px 0' }} />

        {/* Warranty & Terms */}
        <div style={{ fontSize: '10px', color: '#374151' }}>
          <div style={{ fontWeight: 800 }}>SHOWROOM WARRANTY TERMS:</div>
          <div>• 6 Months Engine & Transmission Warranty</div>
          <div>• Free 1st General Service within 30 days</div>
          <div>• Roadside Assistance: 1800-425-9999</div>
        </div>

        {/* Simulated QR Code / Barcode */}
        <div style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#f9fafb',
          border: '1px dashed #9ca3af',
          textAlign: 'center'
        }}>
          {/* Barcode visual */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2px',
            height: '28px',
            alignItems: 'stretch',
            marginBottom: '4px'
          }}>
            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 3].map((w, i) => (
              <div
                key={i}
                style={{
                  width: `${w * 2}px`,
                  backgroundColor: '#111827'
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em' }}>
            *{invoice.invoice_number}*
          </div>
          <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>
            SCAN WITH CAMERA TO VERIFY RTO & WARRANTY
          </div>
        </div>

        {/* Signatures */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: '16px',
          paddingTop: '10px',
          fontSize: '10px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #111827', width: '110px', height: '24px' }} />
            <div style={{ marginTop: '2px' }}>Customer Signature</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #111827', width: '120px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '9px' }}>
              VELOCE SEAL
            </div>
            <div style={{ marginTop: '2px' }}>Authorized Signatory</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '10px', color: '#4b5563' }}>
          <div>*** THANK YOU FOR YOUR BUSINESS! ***</div>
          <div style={{ fontWeight: 700 }}>HAVE A SAFE & PROSPEROUS RIDE!</div>
          <div style={{ fontSize: '9px', marginTop: '2px' }}>www.velocewheels.com • support@velocewheels.com</div>
        </div>

        {/* Serrated Bottom Edge */}
        <div style={{
          position: 'absolute',
          bottom: '-6px',
          left: 0,
          right: 0,
          height: '6px',
          background: 'radial-gradient(circle, transparent, transparent 50%, #ffffff 50%, #ffffff 100%)',
          backgroundSize: '12px 12px'
        }} />
      </div>
    </div>
  );
};

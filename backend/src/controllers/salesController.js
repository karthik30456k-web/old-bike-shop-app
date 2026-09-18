const db = require('../config/db');

exports.getSales = async (req, res) => {
  try {
    const list = await db.getSales();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const {
      bike_id,
      bike_title,
      customer_name,
      customer_phone,
      customer_address,
      vehicle_price,
      discount = 0,
      rto_transfer_charges = 0,
      insurance_charges = 0,
      paid_amount,
      payment_mode = 'UPI',
      delivery_date,
      documents_handed
    } = req.body;

    if (!bike_id || !customer_name || !vehicle_price) {
      return res.status(400).json({
        success: false,
        message: 'bike_id, customer_name, and vehicle_price are required'
      });
    }

    const calculatedTotal = Number(vehicle_price) - Number(discount) + Number(rto_transfer_charges) + Number(insurance_charges);
    const saleRecord = await db.createSale({
      bike_id,
      bike_title,
      customer_name,
      customer_phone,
      customer_address,
      vehicle_price: Number(vehicle_price),
      discount: Number(discount),
      rto_transfer_charges: Number(rto_transfer_charges),
      insurance_charges: Number(insurance_charges),
      total_amount: calculatedTotal,
      paid_amount: Number(paid_amount || calculatedTotal),
      payment_mode,
      delivery_date: delivery_date || new Date().toISOString().split('T')[0],
      documents_handed: documents_handed || ['Original RC', 'Sale Agreement', 'Valid Insurance', 'Set of Keys']
    });

    res.status(201).json({
      success: true,
      message: 'Sale finalized, invoice created, and bike marked as SOLD',
      data: saleRecord
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

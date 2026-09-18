const db = require('../config/db');

exports.getAllPurchases = async (req, res) => {
  try {
    const list = await db.getPurchases();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const result = await db.createPurchase(req.body);
    res.status(201).json({
      success: true,
      message: 'Bike purchased and automatically added to inventory',
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

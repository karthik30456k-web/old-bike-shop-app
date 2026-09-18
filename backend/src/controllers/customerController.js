const db = require('../config/db');

// Customer directory
exports.getCustomers = async (req, res) => {
  try {
    const list = await db.getCustomers();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const cust = await db.createCustomer(req.body);
    res.status(201).json({ success: true, data: cust });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

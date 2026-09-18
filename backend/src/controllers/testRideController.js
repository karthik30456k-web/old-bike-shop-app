const db = require('../config/db');

exports.getTestRides = async (req, res) => {
  try {
    const list = await db.getTestRides();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTestRide = async (req, res) => {
  try {
    const tr = await db.createTestRide(req.body);
    res.status(201).json({ success: true, data: tr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const updated = await db.updateTestRideStatus(id, status, feedback);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Test ride not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

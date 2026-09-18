const db = require('../config/db');

exports.getAllBikes = async (req, res) => {
  try {
    const { status, brand, maxPrice, search } = req.query;
    const bikes = await db.getBikes({ status, brand, maxPrice, search });
    res.json({ success: true, count: bikes.length, data: bikes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBikeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const bike = await db.getBikeById(id);
    if (!bike) {
      return res.status(404).json({ success: false, message: 'Bike not found' });
    }
    res.json({ success: true, data: bike });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBike = async (req, res) => {
  try {
    const bike = await db.createBike(req.body);
    res.status(201).json({ success: true, data: bike });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBike = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db.updateBike(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Bike not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBike = async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteBike(id);
    res.json({ success: true, message: 'Bike deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

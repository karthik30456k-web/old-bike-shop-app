const db = require('../config/db');

exports.getBookings = async (req, res) => {
  try {
    const list = await db.getBookings();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const bkg = await db.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: 'Booking created and bike reserved',
      data: bkg
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

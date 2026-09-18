const db = require('../config/db');

exports.getDashboardReport = async (req, res) => {
  try {
    const metrics = await db.getDashboardMetrics();
    res.json({
      success: true,
      database_engine: db.getMode(),
      data: metrics
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

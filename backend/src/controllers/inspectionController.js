const db = require('../config/db');

exports.getInspections = async (req, res) => {
  try {
    const list = await db.getInspections();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveInspection = async (req, res) => {
  try {
    const data = req.body;
    if (!data.bike_id) {
      return res.status(400).json({ success: false, message: 'bike_id is required' });
    }

    // Auto calculate overall health score if not provided
    const items = [
      data.engine, data.battery, data.tyres, data.brake,
      data.suspension, data.clutch, data.gearbox, data.electrical,
      data.lights, data.body, data.paint
    ];
    let goodCount = 0;
    let avgCount = 0;
    let repairCount = 0;

    items.forEach(val => {
      if (val === 'Good') goodCount++;
      else if (val === 'Average') avgCount++;
      else if (val === 'Need Repair') repairCount++;
    });

    // Score calculation
    const calculatedScore = Math.round(((goodCount * 100) + (avgCount * 70) + (repairCount * 30)) / (items.length || 1));
    const status = repairCount > 2 ? 'Failed' : 'Passed';

    const saved = await db.saveInspection({
      ...data,
      overall_score: data.overall_score || calculatedScore,
      status: data.status || status
    });

    res.status(200).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

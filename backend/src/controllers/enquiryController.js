const db = require('../config/db');

exports.getEnquiries = async (req, res) => {
  try {
    const list = await db.getEnquiries();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEnquiry = async (req, res) => {
  try {
    const enq = await db.createEnquiry(req.body);
    res.status(201).json({ success: true, data: enq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, notes } = req.body;
    const validStages = ['new', 'contacted', 'interested', 'test_ride', 'negotiation', 'booking', 'sold', 'lost'];
    if (stage && !validStages.includes(stage)) {
      return res.status(400).json({ success: false, message: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
    }
    const updated = await db.updateEnquiryStage(id, stage, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

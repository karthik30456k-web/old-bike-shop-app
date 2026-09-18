const db = require('../config/db');

exports.getExpenses = async (req, res) => {
  try {
    const list = await db.getExpenses();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { bike_id, expense_type, amount, description, expense_date } = req.body;
    if (!amount || !expense_type) {
      return res.status(400).json({ success: false, message: 'Amount and expense_type are required' });
    }
    const exp = await db.createExpense({
      bike_id,
      expense_type,
      amount: Number(amount),
      description,
      expense_date: expense_date || new Date().toISOString().split('T')[0]
    });
    res.status(201).json({ success: true, data: exp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

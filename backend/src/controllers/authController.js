const db = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { email, role } = req.body;
    let user;
    if (email) {
      user = await db.findUserByEmail(email);
    }
    if (!user && role) {
      const allUsers = await db.getUsers();
      user = allUsers.find(u => u.role === role);
    }
    if (!user) {
      const allUsers = await db.getUsers();
      user = allUsers[0]; // fallback default
    }

    // Return authenticated user object with a simulated JWT token
    const token = `token_${user.id}_${Date.now()}`;
    return res.json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json({ success: true, user: users[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsersList = async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

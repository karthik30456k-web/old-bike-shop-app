require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Used Bike Showroom Management System (Veloce Wheels API)',
    database_mode: db.getMode()
  });
});

// Mount Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏍️  BIKE SHOWROOM MANAGEMENT API SERVER`);
  console.log(`📡  Listening on: http://localhost:${PORT}`);
  console.log(`💾  Database Mode: ${db.getMode()}`);
  console.log(`🩺  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

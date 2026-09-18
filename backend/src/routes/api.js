const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authController');
const bikeCtrl = require('../controllers/bikeController');
const inspectCtrl = require('../controllers/inspectionController');
const purchaseCtrl = require('../controllers/purchaseController');
const custCtrl = require('../controllers/customerController');
const enqCtrl = require('../controllers/enquiryController');
const trCtrl = require('../controllers/testRideController');
const bkgCtrl = require('../controllers/bookingController');
const salesCtrl = require('../controllers/salesController');
const expCtrl = require('../controllers/expenseController');
const reportCtrl = require('../controllers/reportController');

// Auth routes
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', authCtrl.getMe);
router.get('/auth/users', authCtrl.getUsersList);

// Bike routes
router.get('/bikes', bikeCtrl.getAllBikes);
router.get('/bikes/:id', bikeCtrl.getBikeDetails);
router.post('/bikes', bikeCtrl.createBike);
router.put('/bikes/:id', bikeCtrl.updateBike);
router.delete('/bikes/:id', bikeCtrl.deleteBike);

// Inspection routes
router.get('/inspections', inspectCtrl.getInspections);
router.post('/inspections', inspectCtrl.saveInspection);

// Purchase routes
router.get('/purchases', purchaseCtrl.getAllPurchases);
router.post('/purchases', purchaseCtrl.createPurchase);

// Customer routes
router.get('/customers', custCtrl.getCustomers);
router.post('/customers', custCtrl.createCustomer);

// Enquiry routes
router.get('/enquiries', enqCtrl.getEnquiries);
router.post('/enquiries', enqCtrl.createEnquiry);
router.patch('/enquiries/:id/stage', enqCtrl.updateStage);

// Test ride routes
router.get('/test-rides', trCtrl.getTestRides);
router.post('/test-rides', trCtrl.createTestRide);
router.patch('/test-rides/:id/status', trCtrl.updateStatus);

// Booking routes
router.get('/bookings', bkgCtrl.getBookings);
router.post('/bookings', bkgCtrl.createBooking);

// Sales & Invoicing routes
router.get('/sales', salesCtrl.getSales);
router.post('/sales', salesCtrl.createSale);

// Expenses routes
router.get('/expenses', expCtrl.getExpenses);
router.post('/expenses', expCtrl.createExpense);

// Reports & Dashboard
router.get('/reports/dashboard', reportCtrl.getDashboardReport);

module.exports = router;

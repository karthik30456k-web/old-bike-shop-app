// Zero-dependency pure Node.js HTTP server for immediate startup without requiring npm install!
const http = require('http');
const url = require('url');
const db = require('./src/config/db');

const PORT = process.env.PORT || 5000;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const method = req.method;

  try {
    // Health
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'online',
        service: 'Used Bike Showroom Management Server',
        database_engine: db.getMode()
      });
    }

    // Auth
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const users = await db.getUsers();
      const user = users.find(u => u.role === body.role || u.email === body.email) || users[0];
      return sendJson(res, 200, { success: true, token: `token_${user.id}`, user });
    }

    if (pathname === '/api/auth/users' && method === 'GET') {
      const users = await db.getUsers();
      return sendJson(res, 200, { success: true, users });
    }

    // Bikes
    if (pathname === '/api/bikes' && method === 'GET') {
      const bikes = await db.getBikes(query);
      return sendJson(res, 200, { success: true, count: bikes.length, data: bikes });
    }

    if (pathname.startsWith('/api/bikes/') && method === 'GET') {
      const id = pathname.replace('/api/bikes/', '');
      const bike = await db.getBikeById(id);
      if (!bike) return sendJson(res, 404, { success: false, message: 'Bike not found' });
      return sendJson(res, 200, { success: true, data: bike });
    }

    if (pathname === '/api/bikes' && method === 'POST') {
      const body = await parseBody(req);
      const bike = await db.createBike(body);
      return sendJson(res, 201, { success: true, data: bike });
    }

    if (pathname.startsWith('/api/bikes/') && (method === 'PUT' || method === 'PATCH')) {
      const id = pathname.replace('/api/bikes/', '');
      const body = await parseBody(req);
      const bike = await db.updateBike(id, body);
      return sendJson(res, 200, { success: true, data: bike });
    }

    if (pathname.startsWith('/api/bikes/') && method === 'DELETE') {
      const id = pathname.replace('/api/bikes/', '');
      await db.deleteBike(id);
      return sendJson(res, 200, { success: true, message: 'Deleted' });
    }

    // Inspections
    if (pathname === '/api/inspections' && method === 'GET') {
      const data = await db.getInspections();
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/inspections' && method === 'POST') {
      const body = await parseBody(req);
      const saved = await db.saveInspection(body);
      return sendJson(res, 200, { success: true, data: saved });
    }

    // Purchases
    if (pathname === '/api/purchases' && method === 'GET') {
      const data = await db.getPurchases();
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/purchases' && method === 'POST') {
      const body = await parseBody(req);
      const data = await db.createPurchase(body);
      return sendJson(res, 201, { success: true, data });
    }

    // Customers
    if (pathname === '/api/customers' && method === 'GET') {
      const data = await db.getCustomers();
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/customers' && method === 'POST') {
      const body = await parseBody(req);
      const data = await db.createCustomer(body);
      return sendJson(res, 201, { success: true, data });
    }

    // Enquiries
    if (pathname === '/api/enquiries' && method === 'GET') {
      const data = await db.getEnquiries();
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/enquiries' && method === 'POST') {
      const body = await parseBody(req);
      const data = await db.createEnquiry(body);
      return sendJson(res, 201, { success: true, data });
    }

    if (pathname.includes('/stage') && pathname.startsWith('/api/enquiries/') && method === 'PATCH') {
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      const data = await db.updateEnquiryStage(id, body.stage, body.notes);
      return sendJson(res, 200, { success: true, data });
    }

    // Test Rides
    if (pathname === '/api/test-rides' && method === 'GET') {
      const data = await db.getTestRides();
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/test-rides' && method === 'POST') {
      const body = await parseBody(req);
      const data = await db.createTestRide(body);
      return sendJson(res, 201, { success: true, data });
    }

    if (pathname.includes('/status') && pathname.startsWith('/api/test-rides/') && method === 'PATCH') {
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      const data = await db.updateTestRideStatus(id, body.status, body.feedback);
      return sendJson(res, 200, { success: true, data });
    }

    // Bookings
    if (pathname === '/api/bookings' && method === 'GET') {
      const data = await db.getBookings();
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/bookings' && method === 'POST') {
      const body = await parseBody(req);
      const data = await db.createBooking(body);
      return sendJson(res, 201, { success: true, data });
    }

    // Sales
    if (pathname === '/api/sales' && method === 'GET') {
      const data = await db.getSales();
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/sales' && method === 'POST') {
      const body = await parseBody(req);
      const data = await db.createSale(body);
      return sendJson(res, 201, { success: true, data });
    }

    // Expenses
    if (pathname === '/api/expenses' && method === 'GET') {
      const data = await db.getExpenses();
      return sendJson(res, 200, { success: true, data });
    }

    if (pathname === '/api/expenses' && method === 'POST') {
      const body = await parseBody(req);
      const data = await db.createExpense(body);
      return sendJson(res, 201, { success: true, data });
    }

    // Reports / Dashboard
    if (pathname === '/api/reports/dashboard' && method === 'GET') {
      const data = await db.getDashboardMetrics();
      return sendJson(res, 200, { success: true, database_engine: db.getMode(), data });
    }

    // Default 404
    sendJson(res, 404, { success: false, message: `Route ${pathname} not found` });
  } catch (err) {
    console.error('API Error:', err);
    sendJson(res, 500, { success: false, message: 'Server Error', error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏍️  BIKE SHOWROOM BACKEND RUNNING`);
  console.log(`📡  Server URL: http://localhost:${PORT}`);
  console.log(`💾  Database Mode: ${db.getMode()}`);
  console.log(`🩺  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

const fs = require('fs');
const path = require('path');
const initialData = require('../db/seedData');

let pgPool = null;
let usePostgres = false;

// Attempt optional pg connection if pg is installed and config is present
try {
  const { Pool } = require('pg');
  if (process.env.DATABASE_URL) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
} catch (err) {
  // pg optional or not installed
}

// Local JSON File Data Store Path
const dataDir = path.join(__dirname, '../../data');
const storePath = path.join(dataDir, 'showroom_store.json');

function ensureStoreInitialized() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function loadStore() {
  ensureStoreInitialized();
  try {
    const raw = fs.readFileSync(storePath, 'utf-8');
    const data = JSON.parse(raw);
    let modified = false;
    if (data.bikes && Array.isArray(data.bikes)) {
      data.bikes.forEach(b => {
        if (!b.mileage) {
          b.mileage = Number(b.engine_cc) > 300 ? '35 km/l' : Number(b.engine_cc) > 150 ? '45 km/l' : '52 km/l';
          modified = true;
        }
      });
    }
    if (modified) {
      fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    return data;
  } catch (err) {
    console.error('Error reading store, recreating with default seed:', err);
    fs.writeFileSync(storePath, JSON.stringify(initialData, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(initialData));
  }
}

function saveStore(data) {
  ensureStoreInitialized();
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Database helper operations
const db = {
  getMode: () => (usePostgres ? 'PostgreSQL' : 'Active Local Engine (PostgreSQL Compatible)'),

  // Bikes
  getBikes: async (filters = {}) => {
    const store = loadStore();
    let bikes = store.bikes || [];

    if (filters.status && filters.status !== 'all') {
      bikes = bikes.filter(b => b.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.brand && filters.brand !== 'all') {
      bikes = bikes.filter(b => b.brand.toLowerCase() === filters.brand.toLowerCase());
    }
    if (filters.maxPrice) {
      bikes = bikes.filter(b => b.selling_price <= Number(filters.maxPrice));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      bikes = bikes.filter(b =>
        b.brand.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q) ||
        b.stock_id.toLowerCase().includes(q) ||
        (b.reg_number && b.reg_number.toLowerCase().includes(q))
      );
    }
    return bikes;
  },

  getBikeById: async (id) => {
    const store = loadStore();
    const bike = store.bikes.find(b => b.id === id || b.stock_id === id);
    if (!bike) return null;
    const inspection = store.inspections.find(i => i.bike_id === bike.id);
    const expenses = store.expenses.filter(e => e.bike_id === bike.id);
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const trueCost = Number(bike.purchase_price || 0) + totalExpenses;
    return {
      ...bike,
      inspection,
      expenses,
      totalExpenses,
      trueCost,
      estimatedProfit: Number(bike.selling_price || 0) - trueCost
    };
  },

  createBike: async (bikeData) => {
    const store = loadStore();
    const newId = `bk-${Date.now()}`;
    const stockId = bikeData.stock_id || `VB-${new Date().getFullYear()}-${String(store.bikes.length + 1).padStart(2, '0')}`;
    const newBike = {
      id: newId,
      stock_id: stockId,
      status: 'available',
      created_at: new Date().toISOString().split('T')[0],
      ...bikeData,
      mileage: bikeData.mileage || (bikeData.engine_cc > 300 ? '35 km/l' : bikeData.engine_cc > 150 ? '45 km/l' : '52 km/l'),
      selling_price: Number(bikeData.selling_price || bikeData.expected_price || 0),
      purchase_price: Number(bikeData.purchase_price || 0),
      km_driven: Number(bikeData.km_driven || 0),
      year: Number(bikeData.year || new Date().getFullYear()),
      photos: bikeData.photos && bikeData.photos.length > 0 ? bikeData.photos : [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
      ]
    };
    store.bikes.unshift(newBike);
    saveStore(store);
    return newBike;
  },

  updateBike: async (id, updateData) => {
    const store = loadStore();
    const idx = store.bikes.findIndex(b => b.id === id);
    if (idx === -1) return null;
    store.bikes[idx] = { ...store.bikes[idx], ...updateData };
    saveStore(store);
    return store.bikes[idx];
  },

  deleteBike: async (id) => {
    const store = loadStore();
    store.bikes = store.bikes.filter(b => b.id !== id);
    saveStore(store);
    return true;
  },

  // Inspections
  getInspections: async () => {
    const store = loadStore();
    return store.inspections || [];
  },

  saveInspection: async (inspectionData) => {
    const store = loadStore();
    const existingIdx = store.inspections.findIndex(i => i.bike_id === inspectionData.bike_id);
    const newRecord = {
      id: existingIdx >= 0 ? store.inspections[existingIdx].id : `insp-${Date.now()}`,
      inspected_date: new Date().toISOString().split('T')[0],
      ...inspectionData
    };
    if (existingIdx >= 0) {
      store.inspections[existingIdx] = newRecord;
    } else {
      store.inspections.push(newRecord);
    }
    saveStore(store);
    return newRecord;
  },

  // Purchases
  getPurchases: async () => {
    const store = loadStore();
    return store.purchases || [];
  },

  createPurchase: async (purchaseData) => {
    const store = loadStore();
    const purchaseId = `pur-${Date.now()}`;
    const newPurchase = {
      id: purchaseId,
      purchase_date: new Date().toISOString().split('T')[0],
      ...purchaseData
    };
    store.purchases.unshift(newPurchase);

    // If bike details were supplied, automatically add into inventory as available
    let createdBike = null;
    if (purchaseData.bike) {
      const stockId = `VB-${new Date().getFullYear()}-${String(store.bikes.length + 1).padStart(2, '0')}`;
      createdBike = {
        id: `bk-${Date.now()}`,
        stock_id: stockId,
        brand: purchaseData.bike.brand || 'Unknown',
        model: purchaseData.bike.model || 'Unknown',
        variant: purchaseData.bike.variant || '',
        year: Number(purchaseData.bike.year || 2021),
        reg_number: purchaseData.bike.reg_number || `TN XX XX ${Math.floor(1000 + Math.random() * 9000)}`,
        km_driven: Number(purchaseData.bike.km_driven || 0),
        fuel_type: purchaseData.bike.fuel_type || 'Petrol',
        mileage: purchaseData.bike.mileage || '45 km/l',
        color: purchaseData.bike.color || 'Black',
        purchase_price: Number(purchaseData.purchase_price || 0),
        expected_price: Number(purchaseData.expected_selling_price || purchaseData.purchase_price * 1.2),
        selling_price: Number(purchaseData.expected_selling_price || purchaseData.purchase_price * 1.2),
        status: 'available',
        bike_condition: purchaseData.bike.bike_condition || 'Inspected Good',
        photos: purchaseData.bike.photos || ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'],
        created_at: new Date().toISOString().split('T')[0]
      };
      store.bikes.unshift(createdBike);
      newPurchase.bike_id = createdBike.id;
    }

    saveStore(store);
    return { purchase: newPurchase, bike: createdBike };
  },

  // Customers
  getCustomers: async () => {
    const store = loadStore();
    return store.customers || [];
  },

  createCustomer: async (custData) => {
    const store = loadStore();
    const newCust = {
      id: `cust-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      ...custData
    };
    store.customers.unshift(newCust);
    saveStore(store);
    return newCust;
  },

  // Enquiries
  getEnquiries: async () => {
    const store = loadStore();
    return store.enquiries || [];
  },

  createEnquiry: async (enqData) => {
    const store = loadStore();
    const newEnq = {
      id: `enq-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      stage: enqData.stage || 'new',
      ...enqData
    };
    store.enquiries.unshift(newEnq);
    saveStore(store);
    return newEnq;
  },

  updateEnquiryStage: async (id, stage, notes) => {
    const store = loadStore();
    const enq = store.enquiries.find(e => e.id === id);
    if (!enq) return null;
    enq.stage = stage;
    if (notes) enq.notes = notes;
    enq.updated_at = new Date().toISOString().split('T')[0];
    saveStore(store);
    return enq;
  },

  // Test Rides
  getTestRides: async () => {
    const store = loadStore();
    return store.test_rides || [];
  },

  createTestRide: async (trData) => {
    const store = loadStore();
    const newTR = {
      id: `tr-${Date.now()}`,
      status: 'scheduled',
      created_at: new Date().toISOString().split('T')[0],
      ...trData
    };
    store.test_rides.unshift(newTR);
    saveStore(store);
    return newTR;
  },

  updateTestRideStatus: async (id, status, feedback) => {
    const store = loadStore();
    const tr = store.test_rides.find(t => t.id === id);
    if (!tr) return null;
    tr.status = status;
    if (feedback) tr.feedback = feedback;
    saveStore(store);
    return tr;
  },

  // Bookings
  getBookings: async () => {
    const store = loadStore();
    return store.bookings || [];
  },

  createBooking: async (bkgData) => {
    const store = loadStore();
    const bookingNum = `BKG-${new Date().getFullYear()}-${String(store.bookings.length + 1).padStart(3, '0')}`;
    const newBkg = {
      id: `bkg-${Date.now()}`,
      booking_number: bookingNum,
      booking_date: new Date().toISOString().split('T')[0],
      status: 'active',
      ...bkgData
    };
    store.bookings.unshift(newBkg);

    // Transition bike status to reserved
    if (bkgData.bike_id) {
      const bike = store.bikes.find(b => b.id === bkgData.bike_id);
      if (bike) {
        bike.status = 'reserved';
      }
    }

    saveStore(store);
    return newBkg;
  },

  // Sales
  getSales: async () => {
    const store = loadStore();
    return store.sales || [];
  },

  createSale: async (saleData) => {
    const store = loadStore();
    const invoiceNum = `INV-${new Date().getFullYear()}-${String(store.sales.length + 1).padStart(4, '0')}`;
    const newSale = {
      id: `sale-${Date.now()}`,
      invoice_number: invoiceNum,
      sale_date: new Date().toISOString().split('T')[0],
      delivery_date: saleData.delivery_date || new Date().toISOString().split('T')[0],
      delivery_status: 'Delivered',
      ...saleData
    };
    store.sales.unshift(newSale);

    // Transition bike to sold
    if (saleData.bike_id) {
      const bike = store.bikes.find(b => b.id === saleData.bike_id);
      if (bike) {
        bike.status = 'sold';
      }
    }

    saveStore(store);
    return newSale;
  },

  // Expenses
  getExpenses: async () => {
    const store = loadStore();
    return store.expenses || [];
  },

  createExpense: async (expData) => {
    const store = loadStore();
    const newExp = {
      id: `exp-${Date.now()}`,
      expense_date: new Date().toISOString().split('T')[0],
      ...expData,
      amount: Number(expData.amount || 0)
    };
    store.expenses.unshift(newExp);
    saveStore(store);
    return newExp;
  },

  // Reports & Analytics
  getDashboardMetrics: async () => {
    const store = loadStore();
    const bikes = store.bikes || [];
    const sales = store.sales || [];
    const expenses = store.expenses || [];
    const enquiries = store.enquiries || [];
    const bookings = store.bookings || [];

    const totalBikes = bikes.length;
    const availableBikes = bikes.filter(b => b.status === 'available').length;
    const reservedBikes = bikes.filter(b => b.status === 'reserved').length;
    const soldBikes = bikes.filter(b => b.status === 'sold').length;

    const totalPurchaseCost = bikes.reduce((acc, b) => acc + Number(b.purchase_price || 0), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
    const totalInvestment = totalPurchaseCost + totalExpenses;

    const totalSalesRevenue = sales.reduce((acc, s) => acc + Number(s.total_amount || 0), 0);

    // Calculate real net profit on sold bikes
    let profitOnSoldBikes = 0;
    sales.forEach(sale => {
      const bike = bikes.find(b => b.id === sale.bike_id);
      if (bike) {
        const bikeExpenses = expenses
          .filter(e => e.bike_id === bike.id)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
        const costBasis = Number(bike.purchase_price || 0) + bikeExpenses;
        profitOnSoldBikes += (Number(sale.total_amount || 0) - costBasis);
      }
    });

    const activeBookingsAdvance = bookings
      .filter(b => b.status === 'active')
      .reduce((acc, b) => acc + Number(b.booking_amount || 0), 0);

    return {
      totalBikes,
      availableBikes,
      reservedBikes,
      soldBikes,
      totalEnquiries: enquiries.length,
      activeEnquiries: enquiries.filter(e => !['sold', 'lost'].includes(e.stage)).length,
      totalSalesCount: sales.length,
      totalSalesRevenue,
      totalPurchaseCost,
      totalExpenses,
      totalInvestment,
      profitOnSoldBikes,
      activeBookingsAdvance,
      recentBikes: bikes.slice(0, 5),
      recentSales: sales.slice(0, 5),
      recentEnquiries: enquiries.slice(0, 5)
    };
  },

  // Auth / Users
  getUsers: async () => {
    const store = loadStore();
    return store.users || [];
  },

  findUserByEmail: async (email) => {
    const store = loadStore();
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
};

module.exports = db;

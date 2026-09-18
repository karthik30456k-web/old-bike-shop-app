// Client-side resilient data store for static hosting (Tiiny Host, Vercel, Netlify)
// Preserves exact showroom seed data, business calculations, and adds localStorage persistence

const INITIAL_STORE_DATA = {
  users: [
    {
      id: "usr-1",
      name: "Suresh Kumar",
      email: "owner@velocebikes.com",
      role: "admin",
      phone: "+91 98401 23456",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "usr-2",
      name: "Karthik Raja",
      email: "karthik@velocebikes.com",
      role: "staff",
      phone: "+91 98402 34567",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "usr-3",
      name: "Anand Natarajan",
      email: "anand.customer@gmail.com",
      role: "customer",
      phone: "+91 98403 45678",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    }
  ],
  bikes: [
    {
      id: "bk-1",
      stock_id: "VB-2023-01",
      brand: "Yamaha",
      model: "FZ-S V3 ABS",
      variant: "Deluxe Bluetooth",
      year: 2021,
      reg_year: 2021,
      reg_number: "TN 09 BX 4589",
      km_driven: 14500,
      fuel_type: "Petrol",
      engine_cc: 149,
      mileage: "48 km/l",
      color: "Matte Blue",
      owner_count: 1,
      insurance_status: "Active (Comprehensive)",
      insurance_expiry: "2026-11-20",
      rc_status: "Original Available",
      bike_condition: "Excellent",
      purchase_price: 72000,
      expected_price: 88000,
      selling_price: 88000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Pristine single-owner Yamaha FZ-S V3. Full showroom service history with zero accident records. New rear tyre fitted.",
      created_at: "2026-08-10"
    },
    {
      id: "bk-2",
      stock_id: "VB-2023-02",
      brand: "Royal Enfield",
      model: "Classic 350",
      variant: "Dark Stealth Black Dual ABS",
      year: 2020,
      reg_year: 2020,
      reg_number: "TN 07 CW 7721",
      km_driven: 21000,
      fuel_type: "Petrol",
      engine_cc: 349,
      mileage: "35 km/l",
      color: "Stealth Black",
      owner_count: 1,
      insurance_status: "Active (Third Party)",
      insurance_expiry: "2026-10-15",
      rc_status: "Original Available",
      bike_condition: "Very Good",
      purchase_price: 122000,
      expected_price: 145000,
      selling_price: 145000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Timeless Classic 350 in Stealth Black matte finish. Alloy wheels with tubeless tyres. Smooth thump, clean engine.",
      created_at: "2026-08-15"
    },
    {
      id: "bk-3",
      stock_id: "VB-2023-03",
      brand: "KTM",
      model: "Duke 200",
      variant: "BS6 Dual Channel ABS",
      year: 2022,
      reg_year: 2022,
      reg_number: "TN 10 DK 9021",
      km_driven: 9800,
      fuel_type: "Petrol",
      engine_cc: 199,
      mileage: "32 km/l",
      color: "Electronic Orange",
      owner_count: 1,
      insurance_status: "Active (Comprehensive)",
      insurance_expiry: "2027-03-30",
      rc_status: "Original Available",
      bike_condition: "Top Notch",
      purchase_price: 140000,
      expected_price: 165000,
      selling_price: 165000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Low km, track-inspired streetfighter. Fresh chain sprocket, WP Apex suspension, aggressive styling.",
      created_at: "2026-08-20"
    },
    {
      id: "bk-4",
      stock_id: "VB-2023-04",
      brand: "Honda",
      model: "Activa 6G",
      variant: "DLX H-Smart",
      year: 2022,
      reg_year: 2022,
      reg_number: "TN 02 AY 3314",
      km_driven: 11200,
      fuel_type: "Petrol",
      engine_cc: 109,
      mileage: "55 km/l",
      color: "Pearl Siren Blue",
      owner_count: 1,
      insurance_status: "Active (Comprehensive)",
      insurance_expiry: "2027-01-12",
      rc_status: "Original Available",
      bike_condition: "Like New",
      purchase_price: 54000,
      expected_price: 68000,
      selling_price: 68000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Smart key edition Honda Activa 6G. Ideal for daily city commute. High fuel efficiency of 52+ km/l.",
      created_at: "2026-08-22"
    },
    {
      id: "bk-5",
      stock_id: "VB-2023-05",
      brand: "TVS",
      model: "Apache RTR 160 4V",
      variant: "Special Edition SmartXonnect",
      year: 2021,
      reg_year: 2021,
      reg_number: "TN 14 EV 5812",
      km_driven: 17300,
      fuel_type: "Petrol",
      engine_cc: 159,
      mileage: "46 km/l",
      color: "Matte Black & Red",
      owner_count: 1,
      insurance_status: "Active",
      insurance_expiry: "2026-09-28",
      rc_status: "Original Available",
      bike_condition: "Excellent",
      purchase_price: 76000,
      expected_price: 92000,
      selling_price: 92000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Segment best riding modes: Urban, Rain, Sport. Bluetooth navigation console, adjustable levers.",
      created_at: "2026-08-25"
    },
    {
      id: "bk-6",
      stock_id: "VB-2023-06",
      brand: "Bajaj",
      model: "Pulsar NS200",
      variant: "Dual Channel ABS FI",
      year: 2019,
      reg_year: 2019,
      reg_number: "TN 22 BR 1190",
      km_driven: 28000,
      fuel_type: "Petrol",
      engine_cc: 199,
      mileage: "36 km/l",
      color: "Pewter Grey",
      owner_count: 2,
      insurance_status: "Expired - Showroom Renewing",
      insurance_expiry: "2026-07-01",
      rc_status: "Original Available",
      bike_condition: "Good",
      purchase_price: 66000,
      expected_price: 82000,
      selling_price: 82000,
      status: "reserved",
      photos: [
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Triple spark liquid-cooled engine. Reserved for customer Murugan with token advance.",
      created_at: "2026-08-28"
    },
    {
      id: "bk-7",
      stock_id: "VB-2023-07",
      brand: "Suzuki",
      model: "Access 125",
      variant: "Ride Connect Edition Special",
      year: 2021,
      reg_year: 2021,
      reg_number: "TN 05 AZ 8841",
      km_driven: 13000,
      fuel_type: "Petrol",
      engine_cc: 124,
      mileage: "52 km/l",
      color: "Metallic Matte Platinum",
      owner_count: 1,
      insurance_status: "Active",
      insurance_expiry: "2026-12-10",
      rc_status: "Transferred to New Owner",
      bike_condition: "Excellent",
      purchase_price: 51000,
      expected_price: 65000,
      selling_price: 64000,
      status: "sold",
      photos: [
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Sold to Mr. Rajesh Kumar on 05-Sep-2026. Delivered with RC transfer acknowledgment.",
      created_at: "2026-08-05"
    }
  ],
  inspections: [
    {
      id: "insp-1",
      inspected_date: "2026-09-17",
      bike_id: "bk-1",
      engine: "Good",
      battery: "Good",
      tyres: "Good",
      brake: "Good",
      suspension: "Good",
      clutch: "Good",
      gearbox: "Good",
      electrical: "Good",
      lights: "Good",
      body: "Good",
      paint: "Good",
      accident_history: "None (Clean Frame)",
      service_history: "Showroom Verified",
      overall_score: 100,
      status: "Passed",
      notes: "Clean compression, responsive brakes, and smooth gearbox transition.",
      inspected_by: "Karthik Raja (Chief Mechanic & Lead Sales)"
    }
  ],
  purchases: [
    {
      id: "pur-1",
      bike_id: "bk-1",
      purchase_date: "2026-08-10",
      seller_name: "Balaji Swaminathan",
      seller_phone: "+91 98409 11223",
      seller_address: "No 42, 1st Cross, Anna Nagar, Chennai",
      seller_id_proof: "Aadhaar Card (Verified)",
      purchase_price: 72000,
      expected_selling_price: 88000,
      payment_mode: "Bank Transfer (NEFT/RTGS)",
      documents_collected: { rc: true, form29: true, form30: true, noc: false, insurance: true },
      notes: "Single owner vehicle, seller upgrading to Royal Enfield."
    },
    {
      id: "pur-2",
      bike_id: "bk-2",
      purchase_date: "2026-08-15",
      seller_name: "Venkatesh Prasad",
      seller_phone: "+91 97908 22334",
      seller_address: "Plot 12, Gandhi Road, Velachery, Chennai",
      seller_id_proof: "Driving License",
      purchase_price: 122000,
      expected_selling_price: 145000,
      payment_mode: "Bank Transfer (NEFT/RTGS)",
      documents_collected: { rc: true, form29: true, form30: true, noc: true, insurance: true },
      notes: "Full company service records present."
    }
  ],
  customers: [
    {
      id: "cust-1",
      name: "Rajesh Kumar",
      phone: "+91 98411 99887",
      email: "rajesh.kumar@gmail.com",
      address: "15, 3rd Street, T. Nagar, Chennai - 600017",
      customer_type: "buyer",
      source: "Walk-in"
    },
    {
      id: "cust-2",
      name: "Murugan Selvam",
      phone: "+91 97890 55443",
      email: "murugan.selvam@yahoo.com",
      address: "74, GST Road, Tambaram, Chennai",
      customer_type: "buyer",
      source: "Instagram Lead"
    }
  ],
  enquiries: [
    {
      id: "enq-1",
      customer_name: "Vigneshwaran M",
      customer_phone: "+91 98405 67890",
      customer_email: "vicky.m@outlook.com",
      preferred_brand: "Yamaha",
      preferred_model: "FZ / MT-15",
      budget_min: 70000,
      budget_max: 95000,
      stage: "Test Ride Completed",
      notes: "Tested FZ-S V3, requested exchange quotation for his 2016 Discover."
    },
    {
      id: "enq-2",
      customer_name: "Gowtham S",
      customer_phone: "+91 96001 22334",
      customer_email: "gowtham.s@gmail.com",
      preferred_brand: "Royal Enfield",
      preferred_model: "Classic 350",
      budget_min: 120000,
      budget_max: 150000,
      stage: "Booking / Negotiation",
      notes: "Interested in Stealth Black Classic 350. Token advance expected tomorrow."
    }
  ],
  testRides: [
    {
      id: "tr-1",
      customer_name: "Vigneshwaran M",
      customer_phone: "+91 98405 67890",
      bike_id: "bk-1",
      scheduled_date: "2026-09-17",
      scheduled_time: "11:30 AM",
      license_number: "TN-09-2018-0044556",
      status: "completed",
      feedback: "Loved the engine smoothness and comfortable riding posture. Very responsive front disc."
    }
  ],
  bookings: [
    {
      id: "bkg-1",
      booking_number: "VB-BKG-2026-001",
      bike_id: "bk-6",
      customer_name: "Murugan Selvam",
      customer_phone: "+91 97890 55443",
      customer_email: "murugan.selvam@yahoo.com",
      customer_address: "74, GST Road, Tambaram, Chennai",
      advance_amount: 5000,
      agreed_price: 82000,
      payment_mode: "Google Pay / PhonePe",
      booking_date: "2026-09-14",
      status: "confirmed"
    }
  ],
  sales: [
    {
      id: "sal-1",
      invoice_number: "INV-2026-0089",
      sale_date: "2026-09-05",
      bike_id: "bk-7",
      bike_title: "Suzuki Access 125 Special Edition",
      customer_name: "Rajesh Kumar",
      customer_phone: "+91 98411 99887",
      customer_address: "15, 3rd Street, T. Nagar, Chennai - 600017",
      base_amount: 60000,
      rc_transfer_fee: 1500,
      insurance_charge: 1800,
      service_commission: 700,
      total_amount: 64000,
      payment_mode: "Bank Transfer (NEFT/RTGS)",
      notes: "Full payment received. RC transfer documents submitted to RTO South Chennai."
    }
  ],
  expenses: [
    {
      id: "exp-1",
      date: "2026-09-01",
      category: "Refurbishment & Spare Parts",
      bike_id: "bk-1",
      amount: 3200,
      paid_to: "Yamaha Authorized Spares (Padi)",
      payment_mode: "UPI",
      notes: "New rear tyre MRF Nylogrip & front brake pads replacement"
    },
    {
      id: "exp-2",
      date: "2026-09-03",
      category: "RTO & Legal Fees",
      bike_id: "bk-7",
      amount: 1500,
      paid_to: "RTO Facilitation Agent",
      payment_mode: "Cash",
      notes: "Ownership name transfer fee and smart card issue charge"
    }
  ]
};

const STORAGE_KEY = 'veloce_showroom_store_v2';

function getLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.bikes) && parsed.bikes.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using initial store:', e);
  }
  // Initialize storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORE_DATA));
  } catch {}
  return JSON.parse(JSON.stringify(INITIAL_STORE_DATA));
}

function saveLocalStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

export const mockStore = {
  getBikes: (params = {}) => {
    const store = getLocalStore();
    let list = store.bikes || [];
    if (params.status && params.status !== 'all') {
      list = list.filter(b => b.status === params.status);
    }
    if (params.brand && params.brand !== 'all') {
      list = list.filter(b => b.brand.toLowerCase() === params.brand.toLowerCase());
    }
    if (params.maxPrice) {
      list = list.filter(b => Number(b.selling_price) <= Number(params.maxPrice));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(b =>
        b.brand.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q) ||
        (b.reg_number && b.reg_number.toLowerCase().includes(q)) ||
        (b.stock_id && b.stock_id.toLowerCase().includes(q))
      );
    }
    return { success: true, count: list.length, data: list };
  },

  getBikeById: (id) => {
    const store = getLocalStore();
    const bike = store.bikes.find(b => b.id === id);
    if (!bike) return { success: false, message: 'Bike not found' };
    return { success: true, data: bike };
  },

  createBike: (data) => {
    const store = getLocalStore();
    const newId = `bk-${Date.now().toString().slice(-4)}`;
    const stockId = `VB-${new Date().getFullYear()}-${String(store.bikes.length + 1).padStart(2, '0')}`;
    const newBike = {
      id: newId,
      stock_id: stockId,
      status: 'available',
      created_at: new Date().toISOString().split('T')[0],
      ...data
    };
    store.bikes.unshift(newBike);
    saveLocalStore(store);
    return { success: true, data: newBike };
  },

  updateBike: (id, data) => {
    const store = getLocalStore();
    const idx = store.bikes.findIndex(b => b.id === id);
    if (idx === -1) return { success: false, message: 'Bike not found' };
    store.bikes[idx] = { ...store.bikes[idx], ...data };
    saveLocalStore(store);
    return { success: true, data: store.bikes[idx] };
  },

  deleteBike: (id) => {
    const store = getLocalStore();
    store.bikes = store.bikes.filter(b => b.id !== id);
    saveLocalStore(store);
    return { success: true, message: 'Deleted' };
  },

  getDashboardReport: () => {
    const store = getLocalStore();
    const bikes = store.bikes || [];
    const sales = store.sales || [];
    const expenses = store.expenses || [];
    const enquiries = store.enquiries || [];
    const bookings = store.bookings || [];

    const totalBikes = bikes.length;
    const availableBikes = bikes.filter(b => b.status === 'available').length;
    const reservedBikes = bikes.filter(b => b.status === 'reserved').length;
    const soldBikes = bikes.filter(b => b.status === 'sold').length;

    const totalSalesRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
    const totalPurchaseCost = bikes.reduce((sum, b) => sum + Number(b.purchase_price || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalInvestment = totalPurchaseCost + totalExpenses;

    const profitOnSoldBikes = sales.reduce((sum, s) => {
      const bike = bikes.find(b => b.id === s.bike_id);
      const buyPrice = bike ? Number(bike.purchase_price || 0) : 0;
      return sum + (Number(s.total_amount || 0) - buyPrice);
    }, 0);

    const activeBookingsAdvance = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + Number(b.advance_amount || 0), 0);

    return {
      success: true,
      data: {
        totalBikes,
        availableBikes,
        reservedBikes,
        soldBikes,
        totalEnquiries: enquiries.length,
        activeEnquiries: enquiries.filter(e => e.stage !== 'Closed / Dropped').length,
        totalSalesRevenue,
        totalPurchaseCost,
        totalExpenses,
        totalInvestment,
        profitOnSoldBikes,
        activeBookingsAdvance,
        inventoryStatusBreakdown: {
          available: availableBikes,
          reserved: reservedBikes,
          sold: soldBikes
        },
        recentSales: sales.slice(0, 5),
        recentEnquiries: enquiries.slice(0, 5)
      }
    };
  },

  getInspections: () => {
    const store = getLocalStore();
    return { success: true, count: store.inspections.length, data: store.inspections };
  },

  saveInspection: (data) => {
    const store = getLocalStore();
    const newInsp = {
      id: `insp-${Date.now().toString().slice(-4)}`,
      inspected_date: new Date().toISOString().split('T')[0],
      ...data
    };
    store.inspections.unshift(newInsp);
    saveLocalStore(store);
    return { success: true, data: newInsp };
  },

  getPurchases: () => {
    const store = getLocalStore();
    return { success: true, count: store.purchases.length, data: store.purchases };
  },

  createPurchase: (data) => {
    const store = getLocalStore();
    const newPur = {
      id: `pur-${Date.now().toString().slice(-4)}`,
      purchase_date: new Date().toISOString().split('T')[0],
      ...data
    };
    store.purchases.unshift(newPur);

    // If bike details are attached, also register bike
    if (data.bike) {
      const newBike = {
        id: `bk-${Date.now().toString().slice(-4)}`,
        stock_id: `VB-${new Date().getFullYear()}-${String(store.bikes.length + 1).padStart(2, '0')}`,
        status: 'available',
        purchase_price: data.purchase_price,
        selling_price: data.expected_selling_price || data.purchase_price * 1.15,
        created_at: new Date().toISOString().split('T')[0],
        ...data.bike
      };
      store.bikes.unshift(newBike);
      newPur.bike_id = newBike.id;
    }

    saveLocalStore(store);
    return { success: true, data: newPur };
  },

  getCustomers: () => {
    const store = getLocalStore();
    return { success: true, count: store.customers.length, data: store.customers };
  },

  createCustomer: (data) => {
    const store = getLocalStore();
    const newCust = { id: `cust-${Date.now().toString().slice(-4)}`, ...data };
    store.customers.unshift(newCust);
    saveLocalStore(store);
    return { success: true, data: newCust };
  },

  getEnquiries: () => {
    const store = getLocalStore();
    return { success: true, count: store.enquiries.length, data: store.enquiries };
  },

  createEnquiry: (data) => {
    const store = getLocalStore();
    const newEnq = { id: `enq-${Date.now().toString().slice(-4)}`, stage: 'New Enquiry', ...data };
    store.enquiries.unshift(newEnq);
    saveLocalStore(store);
    return { success: true, data: newEnq };
  },

  updateEnquiryStage: (id, stage, notes) => {
    const store = getLocalStore();
    const idx = store.enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      store.enquiries[idx].stage = stage;
      if (notes) store.enquiries[idx].notes = notes;
      saveLocalStore(store);
      return { success: true, data: store.enquiries[idx] };
    }
    return { success: false, message: 'Enquiry not found' };
  },

  getTestRides: () => {
    const store = getLocalStore();
    return { success: true, count: store.testRides.length, data: store.testRides };
  },

  createTestRide: (data) => {
    const store = getLocalStore();
    const newTr = { id: `tr-${Date.now().toString().slice(-4)}`, status: 'scheduled', ...data };
    store.testRides.unshift(newTr);
    saveLocalStore(store);
    return { success: true, data: newTr };
  },

  updateTestRideStatus: (id, status, feedback) => {
    const store = getLocalStore();
    const idx = store.testRides.findIndex(t => t.id === id);
    if (idx !== -1) {
      store.testRides[idx].status = status;
      if (feedback) store.testRides[idx].feedback = feedback;
      saveLocalStore(store);
      return { success: true, data: store.testRides[idx] };
    }
    return { success: false, message: 'Test ride not found' };
  },

  getBookings: () => {
    const store = getLocalStore();
    return { success: true, count: store.bookings.length, data: store.bookings };
  },

  createBooking: (data) => {
    const store = getLocalStore();
    const newBkg = {
      id: `bkg-${Date.now().toString().slice(-4)}`,
      booking_number: `VB-BKG-${new Date().getFullYear()}-${String(store.bookings.length + 1).padStart(3, '0')}`,
      booking_date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      ...data
    };
    store.bookings.unshift(newBkg);
    // Mark bike as reserved
    const bikeIdx = store.bikes.findIndex(b => b.id === data.bike_id);
    if (bikeIdx !== -1) {
      store.bikes[bikeIdx].status = 'reserved';
    }
    saveLocalStore(store);
    return { success: true, data: newBkg };
  },

  getSales: () => {
    const store = getLocalStore();
    return { success: true, count: store.sales.length, data: store.sales };
  },

  createSale: (data) => {
    const store = getLocalStore();
    const newSale = {
      id: `sal-${Date.now().toString().slice(-4)}`,
      invoice_number: `INV-${new Date().getFullYear()}-${String(store.sales.length + 89).padStart(4, '0')}`,
      sale_date: new Date().toISOString().split('T')[0],
      ...data
    };
    store.sales.unshift(newSale);
    // Mark bike as sold
    const bikeIdx = store.bikes.findIndex(b => b.id === data.bike_id);
    if (bikeIdx !== -1) {
      store.bikes[bikeIdx].status = 'sold';
    }
    saveLocalStore(store);
    return { success: true, data: newSale };
  },

  getExpenses: () => {
    const store = getLocalStore();
    return { success: true, count: store.expenses.length, data: store.expenses };
  },

  createExpense: (data) => {
    const store = getLocalStore();
    const newExp = {
      id: `exp-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      ...data
    };
    store.expenses.unshift(newExp);
    saveLocalStore(store);
    return { success: true, data: newExp };
  },

  login: (credentials) => {
    const store = getLocalStore();
    const user = store.users.find(u => u.email === credentials.email) || store.users[0];
    return {
      success: true,
      token: `token_${user.id}_${Date.now()}`,
      user
    };
  }
};

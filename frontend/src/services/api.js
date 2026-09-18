import { mockStore } from './mockStore';

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Return null to signal caller to use resilient mock store
    return null;
  }
}

export const api = {
  // Health
  checkHealth: async () => {
    const res = await request('/health');
    return res || { status: 'ok', mode: 'static' };
  },

  // Auth / Users
  login: async (credentials) => {
    const res = await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    return res || mockStore.login(credentials);
  },
  getUsers: async () => {
    const res = await request('/auth/users');
    return res || { success: true, users: mockStore.users };
  },

  // Dashboard
  getDashboard: async () => {
    const res = await request('/reports/dashboard');
    return res || mockStore.getDashboardReport();
  },

  // Bikes
  getBikes: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.brand) query.append('brand', params.brand);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    const res = await request(`/bikes${qs ? `?${qs}` : ''}`);
    return res || mockStore.getBikes(params);
  },
  getBikeById: async (id) => {
    const res = await request(`/bikes/${id}`);
    return res || mockStore.getBikeById(id);
  },
  createBike: async (data) => {
    const res = await request('/bikes', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.createBike(data);
  },
  updateBike: async (id, data) => {
    const res = await request(`/bikes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res || mockStore.updateBike(id, data);
  },
  deleteBike: async (id) => {
    const res = await request(`/bikes/${id}`, { method: 'DELETE' });
    return res || mockStore.deleteBike(id);
  },

  // Inspections
  getInspections: async () => {
    const res = await request('/inspections');
    return res || mockStore.getInspections();
  },
  saveInspection: async (data) => {
    const res = await request('/inspections', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.saveInspection(data);
  },

  // Purchases
  getPurchases: async () => {
    const res = await request('/purchases');
    return res || mockStore.getPurchases();
  },
  createPurchase: async (data) => {
    const res = await request('/purchases', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.createPurchase(data);
  },

  // Customers
  getCustomers: async () => {
    const res = await request('/customers');
    return res || mockStore.getCustomers();
  },
  createCustomer: async (data) => {
    const res = await request('/customers', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.createCustomer(data);
  },

  // Enquiries
  getEnquiries: async () => {
    const res = await request('/enquiries');
    return res || mockStore.getEnquiries();
  },
  createEnquiry: async (data) => {
    const res = await request('/enquiries', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.createEnquiry(data);
  },
  updateEnquiryStage: async (id, stage, notes) => {
    const res = await request(`/enquiries/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage, notes }) });
    return res || mockStore.updateEnquiryStage(id, stage, notes);
  },

  // Test Rides
  getTestRides: async () => {
    const res = await request('/test-rides');
    return res || mockStore.getTestRides();
  },
  createTestRide: async (data) => {
    const res = await request('/test-rides', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.createTestRide(data);
  },
  updateTestRideStatus: async (id, status, feedback) => {
    const res = await request(`/test-rides/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, feedback }) });
    return res || mockStore.updateTestRideStatus(id, status, feedback);
  },

  // Bookings
  getBookings: async () => {
    const res = await request('/bookings');
    return res || mockStore.getBookings();
  },
  createBooking: async (data) => {
    const res = await request('/bookings', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.createBooking(data);
  },

  // Sales
  getSales: async () => {
    const res = await request('/sales');
    return res || mockStore.getSales();
  },
  createSale: async (data) => {
    const res = await request('/sales', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.createSale(data);
  },

  // Expenses
  getExpenses: async () => {
    const res = await request('/expenses');
    return res || mockStore.getExpenses();
  },
  createExpense: async (data) => {
    const res = await request('/expenses', { method: 'POST', body: JSON.stringify(data) });
    return res || mockStore.createExpense(data);
  }
};

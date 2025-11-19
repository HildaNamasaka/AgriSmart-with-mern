import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
};

// Farm APIs
export const farmAPI = {
  getAll: () => API.get('/farms'),
  create: (data) => API.post('/farms', data),
  update: (id, data) => API.put(`/farms/${id}`, data),
  delete: (id) => API.delete(`/farms/${id}`)
};

// Activity APIs
export const activityAPI = {
  getAll: () => API.get('/activities'),
  create: (data) => API.post('/activities', data),
  delete: (id) => API.delete(`/activities/${id}`)
};

// Expense APIs
export const expenseAPI = {
  getAll: () => API.get('/expenses'),
  create: (data) => API.post('/expenses', data),
  delete: (id) => API.delete(`/expenses/${id}`)
};

// Income APIs
export const incomeAPI = {
  getAll: () => API.get('/income'),
  create: (data) => API.post('/income', data),
  delete: (id) => API.delete(`/income/${id}`)
};

// Price APIs
export const priceAPI = {
  getAll: () => API.get('/prices'),
  getByCrop: (crop, county) => API.get(`/prices/${crop}/${county}`)
};

// Listing APIs
export const listingAPI = {
  getAll: () => API.get('/listings'),
  create: (data) => API.post('/listings', data),
  delete: (id) => API.delete(`/listings/${id}`)
};

export default API;
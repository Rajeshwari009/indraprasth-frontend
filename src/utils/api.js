import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  getAllAdmin: () => API.get('/products/admin/all'),
  create: (data) => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
};

export const schoolAPI = {
  getAll: () => API.get('/schools'),
  getOne: (id) => API.get(`/schools/${id}`),
  getAllAdmin: () => API.get('/schools/admin/all'),
  create: (data) => API.post('/schools', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/schools/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/schools/${id}`),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  createPaymentIntent: (orderId) => API.post('/orders/payment-intent', { orderId }),
  confirmPayment: (data) => API.post('/orders/confirm-payment', data),
  createRazorpayOrder: (orderId) => API.post('/orders/razorpay-order', { orderId }),
  verifyRazorpayPayment: (data) => API.post('/orders/razorpay-verify', data),
  confirmCOD: (orderId) => API.post('/orders/confirm-cod', { orderId }),
  getMyOrders: () => API.get('/orders/my-orders'),
  getAllAdmin: () => API.get('/orders/admin/all'),
  updateStatus: (id, status) => API.put(`/orders/admin/${id}/status`, { status }),
};

export const bulkOrderAPI = {
  create: (data) => API.post('/bulk-orders', data),
  getAllAdmin: () => API.get('/bulk-orders/admin/all'),
  updateStatus: (id, data) => API.put(`/bulk-orders/admin/${id}/status`, data),
};

export default API;

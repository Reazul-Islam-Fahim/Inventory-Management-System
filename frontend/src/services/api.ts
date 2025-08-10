import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productApi = {
  getAll: async (params?: any) => {
    const res = await api.get('/product', { params });
    return res.data.data; 
  },
  getById: (id: number) => api.get(`/product/${id}`).then(res => res.data),
  create: (data: any) => api.post('/product', data).then(res => res.data),
  update: (id: number, data: any) => api.put(`/product/${id}`, data).then(res => res.data),
};

// Inventory API
export const inventoryApi = {
  getAll: (params: any) => api.get('/inventory', { params }),
  getById: (id: number) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post('/inventory', data),
  update: (id: number, data: any) => api.put(`/inventory/${id}`, data),
  delete: (id: number) => api.delete(`/inventory/${id}`),
};

export default api;
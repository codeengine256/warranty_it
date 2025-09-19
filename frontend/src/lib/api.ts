import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest,
  PaginatedResponse,
  ProductStats,
  PaginationParams
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post('/auth/login', data);
    return response.data.data!;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post('/auth/register', data);
    return response.data.data!;
  },

  getProfile: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/auth/profile');
    return response.data;
  },
};

// Product API
export const productApi = {
  getProducts: async (params?: PaginationParams): Promise<PaginatedResponse<Product>> => {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Product>>> = await api.get('/products', { params });
    return response.data.data!;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response: AxiosResponse<ApiResponse<Product>> = await api.get(`/products/${id}`);
    return response.data.data!;
  },

  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response: AxiosResponse<ApiResponse<Product>> = await api.post('/products', data);
    return response.data.data!;
  },

  updateProduct: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response: AxiosResponse<ApiResponse<Product>> = await api.put(`/products/${id}`, data);
    return response.data.data!;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getProductStats: async (): Promise<ProductStats> => {
    const response: AxiosResponse<ApiResponse<ProductStats>> = await api.get('/products/stats');
    return response.data.data!;
  },
};

export default api;

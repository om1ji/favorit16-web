import axios from 'axios';
import { CategoryListResponse, ProductListResponse, Product, ProductFilters } from '@/types/api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await api.post<AuthResponse>('/api/v1/users/refresh/', {
            refresh: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Если не удалось обновить токен, разлогиниваем пользователя
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const login = async (credentials: LoginCredentials) => {
  const response = await api.post<AuthResponse>('/api/v1/users/login/', credentials);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post<AuthResponse>('/api/v1/users/register/', data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/api/v1/users/logout/');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get<User>('/api/v1/users/me/');
  return response.data;
};

// Products API
export const getCategories = async () => {
  const response = await api.get<CategoryListResponse>('/api/v1/products/categories/');
  return response.data;
};

export const getProducts = async (filters?: ProductFilters) => {
  const response = await api.get<ProductListResponse>('/api/v1/products/', {
    params: filters,
  });
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get<Product>(`/api/v1/products/${id}/`);
  return response.data;
};

export default api; 
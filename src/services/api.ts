import axios from 'axios';
import { Product, ProductsResponse, ProductsFilter, Category, AdminProduct, AdminProductsResponse } from '@/types/product';
import { API_URL, API_VERSION } from '@/config/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/api/${API_VERSION}/auth/token/refresh/`, {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh failed, clear tokens and reject
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

interface AdminCategory extends Category {
  level: number;
  full_name: string;
}

// API для аутентификации
export const authAPI = {
  register: async (data: { email: string; password: string; name: string; phone?: string; password2: string }) => {
    const response = await api.post('/users/register/', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/users/token/', data);
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await api.post('/users/token/refresh/', { refresh });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/users/me/');
    console.log('getMe response:', response.data);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  updateProfile: async (data: { name: string; email: string; phone?: string }) => {
    const response = await api.patch('/users/me/', data);
    return response.data;
  }
};

// API для продуктов
export const productsAPI = {
  getProducts: async (params?: ProductsFilter) => {
    const response = await api.get<ProductsResponse>('/products/', { params });
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}/`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<{ count: number; results: Category[] }>('/products/categories/');
    return response.data;
  }
};

// API для корзины
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart/');
    return response.data;
  },

  addToCart: async (data: { product_id: string; quantity: number }) => {
    const response = await api.post('/cart/', data);
    return response.data;
  },

  removeFromCart: async (id: string) => {
    await api.delete(`/cart/${id}/`);
  },

  updateCartItem: async (id: string, quantity: number) => {
    const response = await api.patch(`/cart/${id}/`, { quantity });
    return response.data;
  }
};

// API для заказов
export const ordersAPI = {
  getOrders: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  }
};

// API для админ панели
export const adminAPI = {
  // Получение списка продуктов с фильтрацией и пагинацией
  getProducts: async (params?: {
    page?: string;
    page_size?: string;
    search?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    status?: string;
    ordering?: string;
  }) => {
    const response = await api.get<AdminProductsResponse>('/admin/products/', { params });
    return response.data;
  },

  // Получение категорий для админ панели
  getCategories: async () => {
    const response = await api.get<{ count: number; results: Category[] }>('/admin/categories/');
    return response.data;
  },

  // Получение категорий для селекта
  getCategoriesForSelect: async () => {
    const response = await api.get<AdminCategory[]>('/admin/categories/select/');
    return response.data;
  },

  // Получение деталей продукта
  getProduct: async (id: string) => {
    const response = await api.get<AdminProduct>(`/admin/products/${id}/`);
    return response.data;
  },

  // Создание нового продукта
  createProduct: async (data: FormData) => {
    const response = await api.post<AdminProduct>('/admin/products/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Обновление продукта
  updateProduct: async (id: string, data: FormData) => {
    const response = await api.patch<AdminProduct>(`/admin/products/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Удаление продукта
  deleteProduct: async (id: string) => {
    await api.delete(`/admin/products/${id}/`);
  },

  // Получение данных дашборда
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard/');
    return response.data;
  },

  // Загрузка изображения
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<{
      id: string;
      image: string;
      thumbnail: string;
    }>('/admin/upload/image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api; 
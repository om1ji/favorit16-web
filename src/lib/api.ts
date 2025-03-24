import axios from "axios";
import {
  CategoryListResponse,
  BrandListResponse,
  ProductListResponse,
  Product,
  ProductFilters,
} from "@/types/api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types/auth";

// Кеш для хранения результатов запросов
interface Cache {
  categories?: CategoryListResponse;
  brands?: BrandListResponse;
  products?: {
    [key: string]: ProductListResponse;
  };
  productDetails?: {
    [id: string]: Product;
  };
}

// Инициализируем кеш
const cache: Cache = {
  products: {},
  productDetails: {},
};

// Функция для создания ключа кеша из фильтров продуктов
const createCacheKey = (filters?: ProductFilters): string => {
  if (!filters) return "all";
  return JSON.stringify(filters);
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Перехватчик для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
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
    console.log(
      `API Error [${error.response?.status}]:`,
      originalRequest?.url,
      { retryCount: originalRequest?._retryCount || 0 },
    );

    // Если ошибка 401 и это не запрос на обновление токена и мы ещё не пытались обновить токен слишком много раз
    if (
      error.response?.status === 401 &&
      !originalRequest?._isRefreshRequest &&
      (!originalRequest?._retryCount || originalRequest._retryCount < 2) &&
      !originalRequest?.url?.includes("/auth/token/refresh/") &&
      !originalRequest?.url?.includes("/users/refresh/")
    ) {
      // Увеличиваем счетчик попыток
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          console.log(
            "Attempting to refresh token with retry count:",
            originalRequest._retryCount,
          );

          // Помечаем запрос как запрос обновления токена для избежания циклов
          originalRequest._isRefreshRequest = true;

          // Попробуем сначала через auth/token/refresh/ (стандартный JWT-путь)
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/token/refresh/`,
              { refresh: refreshToken },
              { headers: { "Content-Type": "application/json" } },
            );

            console.log("Token refresh successful via auth/token");
            localStorage.setItem("access_token", response.data.access);
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

            // Сбрасываем флаг после успешного обновления
            originalRequest._isRefreshRequest = false;

            return api(originalRequest);
          } catch (authRefreshError) {
            console.log("Auth refresh failed, trying users/refresh endpoint");

            // Если первый путь не сработал, попробуем через /users/refresh/
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/refresh/`,
              { refresh: refreshToken },
              { headers: { "Content-Type": "application/json" } },
            );

            console.log("Token refresh successful via users/refresh");
            localStorage.setItem("access_token", response.data.access);
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

            // Сбрасываем флаг после успешного обновления
            originalRequest._isRefreshRequest = false;

            return api(originalRequest);
          }
        } catch (refreshError) {
          // Если не удалось обновить токен, разлогиниваем пользователя
          console.error("Failed to refresh token:", refreshError);

          // Сбрасываем флаг, чтобы другие запросы могли попытаться обновить токен
          originalRequest._isRefreshRequest = false;

          // Проверяем, не происходит ли это в фоновом режиме
          const isBackgroundRequest =
            originalRequest?.url?.includes("/me/") ||
            originalRequest?.url?.includes("/cart/");

          // Очищаем токены только если это не фоновый запрос
          if (!isBackgroundRequest) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            // Перенаправляем только если мы на клиенте и это не серверный рендеринг
            if (typeof window !== "undefined" && !isBackgroundRequest) {
              console.log("Redirecting to login due to auth failure");
              window.location.href = "/login";
            }
          } else {
            console.log("Auth failure in background request, not redirecting");
          }
        }
      }
    }

    return Promise.reject(error);
  },
);

// Auth API
export const login = async (credentials: LoginCredentials) => {
  const response = await api.post<AuthResponse>(
    "//users/login/",
    credentials,
  );
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post<AuthResponse>(
    "//users/register/",
    data,
  );
  return response.data;
};

export const logout = async () => {
  const response = await api.post("//users/logout/");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get<User>("//users/me/");
  return response.data;
};

// Products API
export const getCategories = async () => {
  // Используем кеш если есть данные
  if (cache.categories) {
    console.log("Using cached categories");
    return cache.categories;
  }

  const response = await api.get<CategoryListResponse>(
    "/products/categories/",
  );
  // Сохраняем в кеш
  cache.categories = response.data;
  return response.data;
};

export const getBrands = async () => {
  // Используем кеш если есть данные
  if (cache.brands) {
    console.log("Using cached brands");
    return cache.brands;
  }

  const response = await api.get<BrandListResponse>("/products/brands/");
  // Сохраняем в кеш
  cache.brands = response.data;
  return response.data;
};

export const getProducts = async (filters?: ProductFilters) => {
  const cacheKey = createCacheKey(filters);

  // Проверяем, есть ли результат в кеше
  if (cache.products && cache.products[cacheKey]) {
    console.log("Using cached products for:", filters);
    return cache.products[cacheKey];
  }

  const response = await api.get<ProductListResponse>("/products/", {
    params: filters,
  });

  // Сохраняем результат в кеш
  if (!cache.products) cache.products = {};
  cache.products[cacheKey] = response.data;

  return response.data;
};

export const getProduct = async (id: string) => {
  // Проверяем кеш для деталей продукта
  if (cache.productDetails && cache.productDetails[id]) {
    console.log("Using cached product details for ID:", id);
    return cache.productDetails[id];
  }

  const response = await api.get<Product>(`/products/${id}/`);

  // Сохраняем в кеш
  if (!cache.productDetails) cache.productDetails = {};
  cache.productDetails[id] = response.data;

  return response.data;
};

// Метод для очистки кеша (например, после обновления данных)
export const clearCache = (
  type?: "categories" | "brands" | "products" | "productDetails",
) => {
  if (!type) {
    // Очищаем весь кеш
    cache.categories = undefined;
    cache.brands = undefined;
    cache.products = {};
    cache.productDetails = {};
    console.log("Cache cleared completely");
  } else if (type === "categories") {
    cache.categories = undefined;
    console.log("Categories cache cleared");
  } else if (type === "brands") {
    cache.brands = undefined;
    console.log("Brands cache cleared");
  } else if (type === "products") {
    cache.products = {};
    console.log("Products cache cleared");
  } else if (type === "productDetails") {
    cache.productDetails = {};
    console.log("Product details cache cleared");
  }
};

export default api;

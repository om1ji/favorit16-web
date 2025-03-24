import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Product,
  Category,
  Brand,
  ProductFilters,
  CategoryListResponse,
  BrandListResponse,
} from "@/types/api";
import { getCategories, getProducts, getProduct, getBrands } from "@/lib/api";
import { RootState } from "../store";
import { AxiosError } from "axios";
import api from "@/lib/api";

interface ProductsState {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalProducts: number;
  currentPage: number;
  currentFilters: ProductFilters | null;
}

const initialState: ProductsState = {
  categories: [],
  brands: [],
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  totalProducts: 0,
  currentPage: 1,
  currentFilters: null,
};

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;

    // Если категории уже загружены, возвращаем их
    if (state.products.categories.length > 0 && !state.products.loading) {
      console.log("Using cached categories");
      return state.products.categories;
    }

    try {
      const response = await api.get("/products/categories/");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Произошла ошибка при загрузке категорий",
        );
      }
      return rejectWithValue("Произошла ошибка при загрузке категорий");
    }
  },
);

export const fetchBrands = createAsyncThunk(
  "products/fetchBrands",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;

    // Если бренды уже загружены, возвращаем их
    if (state.products.brands.length > 0 && !state.products.loading) {
      console.log("Using cached brands");
      return state.products.brands;
    }

    try {
      const response = await api.get("/products/brands/");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Произошла ошибка при загрузке брендов",
        );
      }
      return rejectWithValue("Произошла ошибка при загрузке брендов");
    }
  },
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters: ProductFilters, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    // Проверяем, не идентичен ли текущий запрос предыдущему
    const currentFilters = state.products.currentFilters;
    const currentPage = state.products.currentPage;

    // Если фильтры и страница не изменились, не делаем запрос
    if (
      currentPage === filters.page &&
      JSON.stringify(currentFilters) === JSON.stringify(filters) &&
      state.products.products.length > 0
    ) {
      return {
        results: state.products.products,
        count: state.products.totalProducts,
      };
    }

    try {
      const queryParams = new URLSearchParams();

      // Если у нас есть категория (в формате slug), мы должны найти id этой категории
      if (filters.category) {
        const categories = state.products.categories;

        // Проверяем, есть ли у нас загруженные категории
        if (categories.length === 0) {
          console.log("Categories not loaded yet, delaying product fetch");
          return {
            results: [],
            count: 0,
          };
        }

        // Проверяем, является ли категория slug-ом или id
        const isSlug = isNaN(Number(filters.category));
        if (isSlug) {
          const category = categories.find((c) => c.slug === filters.category);
          if (category) {
            // Отправляем id категории в API запрос
            queryParams.append("category", category.id);
            console.log(
              `Converting category slug ${filters.category} to ID ${category.id} for API request`,
            );
          } else {
            console.warn(
              `Category with slug ${filters.category} not found, using slug as fallback`,
            );
            queryParams.append("category", filters.category);
          }
        } else {
          // Если это числовой id, используем как есть
          queryParams.append("category", filters.category);
        }
      }

      if (filters.brand) {
        queryParams.append("brand", filters.brand);
      }

      if (filters.ordering) {
        queryParams.append("ordering", filters.ordering);
      }

      if (filters.search) {
        queryParams.append("search", filters.search);
      }

      if (filters.page) {
        queryParams.append("page", filters.page.toString());
      }

      if (filters.width) {
        queryParams.append("width", filters.width.toString());
      }

      if (filters.profile) {
        queryParams.append("profile", filters.profile.toString());
      }

      if (filters.diameter) {
        queryParams.append("diameter", filters.diameter.toString());
      }

      // Ограничиваем количество результатов, если мы загружаем товары для главной страницы
      if (
        filters.ordering === "-created_at" &&
        !filters.category &&
        !filters.brand &&
        !filters.search
      ) {
        queryParams.append("limit", "6"); // Для главной страницы достаточно 6 товаров
      }

      const response = await api.get(
        `/products/?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Произошла ошибка при загрузке товаров",
        );
      }
      return rejectWithValue("Произошла ошибка при загрузке товаров");
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (idOrSlug: string) => {
    try {
      const response = await api.get(`/products/${idOrSlug}/`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            "Произошла ошибка при загрузке товара",
        );
      }
      throw new Error("Произошла ошибка при загрузке товара");
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setCurrentFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.currentFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Проверяем структуру данных и сохраняем соответствующим образом
        if (action.payload.results) {
          state.categories = action.payload.results;
        } else {
          state.categories = action.payload;
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });

    // Brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        // Проверяем структуру данных и сохраняем соответствующим образом
        if (action.payload.results) {
          state.brands = action.payload.results;
        } else {
          state.brands = action.payload;
        }
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch brands";
      });

    // Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // Проверяем структуру данных
        if (action.payload.results) {
          state.products = action.payload.results;
          state.totalProducts = action.payload.count;
        } else {
          state.products = action.payload;
          // Если count отсутствует, используем длину массива продуктов
          state.totalProducts = action.payload.count || action.payload.length;
        }
        state.loading = false;
        state.error = null;
        // Сохраняем текущие фильтры для будущих сравнений
        if (action.meta.arg) {
          state.currentFilters = action.meta.arg;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });

    // Single Product
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      });
  },
});

export const { setCurrentPage, clearSelectedProduct, setCurrentFilters } =
  productsSlice.actions;

// Селекторы
export const selectCategories = (state: RootState) => state.products.categories;
export const selectBrands = (state: RootState) => state.products.brands;
export const selectProducts = (state: RootState) => state.products.products;
export const selectSelectedProduct = (state: RootState) =>
  state.products.selectedProduct;
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;
export const selectTotalProducts = (state: RootState) =>
  state.products.totalProducts;
export const selectCurrentPage = (state: RootState) =>
  state.products.currentPage;

export default productsSlice.reducer;

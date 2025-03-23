import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category, Product, ProductFilters, Brand } from '@/types/api';
import { getCategories, getProducts, getProduct, getBrands } from '@/lib/api';
import { RootState } from '../store';

interface ProductsState {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalProducts: number;
  currentPage: number;
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
};

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await getCategories();
    return response.results;
  }
);

export const fetchBrands = createAsyncThunk(
  'products/fetchBrands',
  async () => {
    const response = await getBrands();
    return response.results;
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters) => {
    const response = await getProducts(filters);
    return {
      products: response.results,
      total: response.count,
    };
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string) => {
    const response = await getProduct(id);
    return response;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
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
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    // Brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brands';
      });

    // Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
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
        state.error = action.error.message || 'Failed to fetch product';
      });
  },
});

export const { setCurrentPage, clearSelectedProduct } = productsSlice.actions;

// Селекторы
export const selectCategories = (state: RootState) => state.products.categories;
export const selectBrands = (state: RootState) => state.products.brands;
export const selectProducts = (state: RootState) => state.products.products;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;
export const selectTotalProducts = (state: RootState) => state.products.totalProducts;
export const selectCurrentPage = (state: RootState) => state.products.currentPage;

export default productsSlice.reducer; 
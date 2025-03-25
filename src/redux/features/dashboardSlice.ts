import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { adminAPI } from "@/services/api";
import axios from "axios";

interface TopProduct {
  id: number;
  name: string;
  total_sales: number;
  revenue: number;
}

interface CategoryRevenue {
  category: string;
  revenue: number;
}

interface OrderStatus {
  [key: string]: number;
}

export interface DashboardData {
  total_revenue?: number;
  total_orders?: number;
  products_sold?: number;
  average_order_value?: number;
  top_products: TopProduct[];
  revenue_by_category: CategoryRevenue[];
  orders_by_status?: OrderStatus;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return rejectWithValue("Не авторизован");
      }

      return await adminAPI.getDashboard();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return rejectWithValue("Необходима авторизация");
        }
        if (error.response?.status === 403) {
          return rejectWithValue("Нет прав администратора");
        }
        if (error.response?.status === 500) {
          return rejectWithValue("Ошибка сервера");
        }
        if (error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        }
      }
      return rejectWithValue("Не удалось загрузить данные дашборда");
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Произошла ошибка";
        state.data = null;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;

export const selectDashboardData = (state: RootState) => state.dashboard.data;
export const selectDashboardLoading = (state: RootState) =>
  state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;

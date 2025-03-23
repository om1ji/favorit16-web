"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchDashboardData,
  selectDashboardData,
  selectDashboardLoading,
  selectDashboardError,
  type DashboardData,
} from "@/redux/features/dashboardSlice";
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import "./dashboard.scss";

const statsCards = [
  {
    title: "Общая выручка",
    icon: CurrencyDollarIcon,
    value: (data: DashboardData) =>
      `${(data.total_revenue || 0).toLocaleString("ru-RU")} ₽`,
    color: "bg-green-500",
  },
  {
    title: "Всего заказов",
    icon: ShoppingCartIcon,
    value: (data: DashboardData) =>
      (data.total_orders || 0).toLocaleString("ru-RU"),
    color: "bg-blue-500",
  },
  {
    title: "Продано товаров",
    icon: CubeIcon,
    value: (data: DashboardData) =>
      (data.products_sold || 0).toLocaleString("ru-RU"),
    color: "bg-purple-500",
  },
  {
    title: "Средний чек",
    icon: CurrencyDollarIcon,
    value: (data: DashboardData) =>
      `${(data.average_order_value || 0).toLocaleString("ru-RU")} ₽`,
    color: "bg-yellow-500",
  },
];

const AdminDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const dashboardData = useSelector(selectDashboardData);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <ExclamationCircleIcon className="w-12 h-12 text-red-500" />
          <h2>Ошибка загрузки данных</h2>
          <p>{error}</p>
          <button
            onClick={() => dispatch(fetchDashboardData())}
            className="retry-button"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Панель управления</h1>

      <div className="stats-grid">
        {statsCards.map(({ title, icon: Icon, value, color }) => (
          <div key={title} className="stats-card">
            <div className={`icon-wrapper ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="stats-content">
              <h3>{title}</h3>
              <p className="stats-value">{value(dashboardData)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="admin-card">
          <h2 className="admin-subtitle">Популярные товары</h2>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Продажи</th>
                  <th>Выручка</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.top_products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      {(product.total_sales || 0).toLocaleString("ru-RU")}
                    </td>
                    <td>{(product.revenue || 0).toLocaleString("ru-RU")} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-subtitle">Продажи по категориям</h2>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Категория</th>
                  <th>Выручка</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.revenue_by_category.map((item) => (
                  <tr key={item.category}>
                    <td>{item.category}</td>
                    <td>{(item.revenue || 0).toLocaleString("ru-RU")} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-subtitle">Статусы заказов</h2>
          <div className="orders-status">
            {Object.entries(dashboardData.orders_by_status || {}).map(
              ([status, count]) => (
                <div key={status} className="status-item">
                  <span className="status-label">{getStatusLabel(status)}</span>
                  <span className="status-count">
                    {(count || 0).toLocaleString("ru-RU")}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Функция для перевода статусов заказов
const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Ожидает",
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён",
  };
  return statusMap[status] || status;
};

export default AdminDashboard;

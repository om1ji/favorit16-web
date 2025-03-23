"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ordersAPI } from "@/services/api";
import "./OrderList.scss";

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getOrders();
        setOrders(data.results);
      } catch (err) {
        setError("Не удалось загрузить заказы");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "Ожидает оплаты", className: "pending" },
      processing: { label: "В обработке", className: "processing" },
      shipped: { label: "Отправлен", className: "shipped" },
      delivered: { label: "Доставлен", className: "delivered" },
      cancelled: { label: "Отменён", className: "cancelled" },
    };
    return statusMap[status] || { label: status, className: "default" };
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка заказов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div className="order-info">
              <span className="order-number">Заказ №{order.id}</span>
              <span className="order-date">
                {format(new Date(order.created_at), "d MMMM yyyy", {
                  locale: ru,
                })}
              </span>
            </div>
            <div className="order-status">
              <span
                className={`status-badge ${getStatusLabel(order.status).className}`}
              >
                {getStatusLabel(order.status).label}
              </span>
            </div>
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="item-info">
                  <h3>{item.product.name}</h3>
                  <p className="item-quantity">Количество: {item.quantity}</p>
                  <p className="item-price">{item.product.price} ₽</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <div className="order-total">
              <span>Итого:</span>
              <span className="total-amount">{order.total} ₽</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;

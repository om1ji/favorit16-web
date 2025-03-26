"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import ProfileSidebar from "../components/ProfileSidebar";
import OrderList from "./components/OrderList";
import "./orders.scss";

const OrdersPage = () => {
  return (
    <ProtectedRoute>
      <div className="profile-page">
        <div className="container">
          <h1 className="profile-title">Мои заказы</h1>

          <div className="profile-content">
            <ProfileSidebar />
            <div className="profile-main">
              <OrderList />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrdersPage;

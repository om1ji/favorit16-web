"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import ProfileSidebar from "../components/ProfileSidebar";
import OrderList from "./components/OrderList";
import "./orders.scss";

const OrdersPage = () => {
  const user = useSelector(selectUser);

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

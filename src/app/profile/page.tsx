"use client";

import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileInfo from "./components/ProfileInfo";
import "./profile.scss";

const ProfilePage = () => {
  const user = useSelector(selectUser);

  return (
    <ProtectedRoute>
      <div className="profile-page">
        <div className="container">
          <h1 className="profile-title">Личный кабинет</h1>

          <div className="profile-content">
            <ProfileSidebar />
            <div className="profile-main">
              <ProfileInfo user={user} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;

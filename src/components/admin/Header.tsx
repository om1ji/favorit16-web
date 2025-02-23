'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, logout } from '@/redux/features/authSlice';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import './Header.scss';

const AdminHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-search">
          <input
            type="text"
            placeholder="Поиск..."
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <button className="action-btn">
            <BellIcon className="w-6 h-6" />
          </button>

          <div className="profile-menu">
            <button
              className="profile-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <UserCircleIcon className="w-6 h-6" />
              <span>{user?.name}</span>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
                <div className="dropdown-items">
                  <button onClick={handleLogout}>
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/features/authSlice';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import './ProfileSidebar.scss';

const menuItems = [
  { path: '/profile', icon: UserIcon, label: 'Личные данные' },
  { path: '/profile/orders', icon: ShoppingBagIcon, label: 'Мои заказы' },
  { path: '/profile/favorites', icon: HeartIcon, label: 'Избранное' },
  { path: '/profile/settings', icon: Cog6ToothIcon, label: 'Настройки' },
];

const ProfileSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="profile-sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            href={path}
            className={`nav-item ${pathname === path ? 'active' : ''}`}
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </Link>
        ))}
        
        <button className="nav-item logout" onClick={handleLogout}>
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          <span>Выйти</span>
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar; 
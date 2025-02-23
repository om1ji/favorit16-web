'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CubeIcon,
  FolderIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import './Sidebar.scss';

const menuItems = [
  { path: '/admin', icon: HomeIcon, label: 'Дашборд' },
  { path: '/admin/products', icon: CubeIcon, label: 'Товары' },
  { path: '/admin/categories', icon: FolderIcon, label: 'Категории' },
  { path: '/admin/orders', icon: ShoppingCartIcon, label: 'Заказы' },
  { path: '/admin/analytics', icon: ChartBarIcon, label: 'Аналитика' },
  { path: '/admin/users', icon: UsersIcon, label: 'Пользователи' },
  { path: '/admin/settings', icon: Cog6ToothIcon, label: 'Настройки' },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <Link href="/admin" className="logo">
          DotStore Admin
        </Link>
      </div>

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
      </nav>
    </aside>
  );
};

export default AdminSidebar; 
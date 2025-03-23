'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated, getMe } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import './admin.scss';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    console.log('AdminLayout mount effect:', { accessToken, user });
    
    if (!accessToken) {
      console.log('No access token, redirecting to login');
      router.push('/login');
      return;
    }

    if (!user) {
      console.log('No user data, fetching user');
      dispatch(getMe());
    }
  }, [user, router, dispatch]);

  if (!user) {
    console.log('Loading state: waiting for user data');
    return <div className="loading">Загрузка...</div>;
  }

  console.log('Full user data:', user);

  if (typeof user.is_staff === 'undefined') {
    console.log('Warning: is_staff is undefined in user data');
    return <div className="loading">Проверка прав доступа...</div>;
  }

  if (!user.is_staff) {
    console.log('User is not staff, redirecting to home');
    router.push('/');
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
} 

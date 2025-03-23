'use client';

import React, { useEffect, useState } from 'react';
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
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);

  // Начальная проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (redirectInProgress) {
          console.log('Redirect already in progress, skipping auth check');
          return;
        }

        setLoading(true);
        
        const accessToken = localStorage.getItem('access_token');
        console.log('AdminLayout init:', { 
          hasAccessToken: !!accessToken, 
          user: user ? 'exists' : 'null',
          isAuthenticated,
          isAuthorized
        });
        
        if (!accessToken) {
          console.log('No access token, redirecting to login');
          setRedirectInProgress(true);
          router.push('/login?redirect=/admin');
          return;
        }

        if (!user) {
          console.log('No user data, fetching user');
          try {
            await dispatch(getMe()).unwrap();
            console.log('User data loaded successfully');
          } catch (error) {
            console.error('Error loading user data:', error);
            setError('Ошибка загрузки данных пользователя. Возможно, ваша сессия истекла.');
            setRedirectInProgress(true);
            router.push('/login?redirect=/admin');
            return;
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Admin panel initialization error:', error);
        setError('Произошла ошибка при инициализации административной панели.');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [dispatch, router, isAuthenticated, redirectInProgress]);

  // Проверка прав доступа
  useEffect(() => {
    if (redirectInProgress) return;
    
    if (!loading && user) {
      console.log('Checking staff status:', user);
      
      if (typeof user.is_staff === 'undefined') {
        console.log('Warning: is_staff is undefined in user data');
        setIsAuthorized(null);
      } else if (!user.is_staff) {
        console.log('User is not staff, redirecting to home');
        setRedirectInProgress(true);
        router.push('/');
        setIsAuthorized(false);
      } else {
        console.log('User is staff, authorized to access admin panel');
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router, redirectInProgress]);

  // Состояния загрузки и ошибок
  if (loading) {
    return <div className="loading">Загрузка административной панели...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Проверка наличия пользователя
  if (!user) {
    return <div className="loading">Проверка авторизации...</div>;
  }

  // Проверка статуса авторизации
  if (isAuthorized === null) {
    return <div className="loading">Проверка прав доступа...</div>;
  }

  if (isAuthorized === false) {
    return <div className="loading">У вас нет прав для доступа к этой странице. Переадресация...</div>;
  }

  // Рендерим панель администратора только для авторизованных пользователей
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

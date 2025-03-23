'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { login, selectAuthError, selectAuthLoading, selectUser } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import Link from 'next/link';

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // Получаем параметр redirect из URL
  const redirectTo = searchParams.get('redirect') || '/';
  const isAdminRedirect = redirectTo.startsWith('/admin');

  // Проверяем, авторизован ли пользователь и выполняем перенаправление
  useEffect(() => {
    // Пропускаем перенаправление, если мы находимся на странице логина
    // и пользователь специально пришел сюда (предотвращаем автоматический редирект)
    const isLoginPage = pathname === '/login';
    
    // Не выполняем автоматический редирект, если мы уже на странице логина
    if (isLoginPage && !formData.email && !formData.password) {
      console.log('Staying on login page, no auto-redirect');
      return;
    }
    
    if (user) {
      // Если нужно перейти в админку, проверяем права
      if (isAdminRedirect) {
        if (user.is_staff) {
          console.log('Redirecting to admin panel:', redirectTo);
          router.push(redirectTo);
        } else {
          console.log('User is not staff, redirecting to home');
          router.push('/');
        }
      } else {
        // Для обычных пользователей
        console.log('Redirecting to:', redirectTo);
        router.push(redirectTo);
      }
    }
  }, [user, router, redirectTo, isAdminRedirect, pathname, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Login attempt with:', formData.email);
      await dispatch(login(formData)).unwrap();
      // Редирект будет выполнен в useEffect
    } catch (error) {
      // Ошибка уже обработана в slice
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войти в аккаунт
          </h2>
          {isAdminRedirect && (
            <p className="mt-2 text-center text-sm text-blue-600">
              Вход в административную панель
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/register" className="text-blue-600 hover:text-blue-500">
                Зарегистрироваться
              </Link>
            </div>
            {!isAdminRedirect && (
              <div className="text-sm">
                <Link href="/login?redirect=/admin" className="text-blue-600 hover:text-blue-500">
                  Войти как администратор
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; 
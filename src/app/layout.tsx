"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMe } from '@/redux/features/authSlice';
import { fetchCart } from '@/redux/features/cartSlice';
import { Inter } from 'next/font/google';
import RootLayout from '@/components/layout/RootLayout';
import { Providers } from './providers';
import './globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const metadata = {
  title: 'DotStore - Магазин электроники',
  description: 'Ваш надежный магазин электроники и аксессуаров',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.className}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <Providers>
          <RootLayout>
            <AppContent>{children}</AppContent>
          </RootLayout>
        </Providers>
      </body>
    </html>
  );
}

// Отдельный компонент для инициализации данных
function AppContent({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Проверяем наличие токена доступа
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Если токен есть, загружаем данные пользователя и корзины
      dispatch(getMe() as any);
      dispatch(fetchCart() as any);
    }
  }, [dispatch]);

  return <>{children}</>;
} 
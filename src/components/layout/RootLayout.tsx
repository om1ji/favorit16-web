'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const pathname = usePathname();
  const [showCategoriesNav, setShowCategoriesNav] = useState(true);
  
  // Определяем, на каких страницах показывать навбар категорий
  // для корректного отступа контента
  useEffect(() => {
    const pagesToShowNav = ['/', '/catalog', '/product'];
    const shouldShow = pagesToShowNav.some(page => 
      pathname === page || pathname.startsWith(`${page}/`) || pathname.includes('catalog?')
    );
    setShowCategoriesNav(shouldShow);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-grow ${showCategoriesNav ? 'md:pt-[120px] pt-24' : 'pt-24'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout; 
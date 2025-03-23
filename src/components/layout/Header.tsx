'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useSiteInfo } from '@/hooks/useConfig';
import Navigation from './Navigation';
import SocialLinks from './SocialLinks';
import ContactInfo from './ContactInfo';
import { selectUser } from '@/redux/features/authSlice';
import CategoriesNav from './CategoriesNav';
import { usePathname } from 'next/navigation';
import { selectCategories, fetchCategories, selectLoading } from '@/redux/features/productsSlice';
import { AppDispatch } from '@/redux/store';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: siteInfo } = useSiteInfo();
  const user = useSelector(selectUser);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectLoading);
  
  // Определяем, на каких страницах показывать навбар категорий
  const [showCategoriesNav, setShowCategoriesNav] = useState(true);
  
  useEffect(() => {
    const pagesToShowNav = ['/', '/catalog', '/product'];
    const shouldShow = pagesToShowNav.some(page => 
      pathname === page || pathname.startsWith(`${page}/`) || pathname.includes('catalog?')
    );
    setShowCategoriesNav(shouldShow);
  }, [pathname]);

  // Загружаем категории при монтировании
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Анимация для мобильного меню
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // Определяем URL для админ-ссылки
  const adminUrl = user?.is_staff ? '/admin' : '/login?redirect=/admin';

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'
        }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-bold text-2xl text-gray-900">
                {siteInfo?.siteName || 'DotStore'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <Navigation type="main" className="flex space-x-8" />
              
              <div className="ml-8 flex items-center space-x-4">
                <SocialLinks />
                <Link
                  href={adminUrl}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <UserIcon className="h-5 w-5 mr-1" />
                  <span>Админ</span>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-900 focus:outline-none"
                onClick={toggleMenu}
                aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 border-t border-b border-gray-200">
                <Navigation type="main" className="flex flex-col space-y-3" vertical />
                
                {/* Мобильные категории */}
                {showCategoriesNav && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Категории</h3>
                    <div className="mt-3 flex flex-col space-y-2">
                      <Link 
                        href="/catalog"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Все категории
                      </Link>
                      {categories.map(category => (
                        <Link 
                          key={category.id}
                          href={`/catalog?category=${category.id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Контакты</h3>
                  <ContactInfo variant="compact" className="mt-3" />
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Мы в соцсетях</h3>
                  <SocialLinks className="mt-3 flex space-x-4" />
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href={adminUrl}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    <span>Войти в админ-панель</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Навигационная панель категорий - только для десктопа */}
      {showCategoriesNav && (
        <div className="w-full fixed top-[72px] z-40 hidden md:block">
          <CategoriesNav />
        </div>
      )}
    </>
  );
} 
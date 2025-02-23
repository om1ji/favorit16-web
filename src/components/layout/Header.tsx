'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ShoppingBagIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  MapPinIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { AppDispatch } from '@/redux/store';
import { selectIsAuthenticated, selectUser, logout } from '@/redux/features/authSlice';
import { selectCategories } from '@/redux/features/productsSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const categories = useSelector(selectCategories);

  const handleLogout = async () => {
    await dispatch(logout());
    setIsProfileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary shadow-md z-50">
      {/* Top Level */}
      <div className="border-b border-primary-lighter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-white">
                DotStore
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-primary-lighter text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="p-2 text-white hover:text-primary-lighter relative">
                <ShoppingBagIcon className="h-6 w-6" />
                {/* Add cart items count badge here if needed */}
              </Link>

              {/* Auth buttons or profile menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-white hover:text-primary-lighter"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden md:block">{user?.first_name}</span>
                  </button>

                  {/* Profile dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-secondary"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Профиль
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-secondary"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Заказы
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-secondary"
                        >
                          Выйти
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-white hover:text-primary-lighter"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/register"
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90"
                  >
                    Регистрация
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-white hover:text-primary-lighter"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Level - Categories and Additional Links */}
      <div className="bg-primary-darker">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between h-12">
            {/* Categories */}
            <nav className="flex space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="text-white hover:text-primary-lighter text-sm font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Additional Links */}
            <div className="flex items-center space-x-6">
              <Link href="/about" className="flex items-center text-white hover:text-primary-lighter text-sm">
                <InformationCircleIcon className="h-5 w-5 mr-1" />
                <span>О компании</span>
              </Link>
              <Link href="/contacts" className="flex items-center text-white hover:text-primary-lighter text-sm">
                <PhoneIcon className="h-5 w-5 mr-1" />
                <span>Контакты</span>
              </Link>
              <Link href="/address" className="flex items-center text-white hover:text-primary-lighter text-sm">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span>Адрес</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-darker">
          {/* Mobile Search */}
          <div className="p-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-primary-lighter text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Categories */}
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="block px-3 py-2 rounded-md text-white hover:text-primary-lighter hover:bg-primary"
              >
                {category.name}
              </Link>
            ))}

            {/* Additional Links */}
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-white hover:text-primary-lighter hover:bg-primary"
            >
              О компании
            </Link>
            <Link
              href="/contacts"
              className="block px-3 py-2 rounded-md text-white hover:text-primary-lighter hover:bg-primary"
            >
              Контакты
            </Link>
            <Link
              href="/address"
              className="block px-3 py-2 rounded-md text-white hover:text-primary-lighter hover:bg-primary"
            >
              Адрес
            </Link>

            {/* Mobile Auth Links */}
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-white hover:text-primary-lighter hover:bg-primary"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-white hover:text-primary-lighter hover:bg-primary"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 
'use client';

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-primary">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl text-text-lighter font-bold mb-4">DotStore</h3>
            <p className="text-text-lighter">
              Ваш надежный магазин электроники и аксессуаров
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg text-text-lighter font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-text-lighter hover:text-white">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-lighter hover:text-white">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-text-lighter hover:text-white">
                  Доставка
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg text-text-lighter font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-text-lighter">
              <li>Телефон: +7 (987) 189-07-52</li>
              <li>Email: info@favorit-16.ru</li>
              {/* <li>Адрес: г. Казань, ул. Примерная, 123</li> */}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg text-text-lighter font-semibold mb-4">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-lighter hover:text-white"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-lighter hover:text-white"
              >
                <FaTelegram className="h-6 w-6" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-lighter hover:text-white"
              >
                <FaWhatsapp className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-darker mt-8 pt-8 text-center text-text-lighter">
          <p>&copy; {new Date().getFullYear()} DotStore. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
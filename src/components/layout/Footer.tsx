"use client";

import React from "react";
import Link from "next/link";
import { useSiteInfo } from "@/hooks/useConfig";
import Navigation from "./Navigation";
import SocialLinks from "./SocialLinks";
import ContactInfo from "./ContactInfo";

export default function Footer() {
  const { data: siteInfo } = useSiteInfo();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and about */}
          <div>
            <Link href="/" className="flex items-center">
              <span className="font-bold text-2xl text-white mb-4">
                {siteInfo?.siteName}
              </span>
            </Link>
            <p className="text-gray-400 mt-4 mb-6">
              {siteInfo?.siteDescription}
            </p>
            <div className="mb-6">
              <SocialLinks className="flex space-x-3" />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Навигация</h3>
            <Navigation
              type="footer"
              className="flex flex-col space-y-2 text-gray-400"
              vertical
              showIcons={false}
            />
          </div>

          {/* Column 3: Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Контакты</h3>
            <ContactInfo variant="footer" />
          </div>

          {/* Column 4: Newsletter (optional) */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Подписка на новости
            </h3>
            <p className="text-gray-400 mb-4">
              Подпишитесь на нашу рассылку, чтобы получать информацию о новинках
              и акциях
            </p>
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Ваш email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0 sm:mr-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>
            © {currentYear} {siteInfo?.siteName}. Все права
            защищены.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

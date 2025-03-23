"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { authAPI } from "@/services/api";
import "./Header.scss";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Реализация поиска по админке - перенаправление на страницу поиска
      // или вызов метода API в зависимости от требований
      console.log("Поиск по запросу:", searchQuery);
    }
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        <form className="header-search" onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <MagnifyingGlassIcon className="icon" />
            </button>
          </div>
        </form>

        <div className="header-actions">
          <button className="action-button">
            <BellIcon className="icon" />
          </button>

          <div className="user-dropdown">
            <button className="user-button">
              <UserCircleIcon className="icon" />
              <span className="user-name">Администратор</span>
            </button>

            <div className="dropdown-menu">
              <Link href="/admin/profile" className="dropdown-item">
                Профиль
              </Link>
              <Link href="/admin/settings" className="dropdown-item">
                Настройки
              </Link>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <ArrowRightOnRectangleIcon className="icon" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

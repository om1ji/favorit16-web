"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import "./Sidebar.scss";

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true;
    }

    if (path !== "/admin" && pathname.startsWith(path)) {
      return true;
    }

    return false;
  };

  const menuItems = [
    {
      path: "/admin",
      label: "Панель управления",
      icon: <HomeIcon className="icon" />,
    },
    {
      path: "/admin/products",
      label: "Товары",
      icon: <CubeIcon className="icon" />,
    },
    {
      path: "/admin/categories",
      label: "Категории",
      icon: <TagIcon className="icon" />,
    }
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          {!collapsed && <span className="logo-text">Favorit116 Admin</span>}
        </div>
        <button
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ArrowLeftCircleIcon
            className={`icon ${collapsed ? "rotate" : ""}`}
          />
        </button>
      </div>

      <nav className="sidebar-navigation">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                {item.icon}
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-info">
            <span className="user-name">Административная панель</span>
            <Link href="/" className="go-to-site">
              На сайт
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

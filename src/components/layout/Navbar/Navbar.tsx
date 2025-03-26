"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchCategories,
  selectCategories,
} from "@/redux/features/productsSlice";
import { Category } from "@/types/product";
import "./Navbar.scss";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [overflowCategories, setOverflowCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const calculateVisibleCategories = () => {
      if (!navRef.current) return;

      const navWidth = navRef.current.offsetWidth;
      const itemWidth = 120; // Примерная ширина одного пункта меню
      const maxVisibleItems = Math.floor((navWidth - 100) / itemWidth); // Вычитаем место для кнопки меню

      setVisibleCategories(categories.slice(0, maxVisibleItems));
      setOverflowCategories(categories.slice(maxVisibleItems));
    };

    calculateVisibleCategories();
    window.addEventListener("resize", calculateVisibleCategories);

    return () => {
      window.removeEventListener("resize", calculateVisibleCategories);
    };
  }, [categories]);

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="logo">
          Favorit116
        </Link>

        <div className="nav-categories" ref={navRef}>
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="nav-link"
            >
              {category.name}
            </Link>
          ))}

          {overflowCategories.length > 0 && (
            <div className="overflow-menu">
              <button
                className="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                Ещё...
              </button>
              {isMenuOpen && (
                <div className="dropdown-menu">
                  {overflowCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.id}`}
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="nav-actions">
          <Link href="/profile" className="nav-link">
            Профиль
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

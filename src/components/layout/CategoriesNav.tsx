"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchCategories,
  selectCategories,
  selectLoading,
} from "@/redux/features/productsSlice";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import useCategoryBrands from "@/hooks/useCategoryBrands";
import Image from "next/image";
import "./CategoriesNav.scss";

const CategoriesNav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showBrands, setShowBrands] = useState(false);

  const { brands: categoryBrands, loading: brandsLoading } = useCategoryBrands(
    activeCategory || undefined,
  );

  let currentCategorySlug: string | null = null;

  const catalogCategoryMatch = pathname.match(/^\/catalog\/([^\/\?]+)$/);
  if (catalogCategoryMatch) {
    currentCategorySlug = catalogCategoryMatch[1];
  }

  useEffect(() => {
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, loading]);

  const handleCategoryHover = (categoryId: string | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setActiveCategory(categoryId);
      setShowBrands(!!categoryId);
    }, 300);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div className="categories-nav">
        <div className="categories-list">
          {loading ? (
            <div className="loading-categories">Загрузка категорий...</div>
          ) : (
            <>
              <div
                className={`category-item ${!currentCategorySlug ? "active" : ""}`}
                onMouseEnter={() => handleCategoryHover(null)}
              >
                <Link href="/catalog" className="category-link">
                  Каталог
                </Link>
              </div>

              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-item ${currentCategorySlug === category.slug ? "active" : ""}`}
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={() => setShowBrands(false)}
                >
                  <Link
                    href={`/catalog/${category.slug}`}
                    className="category-link"
                  >
                    {category.name}
                  </Link>

                  {/* Выпадающий список брендов */}
                  {showBrands && activeCategory === category.id && (
                    <div className="brands-dropdown">
                      <h4>Бренды в категории {category.name}</h4>
                      <div className="brands-list">
                        {brandsLoading ? (
                          <div className="loading-brands">
                            Загрузка брендов...
                          </div>
                        ) : categoryBrands.length > 0 ? (
                          categoryBrands.map((brand) => (
                            <Link
                              key={brand.id}
                              href={`/catalog/${category.slug}?brand=${brand.id}`}
                              className="brand-link"
                            >
                              {brand.logo ? (
                                <span className="brand-logo">
                                  <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    width={20}
                                    height={20}
                                  />
                                </span>
                              ) : null}
                              <span>{brand.name}</span>
                              <span className="product-count">
                                ({brand.productCount})
                              </span>
                            </Link>
                          ))
                        ) : (
                          <div className="no-brands">Нет доступных брендов</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };
};

export default CategoriesNav;

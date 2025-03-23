'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchCategories, selectCategories, selectLoading } from '@/redux/features/productsSlice';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import useCategoryBrands from '@/hooks/useCategoryBrands';
import Image from 'next/image';
import './CategoriesNav.scss';

const CategoriesNav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Состояние для отслеживания активной категории при наведении
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Получаем бренды для активной категории
  const { brands: categoryBrands, loading: brandsLoading } = useCategoryBrands(
    activeCategory || undefined
  );
  
  // Текущая категория из URL (если есть)
  const currentCategoryId = searchParams.get('category');
  
  // Загружаем категории при монтировании компонента
  useEffect(() => {
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, loading]);
  
  return (
    <div className="categories-nav">
      <div className="container">
        <div className="categories-list">
          {loading ? (
            <div className="loading-categories">Загрузка категорий...</div>
          ) : (
            <>
              <div 
                className={`category-item ${!currentCategoryId ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory(null)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link 
                  href="/catalog"
                  className="category-link"
                >
                  Все категории
                </Link>
              </div>
              
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`category-item ${currentCategoryId === category.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link 
                    href={`/catalog?category=${category.id}`}
                    className="category-link"
                  >
                    {category.name}
                  </Link>
                  
                  {/* Выпадающий список брендов */}
                  {activeCategory === category.id && (
                    <div className="brands-dropdown">
                      <h4>Бренды в категории {category.name}</h4>
                      <div className="brands-list">
                        {brandsLoading ? (
                          <div className="loading-brands">Загрузка брендов...</div>
                        ) : categoryBrands.length > 0 ? (
                          categoryBrands.map(brand => (
                            <Link
                              key={brand.id}
                              href={`/catalog?category=${category.id}&brand=${brand.id}`}
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
                              <span className="product-count">({brand.productCount})</span>
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
    </div>
  );
};

export default CategoriesNav; 
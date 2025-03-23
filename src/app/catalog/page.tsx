"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchProducts,
  fetchCategories,
  selectProducts,
  selectCategories,
  selectLoading,
  selectError,
  selectTotalProducts,
  selectCurrentPage,
  setCurrentPage
} from '@/redux/features/productsSlice';
import { Product, ProductFilters } from '@/types/api';
import Link from 'next/link';
import TireFilters from '@/components/filters/TireFilters';
import './catalog.scss';
import { useSearchParams, useRouter } from 'next/navigation';

const CatalogPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totalCount = useSelector(selectTotalProducts);
  const currentPage = useSelector(selectCurrentPage);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});
  
  // Получаем параметры URL
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Локальное состояние загрузки для компонентов
  const [isContentLoading, setIsContentLoading] = useState(true);
  
  // Refs для отслеживания состояния запросов
  const fetchingProducts = useRef(false);
  const fetchingCategories = useRef(false);
  const filtersChanged = useRef(false);
  const prevActiveFilters = useRef<ProductFilters>({});
  const prevPage = useRef<number>(1);

  // Используем useRef для хранения предыдущих фильтров и проверки на изменения
  const prevTireFilters = useRef<any>({});
  
  // Инициализируем фильтры из URL-параметров
  useEffect(() => {
    const categoryId = searchParams.get('category');
    const brandId = searchParams.get('brand');
    const page = searchParams.get('page');
    const ordering = searchParams.get('ordering');
    
    const newFilters: ProductFilters = {};
    if (categoryId) newFilters.category = categoryId;
    if (brandId) newFilters.brand = brandId;
    if (ordering) newFilters.ordering = ordering;
    
    setActiveFilters(newFilters);
    if (page) dispatch(setCurrentPage(Number(page)));
    
    filtersChanged.current = true;
  }, [searchParams, dispatch]);

  // Загружаем категории только один раз при монтировании и если их еще нет
  useEffect(() => {
    if (categories.length === 0 && !fetchingCategories.current && !loading) {
      console.log('Fetching categories');
      fetchingCategories.current = true;
      setIsContentLoading(true);
      dispatch(fetchCategories())
        .finally(() => {
          fetchingCategories.current = false;
        });
    }
  }, [dispatch, categories.length, loading]);

  // Загружаем продукты только при изменении фильтров или страницы
  useEffect(() => {
    if (fetchingProducts.current) return;
    
    // Проверяем, действительно ли изменились фильтры или страница
    const filtersHaveChanged = JSON.stringify(prevActiveFilters.current) !== JSON.stringify(activeFilters);
    const pageHasChanged = prevPage.current !== currentPage;
    
    // Проверяем, изменились ли фильтры или страница
    if (filtersChanged.current || filtersHaveChanged || pageHasChanged || fetchingProducts.current === false) {
      console.log('Fetching products with filters:', { ...activeFilters, page: currentPage });
      fetchingProducts.current = true;
      setIsContentLoading(true);
      filtersChanged.current = false;
      
      // Сохраняем текущие значения для будущих сравнений
      prevActiveFilters.current = { ...activeFilters };
      prevPage.current = currentPage;
      
      dispatch(fetchProducts({
        ...activeFilters,
        page: currentPage,
      }))
        .finally(() => {
          fetchingProducts.current = false;
          setIsContentLoading(false);
        });
    } else {
      setIsContentLoading(false);
    }
  }, [dispatch, currentPage, activeFilters]);

  // Обновляем URL при изменении фильтров
  const updateURL = (filters: ProductFilters, page: number) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    else params.delete('category');
    
    if (filters.brand) params.set('brand', filters.brand);
    else params.delete('brand');
    
    if (filters.ordering) params.set('ordering', filters.ordering);
    else params.delete('ordering');
    
    if (page > 1) params.set('page', page.toString());
    else params.delete('page');
    
    router.push(`/catalog?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { 
      ...activeFilters, 
      category: categoryId || undefined
    };
    setActiveFilters(newFilters);
    filtersChanged.current = true;
    dispatch(setCurrentPage(1));
    updateURL(newFilters, 1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { 
      ...activeFilters, 
      ordering: e.target.value || undefined
    };
    setActiveFilters(newFilters);
    filtersChanged.current = true;
    dispatch(setCurrentPage(1));
    updateURL(newFilters, 1);
  };

  const handleTireFiltersChange = (tireFilters: any) => {
    // Проверяем, изменились ли фильтры шин
    const tireFiltersChanged = 
      tireFilters.width !== prevTireFilters.current.width ||
      tireFilters.profile !== prevTireFilters.current.profile ||
      tireFilters.diameter !== prevTireFilters.current.diameter ||
      tireFilters.brand !== prevTireFilters.current.brand;
    
    if (tireFiltersChanged) {
      console.log('Tire filters changed:', tireFilters);
      prevTireFilters.current = { ...tireFilters };
      
      const newFilters = { ...activeFilters, ...tireFilters };
      setActiveFilters(newFilters);
      filtersChanged.current = true;
      dispatch(setCurrentPage(1));
      updateURL(newFilters, 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      filtersChanged.current = true;
      dispatch(setCurrentPage(page));
      updateURL(activeFilters, page);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="catalog-page">
      <div className="container">
        <h1>Каталог товаров</h1>
        
        <div className="catalog-layout">
          <div className="catalog-sidebar">
            <TireFilters onFilterChange={handleTireFiltersChange} />
          </div>
          
          <div className="catalog-content">
            {isContentLoading ? (
              <div className="loading">Загрузка товаров...</div>
            ) : (
              <>
                <div className="catalog-filters">
                  <div className="categories">
                    <button 
                      className={`filter-button ${!activeFilters.category ? 'active' : ''}`}
                      onClick={() => handleCategoryChange('')}
                    >
                      Все категории
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`filter-button ${activeFilters.category === category.id ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  <div className="sorting">
                    <select 
                      className="sort-select"
                      onChange={handleSortChange}
                      value={activeFilters.ordering || ''}
                    >
                      <option value="">По умолчанию</option>
                      <option value="price">По возрастанию цены</option>
                      <option value="-price">По убыванию цены</option>
                      <option value="name">По названию (А-Я)</option>
                      <option value="-name">По названию (Я-А)</option>
                    </select>
                  </div>
                </div>

                <div className="products-grid">
                  {products.length === 0 ? (
                    <div className="no-products">
                      <p>Товары не найдены. Попробуйте изменить параметры фильтрации.</p>
                    </div>
                  ) : products.map((product: Product) => (
                    <Link 
                      href={`/product/${product.id}`} 
                      key={product.id}
                      className="product-card-link"
                    >
                      <div className="product-card">
                        <div className="product-image">
                          {product.feature_image ? (
                            <img 
                              src={product.feature_image.image}
                              alt={product.feature_image.alt_text || product.name} 
                            />
                          ) : product.images?.length > 0 ? (
                            <img 
                              src={product.images[0].image}
                              alt={product.images[0].alt_text || product.name} 
                            />
                          ) : null}
                        </div>
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <div className="product-details">
                            <div className="product-category">{product.category.name}</div>
                            {product.tire_size && (
                              <div className="product-tire-size">{product.tire_size}</div>
                            )}
                            {product.brand && (
                              <div className="product-brand">{product.brand.name}</div>
                            )}
                          </div>
                          <div className="product-price">
                            {product.old_price && (
                              <span className="old-price">{product.old_price} ₽</span>
                            )}
                            <span className="current-price">{product.price} ₽</span>
                          </div>
                          {!product.in_stock ? (
                            <div className="out-of-stock">Нет в наличии</div>
                          ) : (
                            <button 
                              className="add-to-cart"
                              onClick={(e) => {
                                e.preventDefault();
                                // TODO: Add to cart functionality
                              }}
                            >
                              Купить
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalCount > 10 && (
                  <div className="pagination">
                    {Array.from({ length: Math.ceil(totalCount / 10) }, (_, i) => (
                      <button
                        key={i + 1}
                        className={currentPage === i + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage; 
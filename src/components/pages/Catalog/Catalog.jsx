"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchProducts,
  fetchCategories,
  selectProducts,
  selectCategories,
  selectProductsLoading,
  selectProductsError,
  selectProductsTotalCount,
  selectProductsFilters,
  setFilters
} from '@/redux/features/productsSlice';
import Link from 'next/link';
import './Catalog.scss';

const Catalog = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const totalCount = useSelector(selectProductsTotalCount);
  const filters = useSelector(selectProductsFilters);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleCategoryChange = (categoryId) => {
    dispatch(setFilters({ category: categoryId, page: 1 }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ ordering: e.target.value, page: 1 }));
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="catalog-page">
      <div className="container">
        <h1>Каталог товаров</h1>
        
        <div className="catalog-content">
          <aside className="catalog-filters">
            <div className="filter-section">
              <h3>Категории</h3>
              <ul>
                <li>
                  <button 
                    className={!filters.category ? 'active' : ''} 
                    onClick={() => handleCategoryChange('')}
                  >
                    Все категории
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      className={filters.category === category.id ? 'active' : ''}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter-section">
              <h3>Сортировка</h3>
              <select 
                value={filters.ordering || ''} 
                onChange={handleSortChange}
              >
                <option value="">По умолчанию</option>
                <option value="price">По возрастанию цены</option>
                <option value="-price">По убыванию цены</option>
                <option value="name">По названию (А-Я)</option>
                <option value="-name">По названию (Я-А)</option>
              </select>
            </div>
          </aside>

          <div className="catalog-products">
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <Link href={`/product/${product.id}`} className="product-image">
                    {product.feature_image && (
                      <img 
                        src={product.feature_image.image}
                        alt={product.feature_image.alt_text || product.name}
                      />
                    )}
                    {product.has_discount && (
                      <span className="discount-badge">−{product.discount_percentage}%</span>
                    )}
                  </Link>
                  <div className="product-info">
                    <Link href={`/product/${product.id}`} className="product-title">
                      {product.name}
                    </Link>
                    <div className="product-price">
                      <span className="current-price">{product.price} ₽</span>
                      {product.old_price && (
                        <span className="old-price">{product.old_price} ₽</span>
                      )}
                    </div>
                    {product.in_stock ? (
                      <button 
                        className="add-to-cart-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Add to cart functionality
                        }}
                      >
                        В корзину
                      </button>
                    ) : (
                      <div className="out-of-stock">Нет в наличии</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog; 
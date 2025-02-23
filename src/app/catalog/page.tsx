"use client";

import React, { useEffect } from 'react';
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
import { Product } from '@/types/api';
import Link from 'next/link';
import './catalog.scss';

const CatalogPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totalCount = useSelector(selectTotalProducts);
  const currentPage = useSelector(selectCurrentPage);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({
      page: currentPage,
    }));
  }, [dispatch, currentPage]);

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setCurrentPage(1));
    dispatch(fetchProducts({
      category: categoryId,
      page: 1,
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentPage(1));
    dispatch(fetchProducts({
      ordering: e.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
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
        
        <div className="catalog-filters">
          <div className="categories">
            <button 
              className="filter-button"
              onClick={() => handleCategoryChange('')}
            >
              Все категории
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className="filter-button"
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
          {products.map((product: Product) => (
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
                  <div className="product-category">{product.category.name}</div>
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
                      В корзину
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
      </div>
    </div>
  );
};

export default CatalogPage; 
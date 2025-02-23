'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '@/services/api';
import './products.scss';
import axios from 'axios';
import { AdminProduct, AdminProductsResponse } from '@/types/product';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    min_price: '',
    max_price: '',
    ordering: '-created_at'
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };

      const data = await adminAPI.getProducts(params);
      setProducts(data.results);
      setTotalPages(Math.ceil(data.count / 20));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Необходима авторизация. Пожалуйста, войдите в систему.');
        } else if (err.response?.status === 403) {
          setError('У вас нет прав для просмотра списка товаров.');
        } else if (err.response?.status === 404) {
          setError('API эндпоинт не найден. Пожалуйста, свяжитесь с администратором.');
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Не удалось загрузить товары. Попробуйте позже.');
        }
      } else {
        setError('Произошла неизвестная ошибка. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      await adminAPI.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить товар');
    }
  };

  if (loading) {
    return (
      <div className="admin-products">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-products">
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchProducts();
            }}
            className="retry-button"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="page-header">
        <h1>Управление товарами</h1>
        <Link href="/admin/products/new" className="admin-btn primary">
          <PlusIcon className="w-5 h-5" />
          <span>Добавить товар</span>
        </Link>
      </div>

      <div className="filters-section">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <button type="submit">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </form>

        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon className="w-5 h-5" />
          <span>Фильтры</span>
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Статус</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Все</option>
              <option value="in_stock">В наличии</option>
              <option value="out_of_stock">Нет в наличии</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Цена</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="От"
                value={filters.min_price}
                onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
              />
              <input
                type="number"
                placeholder="До"
                value={filters.max_price}
                onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Сортировка</label>
            <select
              value={filters.ordering}
              onChange={(e) => setFilters(prev => ({ ...prev, ordering: e.target.value }))}
            >
              <option value="-created_at">Сначала новые</option>
              <option value="created_at">Сначала старые</option>
              <option value="name">По названию (А-Я)</option>
              <option value="-name">По названию (Я-А)</option>
              <option value="price">По цене (возр.)</option>
              <option value="-price">По цене (убыв.)</option>
            </select>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Фото</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Наличие</th>
              <th>Продажи</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="product-image">
                  {product.images?.length > 0 && (
                    <img 
                      src={product.images[0].thumbnail} 
                      alt={product.images[0].alt_text}
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category.name}</td>
                <td>{product.price.toLocaleString('ru-RU')} ₽</td>
                <td>
                  <span className={`status ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </td>
                <td>
                  <div className="sales-info">
                    <span>
                      {(product.total_orders ?? 0).toLocaleString('ru-RU')} заказов
                    </span>
                    <span className="revenue">
                      {(product.total_revenue ?? 0).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </td>
                <td>
                  <div className="actions">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="admin-btn danger"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Назад
          </button>
          <span>
            Страница {page} из {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 
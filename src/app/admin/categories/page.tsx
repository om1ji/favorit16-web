"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { adminAPI } from "@/services/api";
import "../admin.scss";
import "./categories.scss";
import axios from "axios";
import { Category } from "@/types/product";

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCategories, setTotalCategories] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const fetchCategories = async (page = 1, search = searchTerm) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        page_size: PAGE_SIZE.toString(),
      };

      if (search) {
        params.search = search;
      }

      const response = await adminAPI.getCategories(params);
      setCategories(response.results);
      setTotalCategories(response.count);
      setTotalPages(Math.ceil(response.count / PAGE_SIZE));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Необходима авторизация. Пожалуйста, войдите в систему.");
        } else if (err.response?.status === 403) {
          setError("У вас нет прав для просмотра списка категорий.");
        } else {
          setError(`Произошла ошибка при загрузке категорий: ${err.message}`);
        }
      } else {
        setError("Произошла неизвестная ошибка при загрузке категорий.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories(1, searchTerm);
  };

  const handleDeleteClick = (categoryId: string) => {
    setDeleteConfirm(categoryId);
    setDeleteError(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setDeleteLoading(true);
    try {
      await adminAPI.deleteCategory(deleteConfirm);
      // Обновляем список после успешного удаления
      fetchCategories(currentPage);
      setDeleteConfirm(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setDeleteError(
            "Необходима авторизация. Пожалуйста, войдите в систему.",
          );
        } else if (err.response?.status === 403) {
          setDeleteError("У вас нет прав для удаления категорий.");
        } else if (err.response?.status === 409) {
          setDeleteError(
            "Нельзя удалить категорию. Сначала удалите все связанные продукты.",
          );
        } else {
          setDeleteError(
            `Произошла ошибка при удалении категории: ${err.message}`,
          );
        }
      } else {
        setDeleteError("Произошла неизвестная ошибка при удалении категории.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-item ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="admin-pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          &larr;
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="pagination-item"
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="pagination-item"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-arrow"
        >
          &rarr;
        </button>
      </div>
    );
  };

  return (
    <div className="admin-categories">
      <div className="admin-header">
        <h1>Управление категориями</h1>
        <Link href="/admin/categories/create" className="admin-add-button">
          <PlusIcon className="icon" />
          <span>Создать категорию</span>
        </Link>
      </div>

      <div className="admin-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Поиск категорий..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <MagnifyingGlassIcon className="icon" />
            </button>
          </div>
        </form>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Загрузка категорий...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : categories && categories.length === 0 ? (
          <div className="empty-state">
            <p>Категории не найдены</p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchCategories(1, "");
                }}
                className="reset-search"
              >
                Сбросить поиск
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="categories-list">
              <div className="category-item header">
                <div className="category-name">Название</div>
                <div className="category-parent">Родительская категория</div>
                <div className="category-id">ID</div>
                <div className="category-actions">Действия</div>
              </div>

              {categories && categories.map((category) => (
                <div key={category.id} className="category-item">
                  <div className="category-name">
                    <div className="name-content">
                      {category.image && (
                        <div className="category-image">
                          <img src={category.image} alt={category.name} />
                        </div>
                      )}
                      <span>{category.name}</span>
                    </div>
                  </div>
                  <div className="category-parent">
                    {category.parent
                      ? categories.find((c) => c.id === category.parent)
                          ?.name || "Неизвестная категория"
                      : "—"}
                  </div>
                  <div className="category-id">{category.id}</div>
                  <div className="category-actions">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="edit-button"
                    >
                      <PencilIcon className="icon" />
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      <TrashIcon className="icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </div>

      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <ExclamationTriangleIcon className="warning-icon" />
              <h2>Подтверждение удаления</h2>
              <button
                className="close-button"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
              >
                <XMarkIcon className="icon" />
              </button>
            </div>
            <div className="delete-modal-body">
              <p>Вы действительно хотите удалить категорию?</p>
              <p className="delete-warning">
                Это действие нельзя отменить. Все связанные данные будут
                удалены.
              </p>
              {deleteError && <div className="delete-error">{deleteError}</div>}
            </div>
            <div className="delete-modal-footer">
              <button
                className="cancel-button"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
              >
                Отмена
              </button>
              <button
                className="confirm-button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

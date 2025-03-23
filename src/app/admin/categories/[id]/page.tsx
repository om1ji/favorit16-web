"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Category } from "@/types/product";
import { adminAPI } from "@/services/api";
import CategoryForm from "../components/CategoryForm";
import "../categories.scss";

// Расширяем Category, чтобы включить поле children в форму, если требуется
interface FormCategory extends Omit<Category, "children"> {
  children?: string[];
}

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<FormCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        const data = await adminAPI.getCategory(categoryId);
        setCategory(data);
        setError(null);
      } catch (error) {
        console.error("Ошибка при загрузке категории:", error);
        setError(
          "Не удалось загрузить категорию. Попробуйте обновить страницу.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return (
    <div className="admin-categories">
      <div className="admin-header">
        <Link href="/admin/categories" className="back-button">
          <ChevronLeftIcon className="icon" />
          <span>Назад к категориям</span>
        </Link>
        <h1>Редактирование категории</h1>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Загрузка категории...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <Link href="/admin/categories" className="button">
              Вернуться к списку категорий
            </Link>
          </div>
        ) : category ? (
          <CategoryForm initialData={category} isEdit={true} />
        ) : (
          <div className="error-state">
            <p>Категория не найдена.</p>
            <Link href="/admin/categories" className="button">
              Вернуться к списку категорий
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

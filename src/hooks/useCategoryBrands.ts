"use client";

import { useState, useEffect, useRef } from "react";
import { Brand, Category } from "@/types/api";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { selectCategories } from "@/redux/features/productsSlice";

interface BrandInfo {
  id: string;
  name: string;
  logo: string | null;
  productCount: number;
}

// Кеш для хранения результатов предыдущих запросов
const brandsCache = new Map<string, BrandInfo[]>();

const useCategoryBrands = (categoryIdOrSlug?: string) => {
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const categories = useSelector(selectCategories);

  // Используем ref для отслеживания статуса запроса
  const isFetching = useRef(false);
  const prevCategoryId = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Если категория не изменилась, не делаем повторный запрос
    if (categoryIdOrSlug === prevCategoryId.current) {
      return;
    }

    prevCategoryId.current = categoryIdOrSlug;

    const fetchBrandsForCategory = async () => {
      if (!categoryIdOrSlug) {
        setBrands([]);
        return;
      }

      // Проверяем кеш
      if (brandsCache.has(categoryIdOrSlug)) {
        console.log(`Using cached brands for category ${categoryIdOrSlug}`);
        setBrands(brandsCache.get(categoryIdOrSlug)!);
        return;
      }

      // Если уже выполняется запрос, не начинаем новый
      if (isFetching.current) {
        return;
      }

      setLoading(true);
      setError(null);
      isFetching.current = true;

      try {
        // Используем ID категории как есть, поскольку в этот хук мы передаем ID, а не slug
        const categoryId = categoryIdOrSlug;

        console.log(`Fetching brands for category ${categoryId}`);

        // Получаем продукты для данной категории, используя id
        const response = await api.get(
          `/products/?category=${categoryId}&limit=100`,
        );

        if (response.data && response.data.results) {
          // Извлекаем все уникальные бренды из продуктов
          const brandsMap = new Map<string, BrandInfo>();

          response.data.results.forEach((product: any) => {
            if (product.brand) {
              const brandId = product.brand.id;

              if (brandsMap.has(brandId)) {
                // Увеличиваем счетчик продуктов для этого бренда
                const brandInfo = brandsMap.get(brandId)!;
                brandInfo.productCount += 1;
                brandsMap.set(brandId, brandInfo);
              } else {
                // Добавляем новый бренд
                brandsMap.set(brandId, {
                  id: brandId,
                  name: product.brand.name,
                  logo: product.brand.logo,
                  productCount: 1,
                });
              }
            }
          });

          // Преобразуем Map в массив и сортируем по количеству продуктов (в убывающем порядке)
          const brandsArray = Array.from(brandsMap.values()).sort(
            (a, b) => b.productCount - a.productCount,
          );

          // Кешируем результаты
          brandsCache.set(categoryIdOrSlug, brandsArray);

          setBrands(brandsArray);
        }
      } catch (err) {
        console.error("Error fetching brands for category:", err);
        setError("Не удалось загрузить бренды для данной категории");
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchBrandsForCategory();
  }, [categoryIdOrSlug]); // Убираем categories из зависимостей

  return { brands, loading, error };
};

export default useCategoryBrands;

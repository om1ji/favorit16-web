'use client';

import { useState, useEffect } from 'react';
import { Brand } from '@/types/api';
import api from '@/lib/api';

interface BrandInfo {
  id: string;
  name: string;
  logo: string | null;
  productCount: number;
}

const useCategoryBrands = (categoryId?: string) => {
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandsForCategory = async () => {
      if (!categoryId) {
        setBrands([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Получаем продукты для данной категории
        const response = await api.get(`/api/v1/products/?category=${categoryId}&limit=100`);
        
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
                  productCount: 1
                });
              }
            }
          });
          
          // Преобразуем Map в массив и сортируем по количеству продуктов (в убывающем порядке)
          const brandsArray = Array.from(brandsMap.values())
            .sort((a, b) => b.productCount - a.productCount);
          
          setBrands(brandsArray);
        }
      } catch (err) {
        console.error('Error fetching brands for category:', err);
        setError('Не удалось загрузить бренды для данной категории');
      } finally {
        setLoading(false);
      }
    };

    fetchBrandsForCategory();
  }, [categoryId]);

  return { brands, loading, error };
};

export default useCategoryBrands; 
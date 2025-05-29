"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/api";

interface ProductCardProps {
  product: Product;
  index: number;
  showPrice?: boolean;
  showBuyButton?: boolean;
  onBuyClick?: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  showPrice = true,
  showBuyButton = true,
  onBuyClick,
  className = ""
}) => {
  const handleBuyButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBuyClick) {
      onBuyClick();
    }
  };

  // Проверка на наличие скидки
  const hasDiscount = product.old_price && 
    parseFloat(String(product.old_price)) > parseFloat(String(product.price));

  return (
    <Link
      href={
        product.slug
          ? `/product/${product.slug}`
          : `/product/${product.id}`
      }
      className={`block h-full no-underline transition-all duration-300 ${className}`}
    >
      <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Изображение товара */}
        <div className="relative h-56 sm:h-64 w-full bg-gray-100">
          {hasDiscount && (
            <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              Скидка
            </div>
          )}
          
          {product.feature_image ? (
            <Image
              src={product.feature_image.image}
              alt={product.feature_image.alt_text || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              loading={index < 4 ? "eager" : "lazy"}
            />
          ) : product.images?.length > 0 ? (
            <Image
              src={product.images[0].image}
              alt={product.images[0].alt_text || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              loading={index < 4 ? "eager" : "lazy"}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-base">Нет изображения</span>
            </div>
          )}
        </div>
        
        {/* Информация о товаре */}
        <div className="flex flex-col flex-grow p-4 text-gray-900">
          {/* Категория */}
          <div className="text-sm text-blue-600 mb-1">
            {product.category.name}
          </div>
          
          {/* Название товара */}
          <div className="text-base sm:text-lg font-medium text-gray-900 mb-2 leading-tight min-h-[40px]">
            {product.brand?.name && <span className="font-bold">{product.brand.name}</span>} {product.name}
          </div>
          
          {/* Размер шины или диска, если есть */}
          {product.tire_size && (
            <div className="inline-block bg-blue-100 rounded-md px-2 py-1 text-xs text-blue-700 mb-2">
              Шина: {product.tire_size}
            </div>
          )}
          
          {product.wheel_size && (
            <div className="inline-block bg-green-100 rounded-md px-2 py-1 text-xs text-green-700 mb-2">
              Диск: {product.wheel_size}
            </div>
          )}
          
          {/* Цена */}
          {showPrice && (
            <div className="mt-auto pt-2 flex items-center">
              <div className="flex flex-col">
                {product.old_price && hasDiscount && (
                  <span className="line-through text-xs text-gray-500">
                    {product.old_price} ₽
                  </span>
                )}
                <span className="text-lg font-bold text-gray-900">
                  {product.price} ₽
                </span>
              </div>
            </div>
          )}
          
          {/* Кнопка купить или статус наличия */}
          {showBuyButton && (
            <div className="mt-3">
              {!product.in_stock ? (
                <div className="bg-gray-100 text-gray-500 text-center py-2 px-4 rounded text-sm font-medium">
                  Нет в наличии
                </div>
              ) : (
                <button
                  onClick={handleBuyButtonClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Купить
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 
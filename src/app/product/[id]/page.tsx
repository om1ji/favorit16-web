"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchProductById,
  fetchProducts,
  selectSelectedProduct,
  selectProducts,
  selectLoading,
  selectError,
} from "@/redux/features/productsSlice";
import Link from "next/link";
import ProductImageCarousel from "@/components/product/ProductImageCarousel";
import TestModeAlert from "@/components/ui/TestModeAlert";
import { defaultConfig } from "@/lib/config/default-config";
import "./styles.scss";
import Image from "next/image";

interface Props {
  params: Promise<{
    id: string; // Может быть как id, так и slug
  }>;
}

export default function ProductPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector(selectSelectedProduct);
  const relatedProducts = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (resolvedParams.id) {
      dispatch(fetchProductById(resolvedParams.id));
    }
  }, [dispatch, resolvedParams.id]);

  useEffect(() => {
    if (product?.category.id) {
      dispatch(
        fetchProducts({
          category: product.category.slug,
          page: 1,
        }),
      );
    }
  }, [dispatch, product?.category.id]);

  const handleBuyClick = () => {
    setShowAlert(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Ошибка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Товар не найден</h2>
          <Link
            href="/catalog"
            className="text-primary hover:text-primary-dark"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {showAlert && (
        <TestModeAlert 
          onClose={() => setShowAlert(false)} 
          phone={defaultConfig.contacts.phone} 
          telegram={defaultConfig.social.telegram.url}
        />
      )}

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          {product.images.length > 0 ? (
            <ProductImageCarousel
              images={product.images}
              productName={product.name}
            />
          ) : (
            <div className="aspect-square flex items-center justify-center rounded-lg bg-gray-100">
              <span className="text-gray-400">Нет изображения</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-text-h2">{product.name}</h1>

          <div className="flex items-baseline space-x-4">
            <span className="text-2xl font-bold text-text">
              {product.price} ₽
            </span>
            {product.old_price && (
              <span className="text-xl line-through text-gray-500">
                {product.old_price} ₽
              </span>
            )}
            {product.has_discount && (
              <span className="px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded">
                -{product.discount_percentage}%
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-block w-3 h-3 rounded-full ${product.in_stock ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              <span className="text-text">
                {product.in_stock ? "В наличии" : "Нет в наличии"}
              </span>
            </div>
            {product.in_stock && (
              <div className="text-sm text-text">
                Осталось: {product.quantity} шт.
              </div>
            )}
          </div>

          {product.in_stock && (
            <button 
              className="w-64 py-3 px-6 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
              style={{ color: "black" }}
              onClick={handleBuyClick}
            >
              Купить
            </button>
          )}

          <div className="prose prose-lg">
            <h2 className="text-xl font-semibold mb-4 text-text-h2">
              Описание
            </h2>
            <div className="text-text-subtitle whitespace-pre-wrap">
              {product.description}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-h2">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={
                    relatedProduct.slug
                      ? `/product/${relatedProduct.slug}`
                      : `/product/${relatedProduct.id}`
                  }
                  className="group"
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                    {relatedProduct.feature_image ? (
                      <Image
                        src={relatedProduct.feature_image.image}
                        alt={
                          relatedProduct.feature_image.alt_text ||
                          relatedProduct.name
                        }
                        className="object-contain w-full h-full group-hover:opacity-75 transition-opacity"
                      />
                    ) : relatedProduct.images?.[0] ? (
                      <Image
                        src={relatedProduct.images[0].image}
                        alt={
                          relatedProduct.images[0].alt_text ||
                          relatedProduct.name
                        }
                        className="object-contain w-full h-full group-hover:opacity-75 transition-opacity"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400">Нет изображения</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-text-h2 mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-text">{relatedProduct.price} ₽</p>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchProducts,
  fetchCategories,
  selectProducts,
  selectCategories,
  selectLoading,
  selectError,
  selectTotalProducts,
  selectCurrentPage,
  setCurrentPage,
} from "@/redux/features/productsSlice";
import { Product } from "@/types/api";
import Link from "next/link";
import "@/app/catalog/catalog.scss";
import Image from "next/image";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totalCount = useSelector(selectTotalProducts);
  const currentPage = useSelector(selectCurrentPage);

  const currentCategory = categories.find(
    (cat) => cat.id === resolvedParams.id,
  );

  console.log(products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        category: resolvedParams.id,
        page: currentPage,
      }),
    );
  }, [dispatch, resolvedParams.id, currentPage]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentPage(1));
    dispatch(
      fetchProducts({
        category: resolvedParams.id,
        ordering: e.target.value,
        page: 1,
      }),
    );
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
        <div className="breadcrumbs mb-4">
          <Link href="/catalog">Каталог</Link>
          <span> / </span>
          <span>{currentCategory?.name || "Категория"}</span>
        </div>

        <h1>{currentCategory?.name || "Категория"}</h1>

        <div className="catalog-filters">
          <div className="sorting">
            <select className="sort-select" onChange={handleSortChange}>
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
                    <Image
                      src={product.feature_image.image}
                      alt={product.feature_image.alt_text || product.name}
                      width={100}
                      height={100}
                    />
                  ) : product.images?.length > 0 ? (
                    <Image
                      src={product.images[0].image}
                      alt={product.images[0].alt_text || product.name}
                      width={100}
                      height={100}
                    />
                  ) : null}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-category">
                    {product.category.name}
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
                className={currentPage === i + 1 ? "active" : ""}
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
}

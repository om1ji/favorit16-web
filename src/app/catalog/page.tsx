"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { Product, ProductFilters } from "@/types/api";
import Link from "next/link";
import TireFilters from "@/components/filters/TireFilters";
import "./catalog.scss";
import { useSearchParams, useRouter } from "next/navigation";

interface CatalogPageProps {
  initialCategorySlug?: string;
}

const CatalogPage = ({ initialCategorySlug }: CatalogPageProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totalCount = useSelector(selectTotalProducts);
  const currentPage = useSelector(selectCurrentPage);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const fetchingProducts = useRef(false);
  const fetchingCategories = useRef(false);
  const filtersChanged = useRef(false);
  const prevActiveFilters = useRef<ProductFilters>({});
  const prevPage = useRef<number>(1);
  const initialFiltersSet = useRef(false);

  const prevTireFilters = useRef<any>({});


  const activeCategory = categories.find(
    (cat) => cat.slug === activeFilters.category,
  );

  useEffect(() => {
    if (initialFiltersSet.current) return;

    if (initialCategorySlug && categories.length > 0) {
      console.log(
        "Initializing filters with category slug:",
        initialCategorySlug,
      );
      const category = categories.find(
        (cat) => cat.slug === initialCategorySlug,
      );
      if (category) {
        setActiveFilters((prev) => ({
          ...prev,
          category: initialCategorySlug,
        }));

        initialFiltersSet.current = true;
        filtersChanged.current = true;

        if (!fetchingProducts.current) {
          console.log(
            "Initial fetch for products with category:",
            initialCategorySlug,
          );
          fetchingProducts.current = true;

          const apiParams: any = {
            category: initialCategorySlug,
            page: currentPage,
            page_size: 10,
          };

          dispatch(fetchProducts(apiParams)).finally(() => {
            fetchingProducts.current = false;
          });
        }
      }
    } else {
      initialFiltersSet.current = true;
    }
  }, [categories.length, initialCategorySlug, dispatch, currentPage]);

  useEffect(() => {
    if (categories.length === 0 && !fetchingCategories.current && !loading) {
      console.log("Fetching categories");
      fetchingCategories.current = true;
      dispatch(fetchCategories()).finally(() => {
        fetchingCategories.current = false;
      });
    }
  }, [dispatch, categories.length, loading]);

  useEffect(() => {
    if (
      fetchingProducts.current ||
      !initialCategorySlug ||
      !initialFiltersSet.current
    )
      return;

    const filtersHaveChanged =
      JSON.stringify(prevActiveFilters.current) !==
      JSON.stringify(activeFilters);
    const pageHasChanged = prevPage.current !== currentPage;

    if (
      (filtersChanged.current || filtersHaveChanged || pageHasChanged) &&
      categories.length > 0
    ) {
      console.log(
        "Filters or page changed, fetching products with:",
        activeFilters,
        "page:",
        currentPage,
      );

      prevActiveFilters.current = { ...activeFilters };
      prevPage.current = currentPage;
      filtersChanged.current = false;

      fetchingProducts.current = true;

      const apiParams: any = {
        ...activeFilters,
        page: currentPage,
        page_size: 10,
      };

      if (!apiParams.category && initialCategorySlug) {
        apiParams.category = initialCategorySlug;
      }

      dispatch(fetchProducts(apiParams)).finally(() => {
        fetchingProducts.current = false;
      });
    }
  }, [
    activeFilters,
    currentPage,
    categories,
    dispatch,
    initialCategorySlug,
    loading,
    activeCategory,
    initialFiltersSet,
  ]);

  useEffect(() => {
    if (
      initialCategorySlug &&
      products.length === 0 &&
      !fetchingProducts.current &&
      !loading &&
      categories.length > 0 &&
      initialFiltersSet.current
    ) {
      console.log("No products loaded for category, forcing fetch");
      filtersChanged.current = true;
      fetchingProducts.current = true;

      const apiParams: any = {
        category: initialCategorySlug,
        page: currentPage,
        page_size: 10,
      };

      dispatch(fetchProducts(apiParams)).finally(() => {
        fetchingProducts.current = false;
      });
    }
  }, [
    products.length,
    initialCategorySlug,
    loading,
    categories.length,
    dispatch,
    currentPage,
    initialFiltersSet,
  ]);

  const updateURL = (filters: ProductFilters, page: number) => {
    if (!initialCategorySlug) return;
    const params = new URLSearchParams();

    if (filters.brand) params.set("brand", filters.brand);
    else params.delete("brand");

    if (filters.ordering) params.set("ordering", filters.ordering);
    else params.delete("ordering");

    if (page > 1) params.set("page", page.toString());
    else params.delete("page");

    const newPath = `/catalog/${initialCategorySlug}${params.toString() ? "?" + params.toString() : ""}`;
    router.push(newPath);
  };

  const handleCategoryChange = (categorySlug: string) => {
    prevTireFilters.current = {
      width: undefined,
      profile: undefined,
      diameter: undefined,
      brand: undefined,
    };

    const newFilters = {
      ...activeFilters,
      category: categorySlug,
      width: undefined,
      profile: undefined,
      diameter: undefined,
      brand: undefined,
    };

    setActiveFilters(newFilters);
    filtersChanged.current = true;
    dispatch(setCurrentPage(1));
    updateURL(newFilters, 1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!initialCategorySlug) return;
    const newFilters = {
      ...activeFilters,
      ordering: e.target.value || undefined,
    };
    setActiveFilters(newFilters);
    filtersChanged.current = true;
    dispatch(setCurrentPage(1));
    updateURL(newFilters, 1);
  };

  const handleTireFiltersChange = (tireFilters: any) => {
    if (!initialCategorySlug) return;
    const tireFiltersChanged =
      tireFilters.width !== prevTireFilters.current.width ||
      tireFilters.profile !== prevTireFilters.current.profile ||
      tireFilters.diameter !== prevTireFilters.current.diameter ||
      tireFilters.brand !== prevTireFilters.current.brand;

    if (tireFiltersChanged) {
      console.log("Tire filters changed:", tireFilters);
      prevTireFilters.current = { ...tireFilters };

      const newFilters = {
        category: activeFilters.category,
        ordering: activeFilters.ordering,
        ...tireFilters,
      };

      filtersChanged.current = true;

      dispatch(setCurrentPage(1));

      updateURL(newFilters, 1);

      setActiveFilters(newFilters);
    }
  };

  const handlePageChange = (page: number) => {
    if (!initialCategorySlug) return;
    if (page !== currentPage) {
      filtersChanged.current = true;
      dispatch(setCurrentPage(page));
      updateURL(activeFilters, page);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  const renderCategoryGallery = () => {
    return (
      <div className="category-gallery">
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <Link
                href={`/catalog/${category.slug}`}
                className="category-link"
              >
                <div className="category-image">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="category-placeholder">
                      <span>{category.name.substring(0, 1)}</span>
                    </div>
                  )}
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleBuyClick = () => {
    setShowAlert(true);
  };

  const renderProductsList = () => {
    return (
      <div className="products-section">
        <div className="catalog-header">
          <div className="sorting-container">
            <select
              className="sort-select"
              style={{ color: "black" }}
              onChange={handleSortChange}
              value={activeFilters.ordering || ""}
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
          {products.length === 0 ? (
            <div className="no-products">
              <p>
                Товары не найдены. Попробуйте изменить параметры фильтрации.
              </p>
            </div>
          ) : (
            products.map((product: Product) => (
              <Link
                href={
                  product.slug
                    ? `/product/${product.slug}`
                    : `/product/${product.id}`
                }
                key={product.id}
                className="product-card-link"
              >
                <div className="product-card">
                  <div className="product-image">
                    {product.feature_image ? (
                      <img
                        src={product.feature_image.image}
                        alt={product.feature_image.alt_text || product.name}
                        loading="lazy"
                      />
                    ) : product.images?.length > 0 ? (
                      <img
                        src={product.images[0].image}
                        alt={product.images[0].alt_text || product.name}
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-details">
                      <div className="product-category">
                        {product.category.name}
                      </div>
                      {product.tire_size && (
                        <div className="product-tire-size">
                          {product.tire_size}
                        </div>
                      )}
                      {product.brand && (
                        <div className="product-brand">
                          {product.brand.name}
                        </div>
                      )}
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
                          handleBuyClick();
                        }}
                      >
                        Купить
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
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
    );
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <h1>Каталог товаров</h1>

        <div className="catalog-layout">
          {initialCategorySlug && (
            <div className="catalog-sidebar">
              <TireFilters onFilterChange={handleTireFiltersChange} />
            </div>
          )}

          <div
            className={`catalog-content ${!initialCategorySlug ? "full-width" : ""}`}
          >
            {loading && categories.length === 0 ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Загрузка категорий...</p>
              </div>
            ) : initialCategorySlug ? (
              renderProductsList()
            ) : (
              renderCategoryGallery()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;

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
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";

interface CatalogPageProps {
  initialCategorySlug?: string;
}

export default function CatalogPage({ params }: { params?: { slug?: string } | Promise<{ slug: string }> }) {
  if (params && 'then' in params) {
    return <AsyncCatalogPage params={params} />;
  }

  const initialCategorySlug = params?.slug;
  return <CatalogPageContent initialCategorySlug={initialCategorySlug} />;
}

function AsyncCatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  return <CatalogPageContent initialCategorySlug={slug} />;
}

const CatalogPageContent = ({ initialCategorySlug }: CatalogPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totalCount = useSelector(selectTotalProducts);
  const currentPage = useSelector(selectCurrentPage);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});
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

          const apiParams: Record<string, string | number> = {
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

      const apiParams: Record<string, string | number | boolean> = {
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

      const apiParams: Record<string, string | number | boolean> = {
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
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={100}
                      height={100}
                      loading="lazy"
                    />
                  ) : (
                    <div className="category-placeholder">
                      <span>{category.name.substring(0, 1)}</span>
                    </div>
                  )}
                </div>
                <h3 className="category-name" style={{ color: "#fff" }}>{category.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProductsList = () => {
    return (
      <div className="products-section">
        <div className="catalog-header mb-6">
          <div className="sorting-container">
            <select
              className="sort-select bg-white border border-gray-300 rounded px-4 py-2 text-gray-700"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                Товары не найдены. Попробуйте изменить параметры фильтрации.
              </p>
            </div>
          ) : (
            products.map((product: Product, index: number) => (
              <ProductCard 
                key={product.id}
                product={product} 
                index={index} 
                showPrice={true} 
                showBuyButton={true} 
                onBuyClick={() => {
                  // Здесь можно добавить логику для кнопки "Купить"
                  console.log("Buy button clicked for", product.name);
                }}
              />
            ))
          )}
        </div>

        {totalCount > 10 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(totalCount / 10) }, (_, i) => (
              <button
                key={i + 1}
                className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${
                  currentPage === i + 1 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
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

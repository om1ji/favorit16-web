"use client";

import React, { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchCategories,
  selectCategories,
  selectLoading,
} from "@/redux/features/productsSlice";
import CatalogPage from "../page";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: Props) {
  // Используем React.use() для разворачивания Promise с параметрами
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  // Передаем slug категории в CatalogPage в качестве initialCategorySlug
  return <CatalogPage initialCategorySlug={slug} />;
}

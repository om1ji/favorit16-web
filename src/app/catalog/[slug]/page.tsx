"use client";

import React, { use } from "react";
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
  return <CatalogPage params={{ slug }} />;
}

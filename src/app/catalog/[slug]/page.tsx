"use client";

import React from "react";
import CatalogPage from "../page";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: Record<string, string>;
}

export default function CategoryPage(props: PageProps) {
  return <CatalogPage params={props.params} />;
}

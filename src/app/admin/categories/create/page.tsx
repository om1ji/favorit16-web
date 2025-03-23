"use client";

import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import CategoryForm from "../components/CategoryForm";
import "../categories.scss";

export default function CreateCategoryPage() {
  return (
    <div className="admin-categories">
      <div className="admin-header">
        <Link href="/admin/categories" className="back-button">
          <ChevronLeftIcon className="icon" />
          <span>Назад к категориям</span>
        </Link>
        <h1>Создание новой категории</h1>
      </div>

      <div className="admin-content">
        <CategoryForm />
      </div>
    </div>
  );
}

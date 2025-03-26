"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { adminAPI } from "@/services/api";
import { Category } from "@/types/product";
import "./CategoryForm.scss";
import Image from "next/image";

interface FormCategory extends Omit<Category, "children"> {
  children?: string[];
}

interface CategoryFormProps {
  initialData?: FormCategory;
  isEdit?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormCategory>({
    id: "",
    name: "",
    parent: null,
    image: null,
    created_at: "",
    updated_at: "",
  });

  // Track the uploaded image state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminAPI.getCategoriesForSelect();
        setCategories(data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };

    fetchCategories();

    if (initialData) {
      setFormData(initialData);
      if (initialData.image) {
        setPreviewUrl(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "parent" && value === "") {
      setFormData((prev) => ({ ...prev, parent: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }

      // Upload image immediately when selected
      try {
        setLoading(true);
        const uploadResult = await adminAPI.uploadImage(file);
        console.log("Image uploaded successfully:", uploadResult);
        setUploadedImageId(uploadResult.id);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setLoading(false);
        setErrors(prev => ({
          ...prev,
          image: "Ошибка при загрузке изображения"
        }));
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, image: null }));
    setUploadedImageId(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название категории не может быть пустым";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create JSON data object instead of FormData
      const jsonData: Record<string, string | null | boolean | number> = {
        name: formData.name
      };

      // Add parent if it exists
      if (formData.parent) {
        jsonData.parent = formData.parent;
      }

      // Add image ID if it was uploaded
      if (uploadedImageId) {
        jsonData.image_id = uploadedImageId;
      }

      console.log("Sending category data:", jsonData);

      if (isEdit) {
        // Use JSON for update
        await adminAPI.updateCategoryJson(formData.id, jsonData);
      } else {
        // Use JSON for create
        await adminAPI.createCategoryJson(jsonData);
      }

      router.push("/admin/categories");
    } catch (error) {
      console.error("Ошибка при сохранении категории:", error);
      setErrors({
        submit: "Не удалось сохранить категорию. Попробуйте еще раз.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-form-container">
      <h1>
        {isEdit ? "Редактирование категории" : "Создание новой категории"}
      </h1>

      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label htmlFor="name">Название*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="parent">Родительская категория</label>
          <select
            id="parent"
            name="parent"
            value={formData.parent || ""}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Нет (корневая категория)</option>
            {categories
              .filter((cat) => cat.id !== formData.id)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Изображение категории</label>
          <div className="image-upload-container">
            {previewUrl ? (
              <div className="image-preview">
                <Image src={previewUrl} alt="Превью" className="preview-image" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={handleRemoveImage}
                  disabled={loading}
                >
                  <XMarkIcon className="icon" />
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <PhotoIcon className="icon" />
                <span>Нет изображения</span>
              </div>
            )}

            <div className="image-upload-controls">
              <label htmlFor="image-upload" className="upload-button">
                {loading ? "Загрузка..." : previewUrl ? "Изменить изображение" : "Загрузить изображение"}
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                hidden
              />
              {errors.image && (
                <div className="error-message">{errors.image}</div>
              )}
            </div>
          </div>
        </div>

        {errors.submit && <div className="form-error">{errors.submit}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => router.push("/admin/categories")}
            disabled={loading}
          >
            Отмена
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading
              ? "Сохранение..."
              : isEdit
                ? "Обновить категорию"
                : "Создать категорию"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

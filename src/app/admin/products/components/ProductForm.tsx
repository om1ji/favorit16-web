'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { adminAPI } from '@/services/api';
import { Category } from '@/types/product';
import './ProductForm.scss';

interface AdminCategory extends Category {
  level: number;
  full_name: string;
}

interface ImageMetadata {
  id: string;
  file?: File;
  url?: string;
  alt_text: string;
  is_feature: boolean;
  thumbnail?: string;
}

interface ProductFormData {
  id?: string;
  name: string;
  category_id: string;
  price: string;
  old_price: string;
  description: string;
  in_stock: boolean;
  quantity: number;
  images: ImageMetadata[];
}

interface ProductFormProps {
  initialData?: ProductFormData;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category_id: '',
    price: '',
    old_price: '',
    description: '',
    in_stock: true,
    quantity: 0,
    images: [],
    ...initialData
  });

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminAPI.getCategoriesForSelect();
        console.log('Categories from API:', data);
        // Проверяем, является ли data массивом
        const categoriesData = Array.isArray(data) ? data : data.results || [];
        console.log('Processed categories:', categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setErrors(prev => ({ ...prev, category: 'Не удалось загрузить категории' }));
      }
    };
    fetchCategories();
  }, []);

  // Форматирование цены
  const formatPrice = (value: string): string => {
    const number = value.replace(/[^\d.]/g, '');
    const parts = number.split('.');
    if (parts.length > 1) {
      return `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    return number;
  };

  // Обработка изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let formattedValue = value;

    if (name === 'price' || name === 'old_price') {
      formattedValue = formatPrice(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : formattedValue
    }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Загрузка изображений
  const handleImageUpload = async (files: FileList) => {
    setLoading(true);
    const newImages: ImageMetadata[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = await adminAPI.uploadImage(file);
        
        newImages.push({
          id: data.id,
          url: data.image,
          thumbnail: data.thumbnail,
          alt_text: file.name,
          is_feature: newImages.length === 0, // Первое изображение будет основным
        });
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrors(prev => ({ ...prev, images: 'Failed to upload images' }));
    } finally {
      setLoading(false);
    }
  };

  // Удаление изображения
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Установка основного изображения
  const handleSetFeatureImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        is_feature: i === index
      }))
    }));
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Создаем FormData
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category_id);
      formDataToSend.append('price', Number(formData.price).toFixed(2));
      if (formData.old_price) {
        formDataToSend.append('old_price', Number(formData.old_price).toFixed(2));
      }
      formDataToSend.append('description', formData.description);
      formDataToSend.append('in_stock', formData.in_stock.toString());
      formDataToSend.append('quantity', formData.quantity.toString());
      
      // Добавляем каждый UUID изображения отдельно
      formData.images.forEach((img, index) => {
        formDataToSend.append(`images[${index}]`, img.id);
      });

      // Добавляем метаданные каждого изображения отдельно
      formData.images.forEach((img, index) => {
        formDataToSend.append(`images_metadata[${index}][image_id]`, img.id);
        formDataToSend.append(`images_metadata[${index}][alt_text]`, img.alt_text);
        formDataToSend.append(`images_metadata[${index}][is_feature]`, img.is_feature.toString());
      });

      // Добавляем логирование для отладки
      console.log('Sending form data:', Object.fromEntries(formDataToSend.entries()));

      if (isEdit && initialData?.id) {
        await adminAPI.updateProduct(initialData.id, formDataToSend);
      } else {
        await adminAPI.createProduct(formDataToSend);
      }

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ submit: 'Failed to save product' });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryOptions = (categories: AdminCategory[] = [], level = 0): React.ReactNode => {
    console.log('Rendering categories:', categories, 'at level:', level);
    if (!categories || categories.length === 0) return null;
    
    return categories.map(category => {
      console.log('Rendering category:', category);
      return (
        <React.Fragment key={category.id}>
          <option value={category.id}>
            {'  '.repeat(level)}{category.full_name}
          </option>
          {category.children && renderCategoryOptions(category.children as AdminCategory[], level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="name">Название товара *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={255}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Категория *</label>
        <select
          id="category"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Выберите категорию</option>
          {renderCategoryOptions(categories)}
        </select>
        {errors.category_id && <span className="error">{errors.category_id}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Цена *</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="old_price">Старая цена</label>
          <input
            type="text"
            id="old_price"
            name="old_price"
            value={formData.old_price}
            onChange={handleChange}
            placeholder="0.00"
          />
          {errors.old_price && <span className="error">{errors.old_price}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Количество</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            max="999999"
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
            />
            В наличии
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={10000}
          rows={5}
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Изображения</label>
        <div className="image-upload-area">
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            className="hidden"
          />
          <label htmlFor="images" className="upload-button">
            <PhotoIcon className="w-6 h-6" />
            <span>Выберите изображения</span>
          </label>
        </div>
        {errors.images && <span className="error">{errors.images}</span>}

        <div className="image-preview-grid">
          {formData.images.map((image, index) => (
            <div key={image.id} className="image-preview">
              <Image
                src={image.thumbnail || image.url || ''}
                alt={image.alt_text}
                width={100}
                height={100}
                className="preview-image"
              />
              <div className="image-actions">
                <button
                  type="button"
                  onClick={() => handleSetFeatureImage(index)}
                  className={`feature-button ${image.is_feature ? 'active' : ''}`}
                >
                  {image.is_feature ? 'Основное' : 'Сделать основным'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="remove-button"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={image.alt_text}
                onChange={(e) => {
                  const newImages = [...formData.images];
                  newImages[index].alt_text = e.target.value;
                  setFormData(prev => ({ ...prev, images: newImages }));
                }}
                placeholder="Alt текст"
                className="alt-text-input"
              />
            </div>
          ))}
        </div>
      </div>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-actions">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="cancel-button"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Создать')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 
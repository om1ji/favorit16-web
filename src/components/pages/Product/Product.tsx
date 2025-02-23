"use client";

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/features/cartSlice';
import './Product.scss';

interface ProductProps {
  product: {
    id: number;
    title: string;
    price: number;
    oldPrice?: number;
    maxPrice?: number;
    discount?: number;
    image: string;
    rating: number;
    description: string;
    specifications?: {
      [key: string]: string;
    };
    gallery?: string[];
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Моки для характеристик товара
  const specs = {
    'Производитель': 'Apple',
    'Модель': 'iPhone 8',
    'Объем памяти': '64 ГБ',
    'Цвет': 'Красный',
    'Операционная система': 'iOS',
    'Гарантия': '1 год'
  };

  // Моки для галереи изображений
  const gallery = [
    product.image,
    '/products/iphone-8-red-2.jpg',
    '/products/iphone-8-red-3.jpg',
    '/products/iphone-8-red-4.jpg'
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image
    }));
  };

  return (
    <div className="product-details">
      <div className="container">
        <div className="product-content">
          {/* Галерея изображений */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={gallery[selectedImage]} alt={product.title} />
              {product.discount && (
                <span className="discount-badge">−{product.discount}%</span>
              )}
            </div>
            <div className="thumbnail-list">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {'★'.repeat(product.rating)}{'☆'.repeat(5-product.rating)}
              </div>
              <span className="rating-count">12 отзывов</span>
            </div>

            <div className="product-price">
              {product.maxPrice ? (
                <span className="price-range">
                  {formatPrice(product.price)} – {formatPrice(product.maxPrice)}
                </span>
              ) : (
                <>
                  <span className="current-price">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="old-price">{formatPrice(product.oldPrice)}</span>
                  )}
                </>
              )}
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >−</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max="99"
                />
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                >+</button>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Добавить в корзину
              </button>
              <button className="add-to-favorites-btn">
                ♡
              </button>
            </div>

            <div className="product-description">
              <h2>Описание</h2>
              <p>{product.description}</p>
            </div>

            <div className="product-specifications">
              <h2>Характеристики</h2>
              <div className="specs-list">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-name">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Похожие товары */}
        <div className="related-products">
          <h2>Похожие товары</h2>
          <div className="products-grid">
            {/* Здесь будет компонент со списком похожих товаров */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product; 
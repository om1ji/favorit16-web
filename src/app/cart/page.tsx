"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { 
  selectCartItems, 
  selectCartTotal,
  removeFromCart,
  updateCartItem,
} from '@/redux/features/cartSlice';
import { AppDispatch } from '@/redux/store';
import './cart.scss';

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity === 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateCartItem({ itemId: id, quantity }));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  if (items.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="container">
          <h1>Корзина пуста</h1>
          <p>В вашей корзине пока нет товаров</p>
          <Link href="/catalog" className="continue-shopping">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Корзина</h1>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="item-details">
                  <Link href={`/product/${item.product.id}`} className="item-title">
                    {item.product.name}
                  </Link>
                  <div className="item-controls">
                    <div className="quantity-selector">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >−</button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <div className="item-price">
                      <span className="price-per-item">{formatPrice(item.product.price)}</span>
                      {item.quantity > 1 && (
                        <span className="total-price">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      )}
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Итого</h2>
            <div className="summary-row">
              <span>Товары ({items.reduce((acc, item) => acc + item.quantity, 0)} шт.):</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Доставка:</span>
              <span>Бесплатно</span>
            </div>
            <div className="summary-row total">
              <span>К оплате:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="checkout-btn">
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 
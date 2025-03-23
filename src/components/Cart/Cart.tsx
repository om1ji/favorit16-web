"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectIsCartOpen,
  removeFromCart,
  updateCartItem,
  toggleCart,
} from "@/redux/features/cartSlice";
import "./Cart.scss";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectIsCartOpen);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      dispatch(removeFromCart(itemId) as any);
    } else {
      dispatch(updateCartItem({ itemId, quantity }) as any);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart">
      <div className="cart-overlay" onClick={() => dispatch(toggleCart())} />
      <div className="cart-content">
        <div className="cart-header">
          <h2>Корзина</h2>
          <button className="close-btn" onClick={() => dispatch(toggleCart())}>
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <div className="item-price">{item.product.price} ₽</div>
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => dispatch(removeFromCart(item.id) as any)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Итого:</span>
                <span>{total} ₽</span>
              </div>
              <button className="checkout-btn">Оформить заказ</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;

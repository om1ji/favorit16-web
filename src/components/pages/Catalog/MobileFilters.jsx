"use client";

import React from 'react';
import './MobileFilters.scss';

const MobileFilters = ({ isOpen, onClose }) => {
  return (
    <div className={`mobile-filters ${isOpen ? 'is-open' : ''}`}>
      <div className="mobile-filters-overlay" onClick={onClose}></div>
      <div className="mobile-filters-content">
        <div className="mobile-filters-header">
          <h2>Фильтры</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="mobile-filters-body">
          <div className="filter-section">
            <h3>Категории</h3>
            <ul>
              <li><a href="/category/phones">Телефоны</a></li>
              <li><a href="/category/laptops">Ноутбуки</a></li>
              <li><a href="/category/photo">Фото и видео</a></li>
              <li><a href="/category/accessories">Аксессуары</a></li>
            </ul>
          </div>

          <div className="filter-section">
            <h3>Цена</h3>
            <div className="price-inputs">
              <input type="number" placeholder="от" />
              <span>—</span>
              <input type="number" placeholder="до" />
            </div>
          </div>

          <div className="filter-section">
            <h3>Бренды</h3>
            <label>
              <input type="checkbox" /> Apple
            </label>
            <label>
              <input type="checkbox" /> Samsung
            </label>
            <label>
              <input type="checkbox" /> Canon
            </label>
          </div>
        </div>

        <div className="mobile-filters-footer">
          <button className="apply-btn">Применить</button>
          <button className="reset-btn">Сбросить</button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters; 
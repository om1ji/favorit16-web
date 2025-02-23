'use client';

import React from 'react';
import ProductForm from '../components/ProductForm';

const NewProductPage = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Добавление товара</h1>
      </div>
      <ProductForm />
    </div>
  );
};

export default NewProductPage; 
import React from 'react';
import './FeaturedCategories.scss';

const FeaturedCategories = () => {
  const categories = [
    {
      id: 1,
      title: 'Смартфоны',
      image: '/categories/smartphones.jpg',
      link: '/category/smartphones'
    },
    {
      id: 2,
      title: 'Ноутбуки',
      image: '/categories/laptops.jpg',
      link: '/category/laptops'
    },
    {
      id: 3,
      title: 'Планшеты',
      image: '/categories/tablets.jpg',
      link: '/category/tablets'
    },
    {
      id: 4,
      title: 'Аксессуары',
      image: '/categories/accessories.jpg',
      link: '/category/accessories'
    }
  ];

  return (
    <section className="featured-categories">
      <div className="container">
        <h2 className="section-title">Популярные категории</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <a key={category.id} href={category.link} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.title} />
              </div>
              <h3 className="category-title">{category.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories; 
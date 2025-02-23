import React from 'react';
import './Features.scss';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: '🚚',
      title: 'Быстрая доставка',
      description: 'Доставка по всей России от 1 до 3 дней'
    },
    {
      id: 2,
      icon: '💳',
      title: 'Удобная оплата',
      description: 'Оплата картой онлайн или при получении'
    },
    {
      id: 3,
      icon: '🔄',
      title: 'Гарантия возврата',
      description: '14 дней на возврат товара'
    },
    {
      id: 4,
      icon: '🎁',
      title: 'Бонусная программа',
      description: 'Кэшбэк до 10% с каждой покупки'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 
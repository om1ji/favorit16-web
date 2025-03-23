import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./MainSlider.scss";

const MainSlider = () => {
  return (
    <div className="main-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
      >
        <SwiperSlide>
          <div className="slider-item">
            <img src="/slider1.jpg" alt="Акция 1" />
            <div className="slider-content">
              <h2>Новая коллекция</h2>
              <p>Скидки до 50% на весь ассортимент</p>
              <a href="/catalog" className="btn">
                Перейти в каталог
              </a>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/slider2.jpg" alt="Акция 2" />
            <div className="slider-content">
              <h2>Специальное предложение</h2>
              <p>Бесплатная доставка при заказе от 5000 ₽</p>
              <a href="/catalog" className="btn">
                Подробнее
              </a>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MainSlider;

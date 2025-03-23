"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "https://via.placeholder.com/800x600?text=Favorit116";
    e.currentTarget.onerror = null;
  };

  return (
    <div className="py-12 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">О компании</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Узнайте больше о нашей компании, нашей миссии и ценностях
          </p>
        </motion.div>

        {/* Company Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-full rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <img
                src="https://via.placeholder.com/800x600?text=Favorit116"
                alt="Favorit116"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Наша история
              </h2>
              <p className="text-gray-600 mb-4">
                Favorit116 начал свой путь в 2018 году как небольшой магазин
                электроники в Казани. С момента основания наша главная цель -
                предоставлять качественные товары и исключительный сервис нашим
                клиентам.
              </p>
              <p className="text-gray-600 mb-4">
                За время работы мы выросли из маленького магазина в крупную сеть
                с широким ассортиментом электроники и аксессуаров. Мы постоянно
                развиваемся, чтобы соответствовать потребностям наших клиентов.
              </p>
              <p className="text-gray-600">
                Сегодня Favorit116 - это команда профессионалов, которые любят
                свое дело и стремятся сделать процесс покупки максимально
                приятным и удобным для каждого клиента.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Наша миссия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Качество</h3>
              <p className="text-gray-600">
                Мы предлагаем только проверенные товары от надежных
                производителей, гарантируя их качество и долговечность.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Клиенты</h3>
              <p className="text-gray-600">
                Наши клиенты - центр нашего бизнеса. Мы стремимся превосходить
                ожидания и создавать долгосрочные отношения.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Инновации</h3>
              <p className="text-gray-600">
                Мы постоянно следим за новинками технологий, чтобы предлагать
                нашим клиентам самые современные решения.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Наша команда
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Алексей Петров",
                position: "Генеральный директор",
                image: "https://via.placeholder.com/400x400?text=Director",
              },
              {
                name: "Екатерина Смирнова",
                position: "Руководитель отдела продаж",
                image: "https://via.placeholder.com/400x400?text=Sales+Manager",
              },
              {
                name: "Дмитрий Козлов",
                position: "Технический директор",
                image: "https://via.placeholder.com/400x400?text=Tech+Director",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-64 w-full bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gray-50 rounded-lg p-8 mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Широкий ассортимент",
                description:
                  "Мы предлагаем большой выбор электроники и аксессуаров от ведущих мировых производителей.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                ),
              },
              {
                title: "Профессиональные консультации",
                description:
                  "Наши специалисты всегда готовы помочь с выбором и ответить на все вопросы.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                ),
              },
              {
                title: "Гарантия качества",
                description:
                  "На все товары предоставляется официальная гарантия от производителя.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
              },
              {
                title: "Быстрая доставка",
                description:
                  "Мы осуществляем доставку по всей России. В Казани доставка возможна в день заказа.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start p-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                    {item.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-blue-600 rounded-xl text-white p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Готовы начать покупки?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Посетите наш каталог, чтобы найти лучшие предложения на электронику
            и аксессуары.
          </p>
          <a
            href="/catalog"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition duration-300"
          >
            Перейти в каталог
          </a>
        </motion.div>
      </div>
    </div>
  );
}

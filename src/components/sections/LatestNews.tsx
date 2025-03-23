"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const news = [
  {
    id: 1,
    title: "Новые iPhone 15 уже в продаже",
    excerpt:
      "Встречайте новую линейку смартфонов от Apple с революционными возможностями и улучшенной камерой",
    image: "/images/news/iphone-15.jpg",
    date: "2024-03-15",
    readTime: "5 мин",
  },
  {
    id: 2,
    title: "Как выбрать идеальный ноутбук",
    excerpt:
      "Подробное руководство по выбору ноутбука для работы, учебы и развлечений от наших экспертов",
    image: "/images/news/laptop-guide.jpg",
    date: "2024-03-10",
    readTime: "8 мин",
  },
  {
    id: 3,
    title: "Тренды в мире гаджетов 2024",
    excerpt:
      "Обзор самых интересных и инновационных технологических новинок этого года",
    image: "/images/news/tech-trends.jpg",
    date: "2024-03-05",
    readTime: "6 мин",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const LatestNews = () => {
  return (
    <section className="py-24">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text-h2 mb-4">
            Последние новости
          </h2>
          <p className="text-xl text-text-subtitle max-w-2xl mx-auto">
            Будьте в курсе последних новостей и трендов в мире технологий
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {news.map((article) => (
            <motion.div key={article.id} variants={item}>
              <Link href={`/news/${article.id}`}>
                <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-56 bg-gray-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <time dateTime={article.date}>
                        {new Date(article.date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      <span className="mx-2">·</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      Читать далее
                      <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LatestNews;

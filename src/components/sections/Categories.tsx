"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchCategories,
  selectCategories,
} from "@/redux/features/productsSlice";

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

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
            Популярные категории
          </h2>
          <p className="text-xl text-text-subtitle max-w-2xl mx-auto">
            Выбирайте из широкого ассортимента качественной электроники
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Link href={`/catalog/${category.slug}`} className="block">
                <div className="group relative h-80 bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
                      <div className="flex flex-col items-start">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            Смотреть →
                          </span>
                        </div>
                      </div>
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

export default Categories;

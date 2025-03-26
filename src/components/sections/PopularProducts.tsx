"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchProducts,
  selectProducts,
  selectLoading,
} from "@/redux/features/productsSlice";
import { getImageUrl } from "@/utils/imageUtils";
import TestModeAlert from "@/components/ui/TestModeAlert";
import { defaultConfig } from "@/lib/config/default-config";

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

const PopularProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const hasFetched = useRef(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!hasFetched.current && !loading) {
      hasFetched.current = true;
      dispatch(
        fetchProducts({
          ordering: "-created_at",
          page: 1,
        }),
      );
    }
  }, [dispatch, loading]);

  const handleBuyClick = () => {
    setShowAlert(true);
  }

  return (
    <section className="py-24">
      {showAlert && (
        <TestModeAlert 
          onClose={() => setShowAlert(false)} 
          phone={defaultConfig.contacts.phone} 
          telegram={defaultConfig.social.telegram.url}
        />
      )}

      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text-h2 mb-4">
            Популярные товары
          </h2>
          <p className="text-xl text-text-subtitle max-w-2xl mx-auto">
            Самые востребованные товары по лучшим ценам
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8"
        >
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Товары не найдены</p>
            </div>
          ) : (
            products.map((product, index) => (
              <motion.div key={product.id} variants={item}>
                <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {product.has_discount && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-red-500 text-white text-sm font-medium px-2.5 py-1 rounded-full">
                        -{product.discount_percentage}%
                      </span>
                    </div>
                  )}
                  <Link
                    href={
                      product.slug
                        ? `/product/${product.slug}`
                        : `/product/${product.id}`
                    }
                  >
                    <div className="relative h-64 bg-gray-100">
                      {product.feature_image && (
                        <Image
                          src={getImageUrl(product.feature_image.image)}
                          alt={product.feature_image.alt_text || product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          loading={index < 2 ? "eager" : "lazy"}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link href={`/catalog?category=${product.category.slug}`}>
                      <span className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        {product.category.name}
                      </span>
                    </Link>
                    <Link
                      href={
                        product.slug
                          ? `/product/${product.slug}`
                          : `/product/${product.id}`
                      }
                    >
                      <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.old_price && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.old_price} ₽
                          </span>
                        )}
                        <span className="text-lg font-semibold text-gray-900">
                          {product.price} ₽
                        </span>
                      </div>
                      {product.in_stock ? (
                        <button 
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            handleBuyClick();
                          }}
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <span className="text-sm text-red-600">
                          Нет в наличии
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularProducts;

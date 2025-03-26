"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchProducts,
  selectProducts,
  selectLoading,
} from "@/redux/features/productsSlice";
import HeroSection from "@/components/sections/HeroSection";
import Features from "@/components/sections/Features";
import Categories from "@/components/sections/Categories";
import PopularProducts from "@/components/sections/PopularProducts";
import Newsletter from "@/components/sections/Newsletter";
import TestModeAlert from "@/components/ui/TestModeAlert";
import { defaultConfig } from "@/lib/config/default-config";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";

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

export default function Home() {
  const [showAlert, setShowAlert] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const hasFetched = useRef(false);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

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

  return (
    <>
      <HeroSection />
      <Features />
      <Categories />
      
      {/* Карточки товаров как в каталоге, но без кнопки и цены */}
      <section className="py-16">
        <div className="container mx-auto px-4">
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
              Широкий выбор качественных товаров
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
                  <ProductCard 
                    product={product} 
                    index={index} 
                    showPrice={false} 
                    showBuyButton={false} 
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* <PopularProducts /> */}
      <Newsletter />

      {showAlert && (
        <TestModeAlert
          onClose={handleCloseAlert}
          phone={defaultConfig.contacts.phone}
          telegram={defaultConfig.social.telegram.url}
        />
      )}
    </>
  );
}

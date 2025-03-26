"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchProducts,
  selectProducts,
  selectLoading,
} from "@/redux/features/productsSlice";
import TestModeAlert from "@/components/ui/TestModeAlert";
import { defaultConfig } from "@/lib/config/default-config";
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
    <section className="py-24 bg-white">
      {showAlert && (
        <TestModeAlert 
          onClose={() => setShowAlert(false)} 
          phone={defaultConfig.contacts.phone} 
          telegram={defaultConfig.social.telegram.url}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Популярные товары
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Самые востребованные товары по лучшим ценам
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
                  showPrice={true} 
                  showBuyButton={true} 
                  onBuyClick={handleBuyClick}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularProducts;

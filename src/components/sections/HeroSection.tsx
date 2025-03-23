"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSiteInfo } from "@/hooks/useConfig";

const HeroSection = () => {
  const { data: siteInfo, loading } = useSiteInfo();

  return (
    <section className="relative min-h-[100vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-black to-black">
        <Image
          src="/images/hero-bg.png"
          alt="Hero background"
          fill
          className="object-cover object-center opacity-20"
          priority
        />
      </div>

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white bg-clip-text">
            Добро пожаловать в <span>Favorit116</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Широкий выбор автомобильных шин и аксессуаров по лучшим ценам
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Перейти в каталог
            </Link>
          </div>
        </motion.div>

        {/* Декоративные элементы */}
      </div>
    </section>
  );
};

export default HeroSection;

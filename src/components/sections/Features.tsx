"use client";

import React from "react";
import {
  TruckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const features = [
  {
    icon: TruckIcon,
    title: "Быстрая доставка",
    description: "Доставляем заказы по всей России в кратчайшие сроки",
  },
  {
    icon: CreditCardIcon,
    title: "Удобная оплата",
    description: "Принимаем все популярные способы оплаты, включая рассрочку",
  },
  {
    icon: ShieldCheckIcon,
    title: "Гарантия качества",
    description: "Только оригинальная продукция с официальной гарантией",
  },
  {
    icon: PhoneIcon,
    title: "Поддержка 24/7",
    description: "Наши специалисты всегда готовы помочь вам с выбором",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Features = () => {
  return (
    <section className="py-24">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex flex-col items-center text-center">
                <div className="p-3 bg-primary-light rounded-xl mb-4 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-text-h2">
                  {feature.title}
                </h3>
                <p className="text-text-subtitle">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

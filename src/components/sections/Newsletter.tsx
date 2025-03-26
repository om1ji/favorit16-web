"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Здесь будет логика отправки email на бэкенд
    try {
      // Имитация запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(154deg,#ffffff12_0%,#ffffff00_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/30 rounded-full blur-3xl" />
      </div>

      <div className="relative  mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-text-h2 mb-4">
            Подпишитесь на наши новости
          </h2>
          <p className="text-xl text-text-subtitle mb-8 max-w-2xl mx-auto">
            Будьте в курсе последних новинок, специальных предложений и акций
          </p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                className="w-full pl-11 pr-32 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                required
              />
              <div className="absolute inset-y-1.5 right-1.5">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-2.5 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
                >
                  {status === "loading" ? "Отправка..." : "Подписаться"}
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: status === "success" || status === "error" ? 1 : 0,
                y: status === "success" || status === "error" ? 0 : 10,
              }}
              className="mt-4"
            >
              {status === "success" && (
                <p className="text-sm text-blue-100">
                  Спасибо за подписку! Мы отправили вам письмо для
                  подтверждения.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-300">
                  Произошла ошибка. Пожалуйста, попробуйте позже.
                </p>
              )}
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;

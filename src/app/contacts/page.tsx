"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { submitContactForm } from "./actions";
import { useFormStatus } from "react-dom";
import ContactInfo from "@/components/layout/ContactInfo";
import SocialLinks from "@/components/layout/SocialLinks";

// Компонент для кнопки отправки с состоянием загрузки
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full px-4 py-3 font-medium rounded-md transition duration-300 ${
        pending
          ? "bg-blue-400 text-white cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {pending ? "Отправка..." : "Отправить сообщение"}
    </button>
  );
}

export default function ContactsPage() {
  // Состояние формы
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [formMessage, setFormMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Обработчик отправки формы
  const handleFormAction = async (formData: FormData) => {
    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setFormStatus("success");
        setFormMessage(result.message);
        formRef.current?.reset();
      } else {
        setFormStatus("error");
        setFormMessage(result.message);
      }
    } catch (error) {
      setFormStatus("error");
      setFormMessage(
        "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.",
      );
    }
  };

  return (
    <div className="py-12 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Контакты</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Свяжитесь с нами любым удобным для вас способом
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Наши контакты
            </h2>

            <ContactInfo />

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Мы в соцсетях
              </h3>
              <SocialLinks />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Напишите нам
            </h2>

            <form ref={formRef} action={handleFormAction}>
              {formStatus === "error" && formMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {formMessage}
                </div>
              )}

              {formStatus === "success" && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  {formMessage}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@mail.ru"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Сообщение <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ваше сообщение..."
                  required
                />
              </div>

              <SubmitButton />
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-white rounded-lg shadow-lg p-0 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 w-full h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2243.0379302573!2d49.12046491187814!3d55.78670417243809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x415ead19bcfe97c3%3A0xba2b70d19b0b19b6!2z0JzQsNC90LXQeiDQkdCw0YEx!5e0!3m2!1sru!2sru!4v1612345678901!5m2!1sru!2sru"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

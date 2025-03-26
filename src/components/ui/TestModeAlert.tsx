"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TestModeAlertProps {
  onClose: () => void;
  phone: string;
  telegram: string;
}

const TestModeAlert: React.FC<TestModeAlertProps> = ({
  onClose,
  phone,
  telegram,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Закрыть"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <div className="bg-yellow-100 rounded-full p-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Тестовый режим работы
          </h2>

          <p className="text-gray-600 mb-4 text-center">
            Сайт находится в тестовом режиме. В настоящее время заказы через
            сайт не принимаются.
          </p>

          <p className="text-gray-600 mb-6 text-center font-medium">
            Для оформления заказа, пожалуйста, свяжитесь с нами:
          </p>

          <div className="space-y-2 mb-6 text-center">
            <a
              href={`tel:${phone}`}
              className="text-blue-600 hover:text-blue-800 block"
            >
              {phone}
            </a>
            <a
              href={`${telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.95 8.12c-.14 1.35-.63 4.58-1.12 8.01-.23 1.58-.75 2.11-1.23 2.16-.7.09-1.37-.46-2.46-1.12-1.37-.82-2.14-1.33-3.47-2.11-1.47-.86-.5-1.35.33-2.11.22-.2 3.89-3.58 3.96-3.89.01-.03.01-.19-.07-.27-.08-.08-.2-.05-.29-.03-.13.03-2.24 1.42-6.36 4.17-.6.41-1.14.61-1.62.6-.53-.02-1.57-.3-2.33-.54-.94-.31-1.67-.47-1.61-.99.03-.27.31-.54.84-.82 3.31-1.53 5.51-2.53 6.61-3 3.15-1.35 3.81-1.58 4.24-1.59.1 0 .31.02.45.14.12.1.15.23.17.33.02.14.01.59-.01.59z" />
              </svg>
              Telegram
            </a>
          </div>

          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestModeAlert;

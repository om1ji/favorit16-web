"use client";

import React from "react";
import { useContactInfo } from "@/hooks/useConfig";
import {
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

interface ContactInfoProps {
  className?: string;
  showIcons?: boolean;
  variant?: "default" | "compact" | "footer";
}

export default function ContactInfo({
  className = "",
  showIcons = true,
  variant = "default",
}: ContactInfoProps) {
  const { data: contactInfo, loading, error } = useContactInfo();

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 rounded animate-pulse w-40"
          ></div>
        ))}
      </div>
    );
  }

  if (error || !contactInfo) {
    console.error("Contact info error:", error);
    return null;
  }

  // Рендер для футера
  if (variant === "footer") {
    return (
      <ul className={`space-y-2 text-text-lighter ${className}`}>
        <li className="flex items-center">
          {showIcons && <PhoneIcon className="h-4 w-4 mr-2" />}
          <a href={`tel:${contactInfo.phone}`}>
            <span>{contactInfo.phone}</span>
          </a>
        </li>
        <li className="flex items-center">
          {showIcons && <EnvelopeIcon className="h-4 w-4 mr-2" />}
          <a href={`mailto:${contactInfo.email}`}>
            <span>{contactInfo.email}</span>
          </a>
        </li>
      </ul>
    );
  }

  // Рендер для компактного варианта
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center space-x-3">
          {showIcons && <PhoneIcon className="h-4 w-4" />}
          <a href={`tel:${contactInfo.phone}`}>
            <span className="font-medium">{contactInfo.phone}</span>
          </a>
          <span className="text-gray-300">|</span>
          {showIcons && <EnvelopeIcon className="h-4 w-4" />}
          <a href={`mailto:${contactInfo.email}`}>
            <span>{contactInfo.email}</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-start">
        {showIcons && <PhoneIcon className="h-6 w-6 text-blue-600 mt-1 mr-4" />}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Телефон</h3>
          <a href={`tel:${contactInfo.phone}`}>
            <p className="text-gray-600 mt-1">{contactInfo.phone}</p>
          </a>
          <p className="text-sm text-gray-500 mt-1">
            {contactInfo.workingHours.weekdays}
            <br />
            {contactInfo.workingHours.weekend}
          </p>
        </div>
      </div>

      <div className="flex items-start">
        {showIcons && (
          <EnvelopeIcon className="h-6 w-6 text-blue-600 mt-1 mr-4" />
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Email</h3>
          <a href={`mailto:${contactInfo.email}`}>
            <p className="text-gray-600 mt-1">{contactInfo.email}</p>
          </a>
        </div>
      </div>
    </div>
  );
}

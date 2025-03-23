'use client';

import React from 'react';
import { useContactInfo } from '@/hooks/useConfig';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ContactInfoProps {
  className?: string;
  showIcons?: boolean;
  variant?: 'default' | 'compact' | 'footer';
}

export default function ContactInfo({ 
  className = '', 
  showIcons = true,
  variant = 'default'
}: ContactInfoProps) {
  const { data: contactInfo, loading, error } = useContactInfo();
  
  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
        ))}
      </div>
    );
  }
  
  if (error || !contactInfo) {
    console.error('Contact info error:', error);
    return null;
  }
  
  // Рендер для футера
  if (variant === 'footer') {
    return (
      <ul className={`space-y-2 text-text-lighter ${className}`}>
        <li className="flex items-center">
          {showIcons && <PhoneIcon className="h-4 w-4 mr-2" />}
          <span>{contactInfo.phone}</span>
        </li>
        <li className="flex items-center">
          {showIcons && <EnvelopeIcon className="h-4 w-4 mr-2" />}
          <span>{contactInfo.email}</span>
        </li>
        <li className="flex items-center">
          {showIcons && <MapPinIcon className="h-4 w-4 mr-2" />}
          <span>{contactInfo.address}</span>
        </li>
      </ul>
    );
  }
  
  // Рендер для компактного варианта
  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center space-x-3">
          {showIcons && <PhoneIcon className="h-4 w-4" />}
          <span className="font-medium">{contactInfo.phone}</span>
          <span className="text-gray-300">|</span>
          {showIcons && <EnvelopeIcon className="h-4 w-4" />}
          <span>{contactInfo.email}</span>
        </div>
      </div>
    );
  }
  
  // Рендер для обычного варианта
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-start">
        {showIcons && <PhoneIcon className="h-6 w-6 text-blue-600 mt-1 mr-4" />}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Телефон</h3>
          <p className="text-gray-600 mt-1">{contactInfo.phone}</p>
          <p className="text-sm text-gray-500 mt-1">
            {contactInfo.workingHours.weekdays}<br />
            {contactInfo.workingHours.weekend}
          </p>
        </div>
      </div>
      
      <div className="flex items-start">
        {showIcons && <EnvelopeIcon className="h-6 w-6 text-blue-600 mt-1 mr-4" />}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Email</h3>
          <p className="text-gray-600 mt-1">{contactInfo.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            Мы отвечаем на письма в течение 24 часов
          </p>
        </div>
      </div>
      
      <div className="flex items-start">
        {showIcons && <MapPinIcon className="h-6 w-6 text-blue-600 mt-1 mr-4" />}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Адрес</h3>
          <p className="text-gray-600 mt-1">{contactInfo.address}</p>
          <p className="text-sm text-gray-500 mt-1">
            Вход со стороны главной улицы
          </p>
        </div>
      </div>
    </div>
  );
} 
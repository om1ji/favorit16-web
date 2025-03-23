'use client';

import React from 'react';
import { useSocialMedia } from '@/hooks/useConfig';
import { FaInstagram, FaTelegram, FaWhatsapp, FaFacebookF, FaTwitter, FaYoutube, FaVk } from 'react-icons/fa';

// Маппинг названий иконок к компонентам
const iconMap: Record<string, React.ElementType> = {
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaVk
};

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

export default function SocialLinks({ className = '', iconClassName = 'h-6 w-6' }: SocialLinksProps) {
  const { data: socialLinks, loading, error } = useSocialMedia();
  
  if (loading) {
    return (
      <div className={`flex space-x-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (error || !socialLinks) {
    console.error('Social links error:', error);
    return null;
  }
  
  return (
    <div className={`flex space-x-4 ${className}`}>
      {socialLinks.map(social => {
        const IconComponent = iconMap[social.icon];
        
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 hover:bg-blue-50 p-3 rounded-full text-blue-600 transition duration-300"
            aria-label={social.name}
          >
            {IconComponent ? <IconComponent className={iconClassName} /> : null}
          </a>
        );
      })}
    </div>
  );
} 
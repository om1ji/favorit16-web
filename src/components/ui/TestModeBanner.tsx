"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import "./TestModeBanner.scss";

interface TestModeBannerProps {
  text?: string;
  permanentDisplay?: boolean; // Если true, будет игнорировать проверку на админку
  additionalClasses?: string; // Дополнительные CSS классы
}

const TestModeBanner: React.FC<TestModeBannerProps> = ({
  text = "Сайт работает в тестовом режиме! Заказы принимаются только по телефону или в Telegram.",
  permanentDisplay = false,
  additionalClasses = "",
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Check if we're in the admin panel
  const isAdminPanel = pathname.startsWith('/admin');
  
  // If in admin panel and not forced to display, don't render the banner
  if (isAdminPanel && !permanentDisplay) {
    return null;
  }

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // Дублируем текст для создания эффекта непрерывной прокрутки
    const content = banner.querySelector(".banner-content");
    if (!content) return;

    // Проверяем, достаточно ли текста для анимации
    const wrapper = banner.querySelector(".banner-wrapper");
    if (!wrapper) return;

    const contentWidth = content.clientWidth;
    const wrapperWidth = wrapper.clientWidth;

    // Если контент короче чем контейнер, дублируем его для плавной прокрутки
    if (contentWidth < wrapperWidth * 2) {
      const cloneCount = Math.ceil((wrapperWidth * 2) / contentWidth);
      for (let i = 0; i < cloneCount; i++) {
        const clone = content.cloneNode(true);
        wrapper.appendChild(clone);
      }
    }
  }, [text]);

  return (
    <div className={`test-mode-banner ${additionalClasses}`} ref={bannerRef}>
      <div className="banner-wrapper">
        <div className="banner-content">{text}</div>
      </div>
    </div>
  );
};

export default TestModeBanner;

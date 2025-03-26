"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./TestModeBanner.scss";
import Marquee from "react-fast-marquee";

interface TestModeBannerProps {
  text?: string;
  permanentDisplay?: boolean; // Если true, будет игнорировать проверку на админку
  additionalClasses?: string; // Дополнительные CSS классы
}

const TestModeBanner: React.FC<TestModeBannerProps> = ({
  text = "Тестовый режим работы! Заказы временно не принимаются.",
  permanentDisplay = false,
  additionalClasses = "",
}) => {
  const [animate, setAnimate] = useState(true);
  const pathname = usePathname();
  const isAdminPanel = pathname.startsWith('/admin');

  // Always call hooks at the top level, before any conditional returns
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimate((prev) => !prev);
    }, 15000);

    return () => {
      clearInterval(timer);
    };
  }, [text]);

  // Skip rendering for admin panel unless permanentDisplay is true
  if (isAdminPanel && !permanentDisplay) {
    return null;
  }

  // Define scrollText outside conditional rendering
  const scrollText = `${text} ${text}`;

  return (
    <Marquee
        className={`bg-blue-100 text-blue-600 py-2 overflow-hidden relative border-2 border-red-400 ${additionalClasses}`}
        style={{
          zIndex: 1000,
        }}
    >
        {scrollText}
    </Marquee>
  );
};

export default TestModeBanner;

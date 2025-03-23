"use client";

import React from "react";
import Link from "next/link";
import { useNavigation } from "@/hooks/useConfig";
import { NavigationItem } from "@/types/config";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

// Маппинг названий иконок к компонентам
const iconMap: Record<string, React.ElementType> = {
  HomeIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
  PhoneIcon,
};

interface NavigationProps {
  type?: "main" | "footer";
  className?: string;
  vertical?: boolean;
  showIcons?: boolean;
}

export default function Navigation({
  type = "main",
  className = "",
  vertical = false,
  showIcons = false,
}: NavigationProps) {
  const { data: items, loading, error } = useNavigation(type);
  const pathname = usePathname();

  if (loading) {
    return (
      <div
        className={`flex ${vertical ? "flex-col space-y-4" : "space-x-6"} ${className}`}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 rounded animate-pulse w-16"
          ></div>
        ))}
      </div>
    );
  }

  if (error || !items) {
    console.error("Navigation error:", error);
    return null;
  }

  const getIcon = (item: NavigationItem) => {
    if (!showIcons || !item.icon) return null;

    const IconComponent = iconMap[item.icon];
    return IconComponent ? <IconComponent className="h-5 w-5 mr-1" /> : null;
  };

  return (
    <nav
      className={`${vertical ? "flex flex-col space-y-4" : "flex space-x-6"} ${className}`}
    >
      {items.map((item) => {
        const isActive = pathname === item.url;

        return (
          <Link
            key={item.id}
            href={item.url}
            className={`flex items-center text-sm ${
              isActive
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-blue-600"
            } transition-colors`}
            target={item.isExternal ? "_blank" : undefined}
            rel={item.isExternal ? "noopener noreferrer" : undefined}
          >
            {getIcon(item)}
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

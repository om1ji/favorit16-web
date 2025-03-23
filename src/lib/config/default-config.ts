import { SiteConfig } from "@/types/config";

// Дефолтная конфигурация сайта
export const defaultConfig: SiteConfig = {
  siteName: "Favorit116",
  siteDescription: "Ваш надежный магазин автомобильных шин и аксессуаров",

  navigation: {
    main: [
      {
        id: "home",
        title: "Главная",
        url: "/",
        icon: "HomeIcon",
        order: 1,
        isActive: true,
      },
      {
        id: "catalog",
        title: "Каталог",
        url: "/catalog",
        icon: "ShoppingBagIcon",
        order: 2,
        isActive: true,
      },
      {
        id: "about",
        title: "О компании",
        url: "/about",
        icon: "InformationCircleIcon",
        order: 3,
        isActive: true,
      },
      {
        id: "contacts",
        title: "Контакты",
        url: "/contacts",
        icon: "PhoneIcon",
        order: 4,
        isActive: true,
      },
    ],
    footer: [
      {
        id: "home",
        title: "Главная",
        url: "/",
        order: 1,
        isActive: true,
      },
      {
        id: "catalog",
        title: "Каталог",
        url: "/catalog",
        order: 2,
        isActive: true,
      },
      {
        id: "about",
        title: "О компании",
        url: "/about",
        order: 3,
        isActive: true,
      },
      {
        id: "contacts",
        title: "Контакты",
        url: "/contacts",
        order: 4,
        isActive: true,
      },
    ],
  },

  social: {
    telegram: {
      id: "telegram",
      name: "Telegram",
      url: "https://t.me/Vladislav2998",
      icon: "FaTelegram",
    },
    whatsapp: {
      id: "whatsapp",
      name: "WhatsApp",
      url: "https://wa.me/79871890752",
      icon: "FaWhatsapp",
    },
  },

  contacts: {
    phone: "+7 (987) 189-07-52",
    email: "info@favorit-116.ru",
    workingHours: {
      weekdays: "Пн-Пт: 9:00 - 18:00",
      weekend: "Сб-Вс: 10:00 - 16:00",
    },
  },
};

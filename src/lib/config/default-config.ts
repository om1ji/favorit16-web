import { SiteConfig } from '@/types/config';

// Дефолтная конфигурация сайта
export const defaultConfig: SiteConfig = {
  siteName: 'DotStore',
  siteDescription: 'Ваш надежный магазин электроники и аксессуаров',
  
  navigation: {
    main: [
      {
        id: 'home',
        title: 'Главная',
        url: '/',
        icon: 'HomeIcon',
        order: 1,
        isActive: true
      },
      {
        id: 'catalog',
        title: 'Каталог',
        url: '/catalog',
        icon: 'ShoppingBagIcon',
        order: 2,
        isActive: true
      },
      {
        id: 'about',
        title: 'О компании',
        url: '/about',
        icon: 'InformationCircleIcon',
        order: 3,
        isActive: true
      },
      {
        id: 'contacts',
        title: 'Контакты',
        url: '/contacts',
        icon: 'PhoneIcon',
        order: 4,
        isActive: true
      }
    ],
    footer: [
      {
        id: 'home',
        title: 'Главная',
        url: '/',
        order: 1,
        isActive: true
      },
      {
        id: 'catalog',
        title: 'Каталог',
        url: '/catalog',
        order: 2,
        isActive: true
      },
      {
        id: 'about',
        title: 'О компании',
        url: '/about',
        order: 3,
        isActive: true
      },
      {
        id: 'contacts',
        title: 'Контакты',
        url: '/contacts',
        order: 4,
        isActive: true
      }
    ]
  },
  
  social: [
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: 'FaInstagram'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      url: 'https://telegram.org',
      icon: 'FaTelegram'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: 'https://whatsapp.com',
      icon: 'FaWhatsapp'
    }
  ],
  
  contacts: {
    phone: '+7 (987) 189-07-52',
    email: 'info@favorit-16.ru',
    address: 'г. Казань, ул. Петербургская, 9',
    workingHours: {
      weekdays: 'Пн-Пт: 9:00 - 18:00',
      weekend: 'Сб-Вс: 10:00 - 16:00'
    }
  }
}; 
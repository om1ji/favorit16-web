import {
  SiteConfig,
  NavigationItem,
  SocialMedia,
  ContactInfo,
} from "@/types/config";
import { defaultConfig } from "./default-config";

// Здесь будет загрузка конфигурации с сервера
// В реальном приложении это могут быть данные из БД
export async function getSiteConfig(): Promise<SiteConfig> {
  // Имитация задержки загрузки данных
  await new Promise((resolve) => setTimeout(resolve, 50));

  // В реальном приложении тут будет fetch к API бэкенда
  // return fetch('/api/config').then(res => res.json());

  return defaultConfig;
}

// Получить навигацию
export async function getNavigation(
  type: "main" | "footer" = "main",
): Promise<NavigationItem[]> {
  const config = await getSiteConfig();
  return config.navigation[type]
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);
}

// Получить соцсети
export async function getSocialMedia(): Promise<SocialMedia[]> {
  const config = await getSiteConfig();
  return config.social;
}

// Получить контактную информацию
export async function getContactInfo(): Promise<ContactInfo> {
  const config = await getSiteConfig();
  return config.contacts;
}

// Получить информацию о сайте
export async function getSiteInfo(): Promise<{
  siteName: string;
  siteDescription: string;
}> {
  const config = await getSiteConfig();
  return {
    siteName: config.siteName,
    siteDescription: config.siteDescription,
  };
}

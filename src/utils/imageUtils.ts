/**
 * Утилиты для работы с изображениями
 */

/**
 * Преобразует относительный путь изображения в полный URL
 * @param path Относительный путь к изображению
 * @returns Полный URL
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/images/placeholder.svg';
  
  // Если путь уже является абсолютным URL, возвращаем его как есть
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // В режиме разработки используем localhost, в продакшене - domain API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.favorit-116.ru';
  
  // Если путь не начинается с "/", добавляем его
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};

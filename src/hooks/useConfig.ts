'use client';

import { useState, useEffect } from 'react';
import { NavigationItem, SocialMedia, ContactInfo } from '@/types/config';

// Универсальный хук для получения конфигураций
export function useConfig<T>(
  section: 'navigation' | 'social' | 'contacts' | 'site',
  params: Record<string, string> = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Формируем URL с параметрами
        const queryParams = new URLSearchParams({ section, ...params });
        const response = await fetch(`/api/config?${queryParams}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${section}: ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(`Error fetching ${section}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [section, JSON.stringify(params)]);

  return { data, loading, error };
}

// Специализированные хуки для конкретных разделов конфигурации
export function useNavigation(type: 'main' | 'footer' = 'main') {
  return useConfig<NavigationItem[]>('navigation', { type });
}

export function useSocialMedia() {
  return useConfig<SocialMedia[]>('social');
}

export function useContactInfo() {
  return useConfig<ContactInfo>('contacts');
}

export function useSiteInfo() {
  return useConfig<{ siteName: string; siteDescription: string }>('site');
} 
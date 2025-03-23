export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isExternal?: boolean;
  children?: NavigationItem[];
  order: number;
  isActive: boolean;
}

export interface SocialMedia {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: {
    weekdays: string;
    weekend: string;
  };
}

export interface SiteConfig {
  navigation: {
    main: NavigationItem[];
    footer: NavigationItem[];
  };
  social: SocialMedia[];
  contacts: ContactInfo;
  siteName: string;
  siteDescription: string;
} 
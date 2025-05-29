export interface ProductImage {
  id: string;
  image: string;
  thumbnail: string;
  alt_text: string;
  is_feature: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string | null;
  parent: string | null;
  children: Category[];
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  category: Category;
  brand: Brand | null;
  images: ProductImage[];
  in_stock: boolean;
  quantity: number;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  has_discount: boolean;
  discount_percentage: number;

  // Common fields
  diameter: number | null;

  // Tire specific fields
  width: number | null;
  profile: number | null;
  tire_size: string | null;

  // Wheel specific fields
  wheel_width: number | null;
  et_offset: number | null;
  pcd: number | null;
  bolt_count: number | null;
  center_bore: number | null;
  wheel_size: string | null;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductsFilter {
  page?: number;
  page_size?: number;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;

  // Common filters
  diameter?: number;
  min_diameter?: number;
  max_diameter?: number;

  // Tire specific filters
  width?: number;
  min_width?: number;
  max_width?: number;
  profile?: number;
  min_profile?: number;
  max_profile?: number;

  // Wheel specific filters
  wheel_width?: number;
  min_wheel_width?: number;
  max_wheel_width?: number;
  et_offset?: number;
  min_et_offset?: number;
  max_et_offset?: number;
  pcd?: number;
  min_pcd?: number;
  max_pcd?: number;
  bolt_count?: number;
  center_bore?: number;
  min_center_bore?: number;
  max_center_bore?: number;

  search?: string;
  ordering?: string;
}

export interface AdminProduct extends Product {
  images: ProductImage[];
  updated_at: string;
  total_orders: number;
  total_revenue: number;
  last_ordered_at: string | null;
  views_count: number;
}

export interface AdminProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminProduct[];
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface CategoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  is_available?: boolean;
  has_discount?: boolean;
  in_stock?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

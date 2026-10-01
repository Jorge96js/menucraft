export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  imageUrl: string | null;
  available: boolean;
  position: number;
}

export interface MenuSection {
  id: string;
  title: string;
  position: number;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  orderMessage: string;
  colorPrimary: string;
  colorBg: string;
  colorText: string | null;
  bannerUrl: string | null;
  sections: MenuSection[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  restaurantName: string;
  logoUrl: string | null;
  whatsappNumber: string;
  plan: PlanCode;
}

export type PlanCode = 'free' | 'basic' | 'premium';

export interface Plan {
  code: PlanCode;
  name: string;
  priceCents: number;
  maxMenus: number | null;
  maxItemsPerMenu: number;
  storageQuotaMb: number;
  features: PlanFeatures;
}

export interface PlanFeatures {
  removeBranding: boolean;
  analytics: boolean;
  qr: boolean;
  duplicateMenu: boolean;
  extraThemes: boolean;
  prioritySupport: boolean;
  banner: boolean;
  itemImages: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  menuId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

// Tipos globales del dominio

export interface Profile {
  id: string;
  userId: string;
  restaurantName: string;
  logoUrl: string | null;
  whatsapp: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: string;
  userId: string;
  name: string;
  slug: string;
  isActive: boolean;
  orderMessage: string;
  colorPrimary: string;
  colorBg: string;
  colorText: string | null;
  bannerUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  menuId: string;
  title: string;
  position: number;
  createdAt: string;
}

export interface Item {
  id: string;
  sectionId: string;
  name: string;
  description: string;
  price: number; // en centavos
  imageUrl: string | null;
  available: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

// Tipos compuestos para vistas
export interface MenuWithSections extends Menu {
  sections: SectionWithItems[];
}

export interface SectionWithItems extends Section {
  items: Item[];
}

// Auth
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

// Cart
export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  menuSlug: string | null;
}

// Save status
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Design defaults
export interface MenuDesignDefaults {
  colorPrimary: string;
  colorBg: string;
  colorText: null; // null = automático
  orderMessage: string;
}

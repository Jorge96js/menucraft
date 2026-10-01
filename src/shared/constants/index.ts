// Constantes globales de la aplicación

export const DEFAULT_COLORS = {
  primary: '#f97316',
  bg: '#ffffff',
  text: null as string | null, // null = automático
} as const;

export const DEFAULT_ORDER_MESSAGE = 'Hola, me gustaría encargar: {items}. Total: {total}';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2 MB
export const MAX_IMAGE_WIDTH = 1200; // px
export const MAX_BANNER_WIDTH = 1600; // px
export const RECOMMENDED_BANNER_HEIGHT = 500; // px

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const ITEM_NAME_MAX_LENGTH = 80;
export const ITEM_DESC_MAX_LENGTH = 300;
export const SECTION_TITLE_MAX_LENGTH = 50;
export const MENU_NAME_MAX_LENGTH = 100;
export const SLUG_MAX_LENGTH = 50;

export const AUTOSAVE_DEBOUNCE_MS = 1000;

export const WHATSAPP_MIN_DIGITS = 8;
export const WHATSAPP_MAX_DIGITS = 15;

export const SUGGESTED_COLORS = [
  '#f97316', // orange
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
  '#1f2937', // dark gray
  '#000000', // black
] as const;

export const STORAGE_KEYS = {
  auth: 'menucraft_auth',
  profiles: 'menucraft_profiles',
  menus: 'menucraft_menus',
  sections: 'menucraft_sections',
  items: 'menucraft_items',
  images: 'menucraft_images',
  cart: 'menucraft_cart',
} as const;

import { z } from 'zod';
import {
  ITEM_NAME_MAX_LENGTH,
  ITEM_DESC_MAX_LENGTH,
  SECTION_TITLE_MAX_LENGTH,
  MENU_NAME_MAX_LENGTH,
  WHATSAPP_MIN_DIGITS,
  WHATSAPP_MAX_DIGITS,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MAX_LOGO_SIZE,
} from '../../shared/constants';

// Hex color: #RRGGBB
export const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido. Formato: #RRGGBB');

// Slug: lowercase, digits, hyphens, 3-50 chars
export const slugSchema = z
  .string()
  .min(3, 'Mínimo 3 caracteres')
  .max(50, 'Máximo 50 caracteres')
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Solo letras minúsculas, números y guiones');

// WhatsApp: 8-15 digits (international format, no + or spaces)
export const whatsappSchema = z
  .string()
  .regex(
    new RegExp(`^[0-9]{${WHATSAPP_MIN_DIGITS},${WHATSAPP_MAX_DIGITS}}$`),
    `Número inválido. Ingresá ${WHATSAPP_MIN_DIGITS}-${WHATSAPP_MAX_DIGITS} dígitos sin espacios ni símbolos`
  );

// Item name: 1-80 chars, no HTML
export const itemNameSchema = z
  .string()
  .min(1, 'El nombre es obligatorio')
  .max(ITEM_NAME_MAX_LENGTH, `Máximo ${ITEM_NAME_MAX_LENGTH} caracteres`);

// Item description: optional, max 300 chars
export const itemDescSchema = z
  .string()
  .max(ITEM_DESC_MAX_LENGTH, `Máximo ${ITEM_DESC_MAX_LENGTH} caracteres`)
  .nullable();

// Price: positive number, in cents (integer)
export const priceSchema = z
  .number()
  .int('El precio debe ser un número entero (centavos)')
  .min(0, 'El precio no puede ser negativo')
  .max(999999999, 'Precio demasiado alto');

// Section title: 1-50 chars
export const sectionTitleSchema = z
  .string()
  .min(1, 'El título es obligatorio')
  .max(SECTION_TITLE_MAX_LENGTH, `Máximo ${SECTION_TITLE_MAX_LENGTH} caracteres`);

// Menu name: 1-100 chars
export const menuNameSchema = z
  .string()
  .min(1, 'El nombre es obligatorio')
  .max(MENU_NAME_MAX_LENGTH, `Máximo ${MENU_NAME_MAX_LENGTH} caracteres`);

// Order message: supports variables {items} and {total}
export const orderMessageSchema = z
  .string()
  .min(1, 'El mensaje no puede estar vacío')
  .max(500, 'Máximo 500 caracteres');

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  restaurantName: z
    .string()
    .min(1, 'Nombre del local obligatorio')
    .max(100, 'Máximo 100 caracteres'),
});

// Profile schema
export const profileSchema = z.object({
  restaurantName: z
    .string()
    .min(1, 'Nombre del local obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  whatsapp: z
    .string()
    .regex(
      new RegExp(`^[0-9]{${WHATSAPP_MIN_DIGITS},${WHATSAPP_MAX_DIGITS}}$`),
      `Ingresá ${WHATSAPP_MIN_DIGITS}-${WHATSAPP_MAX_DIGITS} dígitos sin espacios`
    )
    .nullable(),
});

// File validation schemas
const imageTypes = [...ALLOWED_IMAGE_TYPES] as [string, ...string[]];

export const imageFileSchema = z.object({
  type: z.string().refine(
    (val) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(val),
    'Formato no permitido. Usá JPG, PNG o WebP'
  ),
  size: z
    .number()
    .max(MAX_FILE_SIZE, `Tamaño máximo: ${MAX_FILE_SIZE / (1024 * 1024)} MB`),
});

export const logoFileSchema = z.object({
  type: z.string().refine(
    (val) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(val),
    'Formato no permitido. Usá JPG, PNG o WebP'
  ),
  size: z
    .number()
    .max(MAX_LOGO_SIZE, `Tamaño máximo: ${MAX_LOGO_SIZE / (1024 * 1024)} MB`),
});

// Menu design schema
export const menuDesignSchema = z.object({
  colorPrimary: hexColorSchema,
  colorBg: hexColorSchema,
  colorText: hexColorSchema.nullable(),
  bannerUrl: z.string().url().nullable(),
});

// Full menu create schema
export const menuCreateSchema = z.object({
  name: menuNameSchema,
  slug: slugSchema.optional(), // auto-generated if not provided
});

// Item create/update schema
export const itemSchema = z.object({
  name: itemNameSchema,
  description: itemDescSchema,
  price: priceSchema,
  available: z.boolean().default(true),
});

// Section create/update schema
export const sectionSchema = z.object({
  title: sectionTitleSchema,
});

// Type exports for use in components
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type MenuCreateInput = z.infer<typeof menuCreateSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type MenuDesignInput = z.infer<typeof menuDesignSchema>;

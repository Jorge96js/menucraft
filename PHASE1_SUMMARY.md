# Fase 1: Arquitectura - Resumen de Entregables

## ✅ Completado

### 1. Estructura de Carpetas (Feature-Based)
```
src/
├── shared/
│   ├── components/     → Button, Input, TextArea, Modal, Toast, LoadingSpinner, EmptyState
│   ├── hooks/          → useDebounce, useClickOutside, useLocalStorage, useCopyToClipboard, useIsMobile, useToast
│   ├── utils/          → formatPrice, slugify, generateId, sanitizeText, trimForSave, colorUtils, buildWhatsAppMessage
│   ├── constants/      → DEFAULT_COLORS, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, STORAGE_KEYS, etc.
│   └── types/          → Profile, Menu, Section, Item, CartItem, AuthUser, etc.
├── lib/
│   ├── db/client.ts    → CRUD operations (auth, profileDb, menusDb, sectionsDb, itemsDb)
│   ├── storage/
│   │   ├── localStorage.ts  → StorageCollection<T> genérico
│   │   └── imageStorage.ts  → uploadImage, compressImage, deleteImage, replaceImage
│   └── validators/     → Schemas Zod (hexColor, slug, whatsapp, itemName, price, etc.)
└── features/           → (preparado para las siguientes fases)
    ├── auth/
    ├── dashboard/
    ├── editor/
    ├── design/
    ├── public-menu/
    └── profile/
```

### 2. Esquema de Base de Datos

| Tabla | Campos Clave | Constraints |
|-------|-------------|-------------|
| `profiles` | id, user_id, restaurant_name, logo_url, whatsapp | whatsapp regex, FK cascade |
| `menus` | id, user_id, name, slug, colors, banner_url, order_message | slug UNIQUE, hex colors regex, FK cascade |
| `sections` | id, menu_id, title, position | UNIQUE(menu_id, position), FK cascade |
| `items` | id, section_id, name(80), description(300), price, image_url, available, position | UNIQUE(section_id, position), FK cascade |

**Índices:**
- `idx_menus_user_id`, `idx_menus_slug`, `idx_menus_active`
- `idx_sections_menu_id`, `idx_sections_position`
- `idx_items_section_id`, `idx_items_available`, `idx_items_position`

### 3. Buckets de Storage

| Bucket | Propósito | Tamaño Máx | Políticas |
|--------|-----------|-----------|-----------|
| `item-images` | Imágenes de artículos | 5 MB | Lectura pública, escritura solo dueño |
| `menu-banners` | Banners de menús | 5 MB | Lectura pública, escritura solo dueño |
| `logos` | Logo del local | 2 MB | Lectura pública, escritura solo dueño |

### 4. Rutas

| Ruta | Protección | Descripción |
|------|-----------|-------------|
| `/` | Pública | Landing page |
| `/login` | Pública | Login |
| `/register` | Pública | Registro |
| `/dashboard` | 🔒 Auth | Panel del local |
| `/dashboard/profile` | 🔒 Auth | Configuración |
| `/editor/:menuId` | 🔒 Auth + Owner | Editor DnD |
| `/m/:slug` | Pública | Menú público |

### 5. Endpoints/Operaciones

**Auth:** register, login, logout, getSession
**Profile:** get, update, uploadLogo
**Menus:** list, get, getBySlug, create, update, delete, duplicate
**Sections:** list, create, update, delete, reorder
**Items:** list, create, update, delete, reorder, move, uploadImage, deleteImage
**Storage:** upload, delete, getUrl

### 6. Schemas de Validación (Zod)

- `hexColorSchema` → /^#[0-9A-Fa-f]{6}$/
- `slugSchema` → lowercase + guiones, 3-50 chars
- `whatsappSchema` → 8-15 dígitos
- `itemNameSchema` → 1-80 chars
- `itemDescSchema` → max 300 chars
- `priceSchema` → integer >= 0
- `loginSchema`, `registerSchema`, `profileSchema`
- `imageFileSchema`, `logoFileSchema` → MIME + size

### 7. Utilidades Implementadas

- **formatPrice(cents)** → "$3.500"
- **slugify(text)** → URL-friendly
- **sanitizeText(text)** → NFC + strip HTML + control chars
- **trimForSave(text)** → trim extremos + colapsar espacios internos
- **getContrastRatio(hex1, hex2)** → WCAG 2.0
- **getAutoTextColor(bgHex)** → negro/blanco según fondo
- **meetsWcagAA(text, bg)** → check 4.5:1
- **validateMimeType(file)** → magic bytes
- **generateFilename(file)** → UUID + extensión
- **buildWhatsAppMessage(template, items, total)** → reemplaza {items} y {total}
- **buildWhatsAppUrl(phone, message)** → wa.me link

### 8. Componentes UI Base

- `Button` (primary, secondary, ghost, danger + sizes + loading)
- `Input` (label, error, hint)
- `TextArea` (label, error, hint, maxLength, showCount)
- `Modal` (sizes, closeOnOverlay, Escape key)
- `Toast` (success, error, info)
- `LoadingSpinner` + `LoadingPage`
- `EmptyState` (icon, title, description, action)

### 9. Capa de Datos Simulada

- `StorageCollection<T>` → CRUD genérico sobre localStorage
- `auth` → register, login, logout, getSession
- `profileDb` → getByUserId, update
- `menusDb` → list, get, getBySlug, create, update, delete, duplicate
- `sectionsDb` → list, create, update, delete, reorder
- `itemsDb` → list, create, update, delete, reorder, move
- `getMenuWithSections(menuId)` → query completa
- `getPublicMenuBySlug(slug)` → query pública (solo activos)

### 10. Image Storage Simulado

- `compressImage(file, maxWidth)` → redimensiona + convierte a WebP
- `uploadImage(bucket, userId, file, onProgress)` → valida + comprime + guarda
- `getImageUrl(storageUrl)` → convierte storage:// a data URL
- `deleteImage(storageUrl)` → elimina del store
- `replaceImage(bucket, userId, oldUrl, newFile)` → delete + upload

---

## 📋 Cómo Probar

La Fase 1 es **arquitectura e infraestructura**. No hay UI nueva que probar visualmente.

Para verificar que todo funciona:
```bash
npm run build
```

El build debe completar sin errores. ✅

Las páginas existentes (Landing, Dashboard, Editor, PublicMenu, Pricing, Admin) siguen funcionando como antes y serán reemplazadas progresivamente en las fases siguientes.

---

## 🚀 Siguiente Paso: Fase 2

**Autenticación + Panel del Local + Perfil**

Se implementará:
1. Página de login con email/contraseña
2. Página de registro
3. Rutas protegidas (redirect a /login si no autenticado)
4. Dashboard con listado de menús (CRUD)
5. Perfil del local (nombre, logo, WhatsApp)
6. Validación de WhatsApp en formato internacional

Decí **"continuar"** para avanzar.

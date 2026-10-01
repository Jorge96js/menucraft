# MenuCraft - Arquitectura (Fase 1)

## Stack Final

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | React 18 + Vite + TypeScript | Entorno pre-configurado |
| Estilos | Tailwind CSS v4 | Ya instalado, utility-first |
| DnD | @dnd-kit/core + sortable | Accesible, liviano, mantenido |
| Estado | Zustand + localStorage | Persistencia sin backend |
| Validación | Zod | Tipado runtime, schemas reutilizables |
| Iconos | lucide-react | Tree-shakeable, consistente |
| Animaciones | framer-motion | Declarativo, performante |

## Estructura de Carpetas

```
src/
├── app/                      # Routing y layout principal
│   ├── App.tsx               # Entry point con router
│   ├── routes/               # Definición de rutas
│   └── providers/            # Context providers globales
│
├── features/                 # Módulos por dominio (feature-based)
│   ├── auth/                 # Autenticación
│   │   ├── components/       # LoginForm, RegisterForm
│   │   ├── hooks/            # useAuth
│   │   ├── stores/           # authStore (Zustand)
│   │   ├── schemas/          # loginSchema, registerSchema (Zod)
│   │   ├── pages/            # LoginPage, RegisterPage
│   │   └── index.ts          # Public API
│   │
│   ├── dashboard/            # Panel del local
│   │   ├── components/       # MenuCard, EmptyState, StatsBar
│   │   ├── hooks/            # useMenus
│   │   ├── stores/           # menuStore (Zustand)
│   │   ├── schemas/          # menuSchema, profileSchema
│   │   ├── pages/            # DashboardPage
│   │   └── index.ts
│   │
│   ├── editor/               # Editor de menú (DnD)
│   │   ├── components/       # 
│   │   │   ├── SectionBlock.tsx
│   │   │   ├── ItemBlock.tsx
│   │   │   ├── TextBlock.tsx
│   │   │   ├── MessageBlock.tsx
│   │   │   ├── ItemModal.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── SaveStatus.tsx
│   │   │   └── PreviewToggle.tsx
│   │   ├── hooks/            # useDragDrop, useAutoSave
│   │   ├── stores/           # editorStore
│   │   ├── schemas/          # itemSchema, sectionSchema
│   │   ├── utils/            # imageCompression, textSanitizer
│   │   ├── pages/            # EditorPage
│   │   └── index.ts
│   │
│   ├── design/               # Personalización visual
│   │   ├── components/       # ColorPicker, BannerUploader, ContrastWarning
│   │   ├── hooks/            # useContrast, useCSSVariables
│   │   ├── utils/            # colorUtils (contrast ratio, auto text color)
│   │   └── index.ts
│   │
│   ├── public-menu/          # Vista pública del menú
│   │   ├── components/       # PublicMenuView, CartDrawer, CartBar, CartItem
│   │   ├── hooks/            # useCart, useWhatsApp
│   │   ├── stores/           # cartStore (Zustand + localStorage)
│   │   ├── schemas/          # cartItemSchema
│   │   └── index.ts
│   │
│   └── profile/              # Perfil del local
│       ├── components/       # ProfileForm, LogoUploader, WhatsAppInput
│       ├── schemas/          # profileSchema (con validación WhatsApp)
│       └── index.ts
│
├── shared/                   # Código compartido entre features
│   ├── components/           # UI reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── TextArea.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── hooks/                # useDebounce, useLocalStorage, useClickOutside
│   ├── utils/                # formatPrice, slugify, validators
│   ├── constants/            # DEFAULT_COLORS, MAX_FILE_SIZE, etc.
│   └── types/                # Tipos globales compartidos
│
├── lib/                      # Servicios y infraestructura
│   ├── storage/              # Abstracción de storage (localStorage + simulación S3)
│   │   ├── localStorage.ts   # Wrapper tipado para localStorage
│   │   └── imageStorage.ts   # Simula upload a bucket (base64 en localStorage)
│   ├── db/                   # Simula queries a PostgreSQL
│   │   └── client.ts         # CRUD operations sobre localStorage
│   └── validators/           # Schemas Zod compartidos
│       ├── hex-color.ts
│       ├── phone.ts
│       └── file.ts
│
├── styles/
│   └── index.css             # Tailwind + custom properties
│
└── main.tsx                  # Bootstrap
```

## Esquema de Base de Datos

### Tabla: `profiles`
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    whatsapp VARCHAR(15),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_whatsapp CHECK (whatsapp ~ '^[0-9]{8,15}$')
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
```

### Tabla: `menus`
```sql
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    order_message TEXT NOT NULL DEFAULT 'Hola, me gustaría encargar: {items}. Total: {total}',
    color_primary VARCHAR(7) NOT NULL DEFAULT '#f97316',
    color_bg VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    color_text VARCHAR(7),  -- NULL = automático por contraste
    banner_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,48}[a-z0-9]$'),
    CONSTRAINT valid_hex_primary CHECK (color_primary ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT valid_hex_bg CHECK (color_bg ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT valid_hex_text CHECK (color_text IS NULL OR color_text ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE INDEX idx_menus_user_id ON menus(user_id);
CREATE INDEX idx_menus_slug ON menus(slug);
CREATE INDEX idx_menus_active ON menus(is_active) WHERE is_active = true;
```

### Tabla: `sections`
```sql
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT unique_position_per_menu UNIQUE (menu_id, position)
);

CREATE INDEX idx_sections_menu_id ON sections(menu_id);
CREATE INDEX idx_sections_position ON sections(menu_id, position);
```

### Tabla: `items`
```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    description TEXT CHECK (char_length(description) <= 300),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    available BOOLEAN NOT NULL DEFAULT true,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT unique_position_per_section UNIQUE (section_id, position)
);

CREATE INDEX idx_items_section_id ON items(section_id);
CREATE INDEX idx_items_available ON items(available) WHERE available = true;
CREATE INDEX idx_items_position ON items(section_id, position);
```

### Relaciones (diagrama)
```
auth.users (1) ──── (1) profiles
     │
     └──── (N) menus ──── (N) sections ──── (N) items
                │
                └── slug UNIQUE
```

## Buckets de Storage (Supabase Storage)

### Bucket: `item-images`
- **Propósito:** Imágenes de artículos del menú
- **Acceso público:** Lectura (SELECT) para todos
- **Escritura:** Solo el dueño del menú (RLS policy)
- **Formatos:** JPG, PNG, WebP
- **Tamaño máx:** 5 MB
- **Ruta:** `{user_id}/{menu_id}/{item_id}.{ext}`
- **Política RLS:**
  ```sql
  -- SELECT: público
  CREATE POLICY "item_images_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'item-images');
  
  -- INSERT/UPDATE/DELETE: solo dueño
  CREATE POLICY "item_images_owner_write" ON storage.objects
    FOR ALL USING (
      bucket_id = 'item-images' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  ```

### Bucket: `menu-banners`
- **Propósito:** Banners de menús
- **Acceso público:** Lectura
- **Escritura:** Solo el dueño
- **Formatos:** JPG, PNG, WebP
- **Tamaño máx:** 5 MB (recomendado 1600x500)
- **Ruta:** `{user_id}/{menu_id}/banner.{ext}`
- **Política RLS:** Igual que item-images

### Bucket: `logos`
- **Propósito:** Logo del local
- **Acceso público:** Lectura
- **Escritura:** Solo el dueño
- **Formatos:** JPG, PNG, WebP
- **Tamaño máx:** 2 MB
- **Ruta:** `{user_id}/logo.{ext}`
- **Política RLS:** Igual que item-images

## Rutas de la Aplicación

| Ruta | Componente | Protección | Descripción |
|------|-----------|-----------|-------------|
| `/` | LandingPage | Pública | Página de inicio |
| `/login` | LoginPage | Pública | Inicio de sesión |
| `/register` | RegisterPage | Pública | Registro de usuario |
| `/dashboard` | DashboardPage | 🔒 Auth | Listado de menús |
| `/dashboard/profile` | ProfilePage | 🔒 Auth | Configuración del local |
| `/editor/:menuId` | EditorPage | 🔒 Auth + Owner | Editor DnD del menú |
| `/m/:slug` | PublicMenuPage | Pública | Vista pública del menú |

## Endpoints / Operaciones de Datos

### Auth
| Operación | Método | Descripción |
|-----------|--------|-------------|
| `auth.register(email, password)` | POST | Crear cuenta + perfil vacío |
| `auth.login(email, password)` | POST | Iniciar sesión |
| `auth.logout()` | POST | Cerrar sesión |
| `auth.getSession()` | GET | Obtener sesión actual |

### Profile
| Operación | Método | Descripción |
|-----------|--------|-------------|
| `profile.get(userId)` | GET | Obtener perfil del usuario |
| `profile.update(userId, data)` | PATCH | Actualizar nombre, logo, WhatsApp |
| `profile.uploadLogo(userId, file)` | POST | Subir/cambiar logo |

### Menus
| Operación | Método | Descripción |
|-----------|--------|-------------|
| `menus.list(userId)` | GET | Listar menús del usuario |
| `menus.get(menuId)` | GET | Obtener menú completo (con secciones e items) |
| `menus.getBySlug(slug)` | GET | Obtener menú público por slug |
| `menus.create(userId, data)` | POST | Crear nuevo menú |
| `menus.update(menuId, data)` | PATCH | Actualizar datos del menú |
| `menus.delete(menuId)` | DELETE | Eliminar menú (cascade sections + items) |
| `menus.duplicate(menuId)` | POST | Duplicar menú con nuevo slug |

### Sections
| Operación | Método | Descripción |
|-----------|--------|-------------|
| `sections.create(menuId, data)` | POST | Crear sección |
| `sections.update(sectionId, data)` | PATCH | Actualizar sección |
| `sections.delete(sectionId)` | DELETE | Eliminar sección + items |
| `sections.reorder(menuId, sectionIds[])` | PATCH | Reordenar secciones |

### Items
| Operación | Método | Descripción |
|-----------|--------|-------------|
| `items.create(sectionId, data)` | POST | Crear artículo |
| `items.update(itemId, data)` | PATCH | Actualizar artículo |
| `items.delete(itemId)` | DELETE | Eliminar artículo |
| `items.reorder(sectionId, itemIds[])` | PATCH | Reordenar artículos |
| `items.move(itemId, toSectionId)` | PATCH | Mover entre secciones |
| `items.uploadImage(itemId, file)` | POST | Subir imagen del artículo |
| `items.deleteImage(itemId)` | DELETE | Eliminar imagen del artículo |

### Storage
| Operación | Método | Descripción |
|-----------|--------|-------------|
| `storage.upload(bucket, path, file)` | POST | Subir archivo |
| `storage.delete(bucket, path)` | DELETE | Eliminar archivo |
| `storage.getUrl(bucket, path)` | GET | Obtener URL pública |

## Validaciones (Zod Schemas)

```typescript
// shared/schemas/
export const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color hex inválido');
export const slugSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{2,48}[a-z0-9]$/, 'Slug inválido');
export const whatsappSchema = z.string().regex(/^[0-9]{8,15}$/, 'WhatsApp inválido (8-15 dígitos)');
export const itemNameSchema = z.string().min(1).max(80);
export const itemDescSchema = z.string().max(300);
export const priceSchema = z.number().min(0).max(9999999.99);
export const fileSchema = z.object({
  type: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  size: z.number().max(5 * 1024 * 1024),
});
```

## Seguridad

1. **RLS en todas las tablas:** Cada query filtra por `user_id = auth.uid()`
2. **Propiedad verificada:** El editor valida que el menú pertenezca al usuario
3. **Slug único:** Constraint en BD + verificación antes de crear
4. **Validación server-side:** Zod en cada operación de escritura
5. **Sanitización de texto:** Strip HTML tags, normalizar Unicode NFC
6. **MIME real:** Validar magic bytes de imágenes (no confiar en extensión)
7. **Nombres generados:** El servidor genera nombres de archivo (UUID), no usa el original
8. **XSS:** React escapa por defecto; no usar `dangerouslySetInnerHTML`
9. **Campos de texto:** Sin trim en onChange; solo trim en submit (extremos)

## Accesibilidad

1. **DnD con teclado:** KeyboardSensor configurado para ignorar inputs/textareas
2. **Foco visible:** Ring de foco en todos los elementos interactivos
3. **Contraste:** Aviso WCAG AA (4.5:1) cuando el contraste texto/fondo es insuficiente
4. **Alt en imágenes:** Nombre del artículo como texto alternativo
5. **ARIA labels:** En botones de acción sin texto visible
6. **Live regions:** Anunciar cambios de estado (guardando, guardado, error)

## Rendimiento

1. **Actualizaciones optimistas:** UI se actualiza antes de confirmar en storage
2. **Imágenes lazy:** `loading="lazy"` en todas las imágenes del menú público
3. **Compresión cliente:** Redimensionar a 1200px antes de subir
4. **Debounce en autoguardado:** 1 segundo después del último cambio
5. **Sin recargas:** SPA con transiciones suaves

## Decisiones de Diseño

| Decisión | Elección | Razón |
|----------|----------|-------|
| IDs | UUID v4 | No exponer secuencia, seguro en URLs |
| Precios | Centavos (enteros) | Evitar errores de punto flotante |
| Colores | Hex 6 dígitos | Estándar web, fácil de validar |
| Slugs | lowercase + guiones | URL-friendly, legible |
| Imágenes | WebP comprimido | Mejor ratio calidad/tamaño |
| Estado carrito | Zustand + localStorage | Persiste entre sesiones |
| Autoguardado | 1s debounce | Balance entre UX y performance |

---

**Fase 1 completada.** Lista de entregables:
- ✅ Estructura de carpetas definida (feature-based)
- ✅ Esquema de BD completo (5 tablas + índices + constraints)
- ✅ Buckets de storage con políticas RLS
- ✅ Rutas de la aplicación definidas
- ✅ Endpoints/operaciones de datos listados
- ✅ Schemas de validación (Zod)
- ✅ Políticas de seguridad documentadas
- ✅ Decisiones de accesibilidad y rendimiento

**Para probar:** Esta fase es documentación. No hay código ejecutable aún.

Decí **"continuar"** para avanzar a la Fase 2: Autenticación + Panel del local + Perfil.

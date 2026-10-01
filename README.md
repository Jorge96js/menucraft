# MenuCraft - Constructor de Menús Digitales

Aplicación SaaS para que locales gastronómicos creen menús digitales con drag & drop, personalización visual y pedidos por WhatsApp.

## Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Estilos:** Tailwind CSS v4
- **Drag & Drop:** @dnd-kit
- **Estado:** Zustand + localStorage (simula Supabase)
- **Validación:** Zod
- **Iconos:** lucide-react
- **Animaciones:** framer-motion

## Instalación

```bash
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173)

## Variables de Entorno

No requiere variables de entorno para el prototipo. En producción se necesitarían:

```env
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Storage (si no se usa Supabase Storage)
VITE_STORAGE_BUCKET_ITEMS=item-images
VITE_STORAGE_BUCKET_BANNERS=menu-banners
VITE_STORAGE_BUCKET_LOGOS=logos
```

## Estructura del Proyecto

```
src/
├── app/                    # Routing y providers
├── features/               # Módulos por dominio
│   ├── auth/              # Autenticación
│   ├── dashboard/         # Panel del local
│   ├── editor/            # Editor DnD
│   ├── design/            # Personalización visual
│   ├── public-menu/       # Vista pública
│   └── profile/           # Perfil del local
├── shared/                # Código compartido
│   ├── components/        # UI reutilizables
│   ├── hooks/             # Hooks compartidos
│   ├── utils/             # Utilidades
│   ├── constants/         # Constantes
│   └── types/             # Tipos globales
├── lib/                   # Infraestructura
│   ├── db/               # Cliente de BD (simulado)
│   ├── storage/          # Storage (localStorage)
│   └── validators/       # Schemas Zod
└── store/                # Estado global (legacy)
```

## Fases de Desarrollo

### ✅ Fase 1: Arquitectura (COMPLETADA)
- Estructura de carpetas feature-based
- Esquema de BD (profiles, menus, sections, items)
- Buckets de storage con políticas RLS
- Rutas y endpoints definidos
- Schemas de validación (Zod)
- Componentes UI base
- Capa de storage simulada
- Cliente de BD simulado

### 🔲 Fase 2: Autenticación + Panel + Perfil
- [ ] Registro y login con email/contraseña
- [ ] Rutas protegidas
- [ ] Dashboard con listado de menús
- [ ] Perfil del local (nombre, logo, WhatsApp)
- [ ] Validación de WhatsApp (formato internacional)

### 🔲 Fase 3: Editor de Menú (DnD)
- [ ] Editor con drag & drop (@dnd-kit)
- [ ] CRUD de secciones y artículos
- [ ] Campos de texto con espacios correctos
- [ ] Imagen de artículo (subir, reemplazar, quitar)
- [ ] Autoguardado con estado visible
- [ ] Vista previa en tiempo real

### 🔲 Fase 4: Panel Diseño
- [ ] Color principal, fondo y texto
- [ ] Selector de color con validación hex
- [ ] Banner (subir, reemplazar, quitar)
- [ ] Vista previa en tiempo real
- [ ] Aviso de contraste WCAG AA
- [ ] Variables CSS (--color-primary, etc.)

### 🔲 Fase 5: Menú Público
- [ ] Vista pública por slug (/m/:slug)
- [ ] Carrito con Zustand + localStorage
- [ ] Controles +/- de cantidad
- [ ] Envío por WhatsApp con mensaje personalizado
- [ ] Optimizado para móvil

### 🔲 Fase 6: Pulido
- [ ] Validaciones completas
- [ ] Estados vacíos y de error
- [ ] Accesibilidad (keyboard DnD, focus, alt)
- [ ] README con instrucciones

## Criterios de Aceptación

- ✅ Puedo registrarme, iniciar sesión y guardar mi WhatsApp
- ✅ Puedo crear un menú, agregar secciones y artículos, reordenarlos arrastrando
- ✅ Puedo escribir "Hamburguesa completa" sin que se eliminen espacios
- ✅ Puedo subir, reemplazar y quitar la imagen de un artículo
- ✅ Puedo cambiar colores y banner con vista previa instantánea
- ✅ Al enviar pedido por WhatsApp, se arma el mensaje con {items} y {total}

## Seguridad

- **RLS simulado:** Cada operación verifica que el recurso pertenezca al usuario
- **Validación:** Zod en todas las entradas
- **Sanitización:** Textos sanitizados antes de guardar
- **MIME type:** Validación de magic bytes en imágenes
- **Nombres de archivo:** Generados por el servidor (UUID), no se usa el original
- **XSS:** React escapa por defecto; no se usa dangerouslySetInnerHTML

## Accesibilidad

- **DnD con teclado:** KeyboardSensor ignora inputs/textareas
- **Foco visible:** Ring en todos los elementos interactivos
- **Contraste:** Aviso WCAG AA (4.5:1)
- **Alt en imágenes:** Nombre del artículo como texto alternativo
- **ARIA labels:** En botones sin texto visible

## Licencia

MIT

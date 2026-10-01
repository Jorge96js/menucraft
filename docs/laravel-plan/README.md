# MenuCraft - Plan de Arquitectura Laravel

Documentación completa para construir un SaaS de menús digitales con Laravel 13 + Livewire 4 + PostgreSQL.

## 📚 Documentación de la Fase 0

| # | Documento | Descripción |
|---|-----------|-------------|
| 00 | [Stack y Versiones](00-STACK-VERSIONS.md) | Versiones verificadas del stack, dependencias, requisitos del servidor |
| 01 | [Estructura de Carpetas](01-FOLDER-STRUCTURE.md) | Organización por dominio (DDD), reglas de nomenclatura |
| 02 | [Esquema de Base de Datos](02-DATABASE-SCHEMA.md) | 32 tablas, constraints, índices, triggers, seeders |
| 03 | [Mapa de Rutas](03-ROUTES-MAP.md) | ~79 rutas agrupadas por middleware, palabras reservadas |
| 04 | [Componentes Livewire](04-LIVEWIRE-COMPONENTS.md) | 21 componentes, reglas de seguridad, SortableJS |
| 05 | [Matriz de Aceptación](05-ACCEPTANCE-MATRIX.md) | 45 criterios (funcionales, seguridad, rendimiento, accesibilidad) |
| 06 | [Riesgos y Mitigaciones](06-RISKS.md) | 18 riesgos técnicos, de seguridad, negocio y operativos |

## 🎯 Objetivo

SaaS completamente funcional para locales gastronómicos en Argentina:
- Dueños crean menús digitales con drag & drop
- Clientes ven la carta, arman carrito y piden por WhatsApp
- Plataforma cobra suscripciones (Mercado Pago + transferencia)
- Panel de administración con métricas y gestión

## 📦 Stack

- **Backend**: Laravel 13, PHP 8.3+, PostgreSQL 16+, Redis 7+
- **Frontend**: Livewire 4, Alpine.js, Tailwind CSS v4, SortableJS
- **Auth**: Laravel Fortify (2FA TOTP para admins)
- **Admin**: Filament 5 (compatible con Livewire 4)
- **Pagos**: Mercado Pago SDK v3.16+
- **IA**: Anthropic API (importación de cartas)
- **Testing**: Pest 3, Larastan, Pint

## 🗺️ Fases de Desarrollo

| Fase | Descripción | Estado |
|------|-------------|--------|
| 0 | Plan (este documento) | ✅ Completada |
| 1 | Base del proyecto (Laravel, Vite, middlewares) | 🔲 Pendiente |
| 2 | Base de datos (migraciones, modelos, seeders) | 🔲 Pendiente |
| 3 | Autenticación completa | 🔲 Pendiente |
| 4 | Onboarding y perfil del local | 🔲 Pendiente |
| 5 | Planes y entitlements | 🔲 Pendiente |
| 6 | Editor de carta (DnD) | 🔲 Pendiente |
| 7 | Diseño, menú público y QR | 🔲 Pendiente |
| 8 | Configuración y pedidos | 🔲 Pendiente |
| 9 | Promociones y cupones | 🔲 Pendiente |
| 10 | Importación con IA | 🔲 Pendiente |
| 11 | Facturación (Mercado Pago) | 🔲 Pendiente |
| 12 | Panel admin | 🔲 Pendiente |
| 13 | Landing, SEO y soporte | 🔲 Pendiente |
| 14 | Auditoría final y producción | 🔲 Pendiente |

## 🔑 Principios de Diseño

1. **Seguridad primero**: Aislamiento entre usuarios, validación en servidor, CSP, audit log
2. **Integridad de precios**: Todo en centavos, recálculo en servidor, nunca confiar en el cliente
3. **Funcionalidad completa**: Sin TODOs, sin datos hardcodeados, todo probado
4. **Velocidad después**: Cache, optimización de queries, Lighthouse > 90

## 📊 Métricas Clave

- **32 tablas** en la base de datos
- **~79 rutas** en la aplicación
- **21 componentes** Livewire
- **45 criterios** de aceptación (20 funcionales, 15 seguridad, 5 rendimiento, 5 accesibilidad)
- **18 riesgos** identificados y mitigados
- **3 planes**: Gratis, Básico ($8.000/mes), Premium ($20.000/mes)

## 🚀 Cómo Empezar

Decí **"continuar"** para avanzar a la Fase 1: Base del proyecto.

La Fase 1 incluirá:
- Instalación de Laravel 13
- Configuración de Vite + Tailwind v4
- Livewire 4 con CSP-safe mode
- Middlewares base (Origin, headers, rate limit, usuario activo)
- Layouts (marketing, dashboard, público, admin)
- Páginas de error
- `.env.example` y validación de entorno

## 📝 Notas

- Este proyecto está en un entorno React/Vite, pero la documentación es para Laravel
- La implementación real de Laravel se hará en un entorno adecuado (servidor con PHP)
- Esta documentación sirve como blueprint completo para el desarrollo
- Cada fase entregará código funcional, tests y documentación

## 📄 Licencia

MIT

# Stack y Versiones Verificadas

## Última actualización: Marzo 2026

### Backend
- **Laravel 13.x** (última estable, marzo 2026)
  - PHP 8.3+ requerido (soporta 8.3, 8.4, 8.5)
  - Zero breaking changes desde Laravel 12
  - Laravel AI SDK incluido (first-party)
  
- **PHP 8.3+** (mínimo requerido por Laravel 13)
  - Recomendado: PHP 8.4 (estable, mejor performance)
  
- **PostgreSQL 16+** (para triggers, CHECK constraints, JSONB)
  
- **Redis 7+** (cache, colas, rate limit, sesiones)

### Frontend
- **Livewire 4.x** (última estable)
  - CSP-safe mode habilitado: `'csp_safe' => true`
  - Single-file components
  - Islands para rendering aislado
  - Built-in drag and drop
  - Optimistic UI
  
- **Alpine.js 3.x** (integrado con Livewire 4)
  - Build CSP-compatible: `@alpinejs/csp`
  
- **Tailwind CSS v4** (última estable)
  - Instalación vía `@tailwindcss/vite`
  - Sin `tailwind.config.js` (configuración en CSS)
  
- **SortableJS 1.15+** (drag & drop para editor)
  - Integración con Alpine/Livewire
  - No se incluye en bundle público

### Autenticación y Admin
- **Laravel Fortify 2.x** (autenticación)
  - Verificación de email
  - Recuperación de contraseña
  - 2FA TOTP (opcional para usuarios, obligatorio para admins)
  
- **Filament 5.x** (panel admin)
  - Compatible con Livewire 4
  - Sin cambios funcionales desde Filament 4
  - Blueprint AI tool incluido

### Pagos e Integraciones
- **Mercado Pago SDK v3.16+** (PHP)
  - `SubscriptionClient`, `PreferenceClient`, `OrderClient`
  - API v3 (no v2)
  - Webhook con firma HMAC-SHA256
  
- **Anthropic API** (importación IA)
  - Modelo configurable en `.env` (default: `claude-3-5-sonnet-20241022`)
  - Salida estructurada JSON
  - Rate limit y cuotas por plan
  
- **Cloudflare Turnstile** (anti-spam)
  - Validación en servidor
  - Honeypot complementario

### Imágenes y Documentos
- **Intervention Image v3** (procesamiento de imágenes)
  - Redimensionado, conversión a WebP
  - Eliminación de EXIF
  
- **dompdf** (generación de PDFs)
  - Comandas térmicas 58/80mm
  - QR imprimible A4/tarjeta
  
- **bacon/bacon-qr-code** (generación de QR)
  - PNG y SVG
  - Corrección de errores alta

### Emails
- **Laravel Mail** (en cola)
  - Driver: Resend o SES
  - Plantillas Markdown
  - Eventos: pago, vencimiento, cancelación, etc.

### Storage
- **Flysystem** (S3 o Cloudflare R2)
  - Disco público (imágenes de menú)
  - Disco privado (comprobantes, archivos IA)
  - URLs firmadas temporales

### Cache
- **spatie/laravel-responsecache** (menú público)
  - Invalidación por etiquetas
  - Máximo unos segundos de datos viejos

### Calidad y Testing
- **Pest 3.x** (unit y feature tests)
- **Livewire Testing** (componentes)
- **Pest Browser o Dusk** (flujos críticos)
- **Larastan** (análisis estático, nivel alto)
- **Laravel Pint** (formateo de código)
- **GitHub Actions** (CI/CD)
- **Sentry** (monitoreo de errores)
  - Datos sensibles filtrados

### Dependencias Adicionales
```json
{
  "require": {
    "laravel/framework": "^13.0",
    "livewire/livewire": "^4.0",
    "filament/filament": "^5.0",
    "laravel/fortify": "^2.0",
    "mercadopago/dx-php": "^3.16",
    "intervention/image": "^3.0",
    "barryvdh/laravel-dompdf": "^3.0",
    "bacon/bacon-qr-code": "^2.0",
    "spatie/laravel-responsecache": "^7.0",
    "spatie/laravel-csp": "^2.0",
    "predis/predis": "^2.0",
    "laravel/horizon": "^5.0",
    "sentry/sentry-laravel": "^4.0"
  },
  "require-dev": {
    "pestphp/pest": "^3.0",
    "pestphp/pest-plugin-livewire": "^3.0",
    "pestphp/pest-plugin-browser": "^3.0",
    "larastan/larastan": "^3.0",
    "laravel/pint": "^1.0"
  }
}
```

### Node.js
```json
{
  "devDependencies": {
    "laravel-vite-plugin": "^1.0",
    "tailwindcss": "^4.0",
    "@tailwindcss/vite": "^4.0",
    "autoprefixer": "^10.0",
    "sortablejs": "^1.15",
    "@alpinejs/csp": "^3.0"
  }
}
```

## Justificación de Desvíos

1. **Laravel 13 en vez de 11**: Laravel 13 es la última estable (marzo 2026), sin breaking changes desde 12, con PHP 8.3+ y Laravel AI SDK incluido.

2. **Filament 5 en vez de 3**: Filament 5 es compatible con Livewire 4 (enero 2026), sin cambios funcionales desde Filament 4.

3. **Livewire 4 en vez de 3**: Livewire 4 introduce CSP-safe mode, single-file components, islands y built-in drag & drop. Es la versión vigente.

4. **Tailwind v4**: Instalación simplificada vía `@tailwindcss/vite`, sin `tailwind.config.js`.

## Verificación de Documentación

- ✅ Laravel 13: https://laravel.com/framework/docs/releases
- ✅ Livewire 4 CSP: https://livewire.laravel.com/docs/4.x/csp
- ✅ Filament 5: https://filamentphp.com/insights/danharrin-filament-v5-blueprint
- ✅ Mercado Pago SDK v3: https://www.mercadopago.com/developers/es/docs/sdk/php/overview
- ⚠️ Anthropic API: Verificar modelo vigente antes de implementar
- ⚠️ Cloudflare Turnstile: Verificar documentación actual

## Requisitos del Servidor

- PHP 8.3+ con extensiones: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, Redis
- PostgreSQL 16+
- Redis 7+
- Node.js 20+ y npm 10+
- Composer 2.7+
- Servidor web: Nginx o Apache con mod_rewrite
- SSL/TLS (HTTPS obligatorio)
- Memoria: mínimo 2GB RAM (recomendado 4GB)
- Disco: mínimo 20GB SSD

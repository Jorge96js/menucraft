# Mapa de Rutas Completo

## Convenciones

- **Métodos**: GET para lecturas, POST/PUT/PATCH/DELETE para escrituras
- **Nombres**: Todas las rutas tienen nombre (`->name()`)
- **Middleware**: Agrupados por tipo de acceso
- **Route Model Binding**: Con `scopeBindings()` para aislamiento
- **CSRF**: Todas las rutas web excepto webhooks

---

## 1. Rutas Públicas de Marketing (`routes/public.php`)

```php
Route::middleware(['web', 'throttle:60,1'])->group(function () {
    // Landing y páginas informativas
    Route::get('/', [LandingController::class, 'index'])->name('landing');
    Route::get('/precios', [PricingController::class, 'index'])->name('pricing');
    Route::get('/rubros/{rubro}', [PricingController::class, 'byRubro'])->name('pricing.rubro');
    Route::get('/ayuda', [SupportController::class, 'index'])->name('help');
    Route::post('/contacto', [SupportController::class, 'store'])->name('contact.store');
    Route::get('/terminos', [LegalController::class, 'terms'])->name('legal.terms');
    Route::get('/privacidad', [LegalController::class, 'privacy'])->name('legal.privacy');
    Route::get('/cancelacion', [LegalController::class, 'cancellation'])->name('legal.cancellation');
    Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
});
```

| Método | URI | Nombre | Middleware | Descripción |
|--------|-----|--------|-----------|-------------|
| GET | `/` | landing | web, throttle | Landing page |
| GET | `/precios` | pricing | web, throttle | Página de precios |
| GET | `/rubros/{rubro}` | pricing.rubro | web, throttle | Precios por rubro |
| GET | `/ayuda` | help | web, throttle | Centro de ayuda |
| POST | `/contacto` | contact.store | web, throttle | Formulario de contacto |
| GET | `/terminos` | legal.terms | web, throttle | Términos de servicio |
| GET | `/privacidad` | legal.privacy | web, throttle | Política de privacidad |
| GET | `/cancelacion` | legal.cancellation | web, throttle | Política de cancelación |
| GET | `/sitemap.xml` | sitemap | web | Sitemap dinámico |

---

## 2. Rutas de Autenticación (`routes/public.php`)

```php
Route::middleware(['web', 'guest'])->group(function () {
    Route::get('/registro', [RegisterController::class, 'create'])->name('register');
    Route::post('/registro', [RegisterController::class, 'store']);
    
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    
    Route::get('/olvide-mi-clave', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/olvide-mi-clave', [ForgotPasswordController::class, 'store'])->name('password.email');
    
    Route::get('/restablecer-clave/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('/restablecer-clave', [ResetPasswordController::class, 'store'])->name('password.update');
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/logout', [LogoutController::class, 'store'])->name('logout');
    
    Route::get('/verificar-email', [VerificationController::class, 'notice'])->name('verification.notice');
    Route::get('/verificar-email/{id}/{hash}', [VerificationController::class, 'verify'])
        ->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
    Route::post('/verificar-email/reenviar', [VerificationController::class, 'resend'])
        ->middleware('throttle:3,1')->name('verification.resend');
    
    Route::get('/2fa', [TwoFactorController::class, 'challenge'])->name('two-factor.challenge');
    Route::post('/2fa', [TwoFactorController::class, 'verify']);
});
```

| Método | URI | Nombre | Middleware | Descripción |
|--------|-----|--------|-----------|-------------|
| GET | `/registro` | register | web, guest | Formulario de registro |
| POST | `/registro` | - | web, guest | Procesar registro |
| GET | `/login` | login | web, guest | Formulario de login |
| POST | `/login` | - | web, guest | Procesar login |
| GET | `/olvide-mi-clave` | password.request | web, guest | Pedir reset de contraseña |
| POST | `/olvide-mi-clave` | password.email | web, guest | Enviar email de reset |
| GET | `/restablecer-clave/{token}` | password.reset | web, guest | Formulario de nueva contraseña |
| POST | `/restablecer-clave` | password.update | web, guest | Procesar nueva contraseña |
| POST | `/logout` | logout | web, auth | Cerrar sesión |
| GET | `/verificar-email` | verification.notice | web, auth | Aviso de verificación |
| GET | `/verificar-email/{id}/{hash}` | verification.verify | web, auth, signed, throttle | Verificar email |
| POST | `/verificar-email/reenviar` | verification.resend | web, auth, throttle | Reenviar email |
| GET | `/2fa` | two-factor.challenge | web, auth | Challenge 2FA |
| POST | `/2fa` | - | web, auth | Verificar código 2FA |

---

## 3. Rutas del Menú Público (`routes/public.php`)

```php
// Menú público (sin sesión, cacheado)
Route::middleware(['web', 'throttle:120,1'])->group(function () {
    Route::get('/m/{slug}', [PublicMenuController::class, 'show'])->name('menu.show');
    Route::get('/m/{slug}/mesa/{numero}', [PublicMenuController::class, 'showWithTable'])->name('menu.show.table');
    
    // Detalle de pedido por token (solo lectura)
    Route::get('/pedido/{token}', [PublicOrderController::class, 'show'])->name('order.show');
});

// API pública para pedidos (sin cookies de sesión)
Route::prefix('api/public')->middleware(['api', 'throttle:30,1'])->group(function () {
    Route::post('/orders', [PublicOrderApiController::class, 'store'])->name('api.orders.store');
    Route::post('/coupons/validate', [CouponApiController::class, 'validate'])->name('api.coupons.validate');
    Route::post('/events', [EventApiController::class, 'store'])->name('api.events.store');
});
```

| Método | URI | Nombre | Middleware | Descripción |
|--------|-----|--------|-----------|-------------|
| GET | `/m/{slug}` | menu.show | web, throttle | Carta pública |
| GET | `/m/{slug}/mesa/{numero}` | menu.show.table | web, throttle | Carta con mesa pre-cargada |
| GET | `/pedido/{token}` | order.show | web, throttle | Detalle de pedido (token) |
| POST | `/api/public/orders` | api.orders.store | api, throttle | Crear pedido público |
| POST | `/api/public/coupons/validate` | api.coupons.validate | api, throttle | Validar cupón |
| POST | `/api/public/events` | api.events.store | api, throttle | Registrar evento (visita/click) |

---

## 4. Rutas del Dashboard (`routes/web.php`)

```php
Route::middleware(['web', 'auth', 'verified', 'active'])->prefix('dashboard')->group(function () {
    
    // Onboarding
    Route::get('/onboarding', [OnboardingController::class, 'index'])->name('onboarding');
    
    // Dashboard principal
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    // Menús
    Route::get('/menus', [MenuController::class, 'index'])->name('menus.index');
    Route::post('/menus', [MenuController::class, 'store'])->name('menus.store');
    Route::get('/menus/{menu:slug}/editor', [MenuEditorController::class, 'show'])->name('menus.editor');
    Route::get('/menus/{menu:slug}/diseno', [MenuDesignController::class, 'show'])->name('menus.design');
    Route::get('/menus/{menu:slug}/ajustes', [MenuSettingsController::class, 'show'])->name('menus.settings');
    Route::post('/menus/{menu:slug}/duplicar', [MenuController::class, 'duplicate'])->name('menus.duplicate');
    Route::delete('/menus/{menu:slug}', [MenuController::class, 'destroy'])->name('menus.destroy');
    
    // Pedidos
    Route::get('/pedidos', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/pedidos/{order:code}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/pedidos/{order:code}/comanda', [OrderController::class, 'print'])->name('orders.print');
    Route::patch('/pedidos/{order:code}', [OrderController::class, 'updateStatus'])->name('orders.update');
    
    // IA
    Route::get('/importar', [AiImportController::class, 'create'])->name('ai.import');
    Route::post('/importar', [AiImportController::class, 'store'])->name('ai.import.store');
    Route::get('/importar/{job}/revision', [AiImportController::class, 'review'])->name('ai.review');
    Route::post('/importar/{job}/confirmar', [AiImportController::class, 'confirm'])->name('ai.confirm');
    
    // Perfil
    Route::get('/perfil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/perfil', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/perfil/cambiar-clave', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::put('/perfil/cambiar-email', [ProfileController::class, 'updateEmail'])->name('profile.email');
    Route::delete('/perfil', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // 2FA
    Route::get('/perfil/2fa', [TwoFactorController::class, 'show'])->name('two-factor.show');
    Route::post('/perfil/2fa', [TwoFactorController::class, 'enable'])->name('two-factor.enable');
    Route::delete('/perfil/2fa', [TwoFactorController::class, 'disable'])->name('two-factor.disable');
    
    // Plan y facturación
    Route::get('/plan', [BillingController::class, 'show'])->name('billing.show');
    Route::post('/plan/suscribir', [BillingController::class, 'subscribe'])->name('billing.subscribe');
    Route::get('/plan/resultado', [BillingController::class, 'result'])->name('billing.result');
    Route::post('/plan/cancelar', [BillingController::class, 'cancel'])->name('billing.cancel');
    Route::post('/plan/reanudar', [BillingController::class, 'resume'])->name('billing.resume');
    Route::post('/plan/transferencia', [BillingController::class, 'uploadTransfer'])->name('billing.transfer');
    
    // QR
    Route::get('/qr', [QrController::class, 'index'])->name('qr.index');
    Route::get('/qr/{menu:slug}/descargar', [QrController::class, 'download'])->name('qr.download');
    
    // Estadísticas
    Route::get('/estadisticas', [StatsController::class, 'index'])->name('stats.index');
    
    // Promociones y cupones
    Route::get('/promociones', [PromotionController::class, 'index'])->name('promotions.index');
    Route::get('/cupones', [CouponController::class, 'index'])->name('coupons.index');
    
    // Referidos
    Route::get('/referidos', [ReferralController::class, 'index'])->name('referrals.index');
    
    // Soporte
    Route::post('/soporte', [SupportController::class, 'storeTicket'])->name('support.store');
});
```

| Método | URI | Nombre | Middleware | Descripción |
|--------|-----|--------|-----------|-------------|
| GET | `/dashboard/onboarding` | onboarding | auth, verified, active | Wizard de onboarding |
| GET | `/dashboard` | dashboard | auth, verified, active | Panel principal |
| GET | `/dashboard/menus` | menus.index | auth, verified, active | Listado de menús |
| POST | `/dashboard/menus` | menus.store | auth, verified, active | Crear menú |
| GET | `/dashboard/menus/{menu:slug}/editor` | menus.editor | auth, verified, active | Editor DnD |
| GET | `/dashboard/menus/{menu:slug}/diseno` | menus.design | auth, verified, active | Panel de diseño |
| GET | `/dashboard/menus/{menu:slug}/ajustes` | menus.settings | auth, verified, active | Configuración |
| POST | `/dashboard/menus/{menu:slug}/duplicar` | menus.duplicate | auth, verified, active | Duplicar menú |
| DELETE | `/dashboard/menus/{menu:slug}` | menus.destroy | auth, verified, active | Eliminar menú |
| GET | `/dashboard/pedidos` | orders.index | auth, verified, active | Listado de pedidos |
| GET | `/dashboard/pedidos/{order:code}` | orders.show | auth, verified, active | Detalle de pedido |
| GET | `/dashboard/pedidos/{order:code}/comanda` | orders.print | auth, verified, active | Imprimir comanda |
| PATCH | `/dashboard/pedidos/{order:code}` | orders.update | auth, verified, active | Cambiar estado |
| GET | `/dashboard/importar` | ai.import | auth, verified, active | Importar con IA |
| POST | `/dashboard/importar` | ai.import.store | auth, verified, active | Subir archivos |
| GET | `/dashboard/importar/{job}/revision` | ai.review | auth, verified, active | Revisar resultado |
| POST | `/dashboard/importar/{job}/confirmar` | ai.confirm | auth, verified, active | Confirmar importación |
| GET | `/dashboard/perfil` | profile.edit | auth, verified, active | Editar perfil |
| PUT | `/dashboard/perfil` | profile.update | auth, verified, active | Actualizar perfil |
| PUT | `/dashboard/perfil/cambiar-clave` | profile.password | auth, verified, active | Cambiar contraseña |
| PUT | `/dashboard/perfil/cambiar-email` | profile.email | auth, verified, active | Cambiar email |
| DELETE | `/dashboard/perfil` | profile.destroy | auth, verified, active | Eliminar cuenta |
| GET | `/dashboard/perfil/2fa` | two-factor.show | auth, verified, active | Configurar 2FA |
| POST | `/dashboard/perfil/2fa` | two-factor.enable | auth, verified, active | Activar 2FA |
| DELETE | `/dashboard/perfil/2fa` | two-factor.disable | auth, verified, active | Desactivar 2FA |
| GET | `/dashboard/plan` | billing.show | auth, verified, active | Mi plan |
| POST | `/dashboard/plan/suscribir` | billing.subscribe | auth, verified, active | Suscribirse |
| GET | `/dashboard/plan/resultado` | billing.result | auth, verified, active | Resultado de pago |
| POST | `/dashboard/plan/cancelar` | billing.cancel | auth, verified, active | Cancelar suscripción |
| POST | `/dashboard/plan/reanudar` | billing.resume | auth, verified, active | Reanudar suscripción |
| POST | `/dashboard/plan/transferencia` | billing.transfer | auth, verified, active | Subir comprobante |
| GET | `/dashboard/qr` | qr.index | auth, verified, active | Generar QR |
| GET | `/dashboard/qr/{menu:slug}/descargar` | qr.download | auth, verified, active | Descargar QR |
| GET | `/dashboard/estadisticas` | stats.index | auth, verified, active | Estadísticas |
| GET | `/dashboard/promociones` | promotions.index | auth, verified, active | Promociones |
| GET | `/dashboard/cupones` | coupons.index | auth, verified, active | Cupones |
| GET | `/dashboard/referidos` | referrals.index | auth, verified, active | Referidos |
| POST | `/dashboard/soporte` | support.store | auth, verified, active | Crear ticket |

---

## 5. Rutas de Admin (`routes/admin.php`)

```php
Route::middleware(['web', 'auth', 'admin', 'admin.2fa'])->prefix('panel-admin')->group(function () {
    // Filament se monta aquí
});

// Webhook de Mercado Pago (EXCEPCIÓN: sin CSRF, con firma)
Route::post('/api/webhooks/mercadopago', [MercadoPagoWebhookController::class, 'handle'])
    ->middleware(['api', 'throttle:60,1'])
    ->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])
    ->name('webhooks.mercadopago');
```

| Método | URI | Nombre | Middleware | Descripción |
|--------|-----|--------|-----------|-------------|
| * | `/panel-admin/*` | filament.* | web, auth, admin, admin.2fa | Panel Filament |
| POST | `/api/webhooks/mercadopago` | webhooks.mercadopago | api, throttle | Webhook Mercado Pago |

### Recursos de Filament

| Recurso | URI | Descripción |
|---------|-----|-------------|
| Dashboard | `/panel-admin` | Resumen y métricas |
| Users | `/panel-admin/users` | Gestión de usuarios |
| Subscriptions | `/panel-admin/subscriptions` | Suscripciones |
| Payments | `/panel-admin/payments` | Pagos |
| Plans | `/panel-admin/plans` | Editar planes |
| TransferProofs | `/panel-admin/transferencias` | Comprobantes pendientes |
| Referrals | `/panel-admin/referidos` | Referidos |
| WebhookEvents | `/panel-admin/webhooks` | Eventos de webhook |
| AuditLog | `/panel-admin/auditoria` | Log de auditoría (solo lectura) |

---

## 6. Rutas de Salud y Utilidades

```php
// Health check (para monitoreo)
Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
})->name('health');

// Robots.txt
Route::get('/robots.txt', function () {
    return response("User-agent: *\nDisallow: /dashboard\nDisallow: /panel-admin\nAllow: /", 200)
        ->header('Content-Type', 'text/plain');
});
```

---

## Resumen de Rutas

| Grupo | Cantidad | Descripción |
|-------|----------|-------------|
| Marketing | 9 | Landing, precios, legal, ayuda |
| Auth | 14 | Registro, login, verificación, 2FA |
| Menú Público | 6 | Carta, pedidos, eventos |
| Dashboard | 34 | Editor, pedidos, perfil, billing |
| Admin | ~15 | Filament resources |
| Webhooks | 1 | Mercado Pago |
| **Total** | **~79** | |

---

## Middleware Pipeline

### Marketing y Públicas
```
web → throttle:60,1 → [VerifyOrigin] → [SecurityHeaders]
```

### Autenticación
```
web → guest → [VerifyOrigin] → [SecurityHeaders]
web → auth → [VerifyOrigin] → [SecurityHeaders]
```

### Menú Público
```
web → throttle:120,1 → [SecurityHeaders] → [ResponseCache]
api → throttle:30,1 → [VerifyOrigin] → [SecurityHeaders]
```

### Dashboard
```
web → auth → verified → active → [VerifyOrigin] → [SecurityHeaders]
```

### Admin
```
web → auth → admin → admin.2fa → [VerifyOrigin] → [SecurityHeaders]
```

### Webhooks
```
api → throttle:60,1 → [VerifyMercadoPagoSignature]
```

---

## Palabras Reservadas para Slugs

Estos slugs NO se pueden usar para menús (conflicto con rutas):
```
admin, api, dashboard, login, registro, logout, precios, ayuda, contacto,
terminos, privacidad, cancelacion, sitemap, up, panel-admin, m, pedido,
verificar-email, olvide-mi-clave, restablecer-clave, 2fa, onboarding, storage
```

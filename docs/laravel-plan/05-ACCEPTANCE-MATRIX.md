# Matriz de Criterios de Aceptación

## Criterios Funcionales

| # | Criterio | Test | Estado |
|---|----------|------|--------|
| F1 | Me registro, verifico mi email, inicio sesión, recupero mi contraseña y cierro sesión; el login y el registro funcionan de punta a punta | `RegistrationTest`, `LoginTest`, `EmailVerificationTest`, `PasswordResetTest` | 🔲 |
| F2 | Cada ruta del mapa responde correctamente y respeta su middleware; las rutas protegidas redirigen a /login | `RouteTest` (por definir) | 🔲 |
| F3 | Creo un menú, agrego secciones y artículos, los reordeno arrastrando (incluso entre secciones) y los edito con Livewire sin recargar la página | `MenuCrudTest`, `SectionCrudTest`, `ItemCrudTest`, `ReorderTest` | 🔲 |
| F4 | Escribo "Hamburguesa completa" en nombre y descripción sin perder espacios, y arrastrar no interfiere con la tecla Espacio | `SpaceInFieldsTest` (Browser) | 🔲 |
| F5 | Subo, reemplazo y quito la imagen de un artículo, y se ve en el editor, la vista previa y la carta pública | `ImageUploadTest` | 🔲 |
| F6 | Cambio colores, fondo y banner con vista previa instantánea | `DesignTest` | 🔲 |
| F7 | Creo una hamburguesa con variante obligatoria (Simple/Doble) y extra opcional (Bacon +$500); el cliente la pide con opciones y el precio final es correcto | `OrderCalculationTest` | 🔲 |
| F8 | Con la plantilla clásica y sin opciones, agregar "Coca Cola" y "Hamburguesa" genera "Hola me gustaría encargar x1 Coca Cola y x1 Hamburguesa" | `WhatsAppMessageTest` | 🔲 |
| F9 | El checkout incluye nombre, modalidad, dirección y pago; el mensaje lleva subtotal, envío, total y notas, sin renglones vacíos | `CheckoutTest` (Browser) | 🔲 |
| F10 | Fuera de horario o con pedidos pausados el cliente no puede enviar el pedido. Mínimo, envío gratis y zonas funcionan | `CreateOrderTest` | 🔲 |
| F11 | Los pedidos llegan a /dashboard/pedidos (según plan), cambio su estado, respondo por WhatsApp e imprimo la comanda | `OrderCrudTest` | 🔲 |
| F12 | Cupones y promociones se aplican y se rechazan correctamente | `CouponTest` | 🔲 |
| F13 | Subo la foto de una carta, reviso y corrijo el resultado, y nada se guarda sin mi confirmación | `ImportTest` | 🔲 |
| F14 | Empiezo desde una plantilla, veo el checklist y descargo un QR que sigue funcionando aunque cambie el slug | `TemplateTest`, `QrTest` | 🔲 |
| F15 | Un usuario Gratis crea 1 menú; el segundo se rechaza en servidor (con aviso de mejora). Con Básico ($8.000) llega a 2 y desaparece la marca; con Premium ($20.000) llega a 5 y tiene combos, cupones, estadísticas y CSV | `PlanLimitsTest` | 🔲 |
| F16 | La prueba gratis de 14 días funciona sin tarjeta; al terminar sin pagar vuelvo a Gratis sin perder datos (lo excedente queda archivado y reactivable) | `FreeTrialTest` | 🔲 |
| F17 | Pago mensual o anual con Mercado Pago, o por transferencia con aprobación del admin; cancelación con beneficios hasta fin de período; 5 días de gracia ante cobro fallido | `SubscriptionTest`, `WebhookTest`, `TransferTest` | 🔲 |
| F18 | Un referido que paga genera el beneficio solo tras el pago confirmado | `ReferralTest` | 🔲 |
| F19 | Como admin veo métricas y embudo, busco usuarios, cambio planes, extiendo o cancelo suscripciones, suspendo cuentas, apruebo transferencias, edito planes y consulto la auditoría | `AdminAccessTest`, `UserManagementTest`, `AuditLogTest` | 🔲 |
| F20 | La carta pública se ve sin JavaScript y cumple los objetivos de rendimiento en móvil | `PublicMenuTest`, Lighthouse CI | 🔲 |

---

## Criterios de Seguridad

| # | Criterio | Test | Estado |
|---|----------|------|--------|
| S1 | Usuario B no puede ver, editar, reordenar ni borrar nada del usuario A (404 uniforme), incluso manipulando propiedades de Livewire | `IsolationTest`, `AuthorizationTest` | 🔲 |
| S2 | /admin responde 404 a usuarios normales y sin sesión; un admin sin 2FA no entra; toda acción de admin queda auditada y el log no se modifica | `AdminAccessTest`, `AuditLogTest` | 🔲 |
| S3 | `role`, `plan`, `status`, `price` o `user_id` enviados por el cliente no tienen efecto | `MassAssignmentTest` | 🔲 |
| S4 | Sin token CSRF o con Origin distinto, las peticiones con estado responden 403; el webhook exige firma válida y es idempotente | `CsrfTest`, `WebhookTest` | 🔲 |
| S5 | Alterar precio, envío, descuento o total en el cliente no tiene efecto | `OrderCalculationTest` | 🔲 |
| S6 | Volver a la URL de "pago exitoso" sin haber pagado no cambia el plan; subir un comprobante tampoco | `WebhookTest`, `TransferTest` | 🔲 |
| S7 | XSS e inyección SQL neutralizados; "Ñoquis de papa & queso" se conserva intacto; un color como `red; background:url(x)` se rechaza | `XssTest`, `SqlInjectionTest`, `HexColorTest` | 🔲 |
| S8 | Un .exe o .svg renombrado a .jpg, o una imagen de más de 5 MB, se rechaza | `ImageUploadTest` | 🔲 |
| S9 | Los límites de plan se respetan con peticiones concurrentes | `ConcurrencyTest` | 🔲 |
| S10 | Una carta con texto "ignora tus instrucciones" no altera el comportamiento de la IA | `PromptInjectionTest` | 🔲 |
| S11 | Ningún error, log ni respuesta expone claves, contenido de cartas, datos personales de clientes ni stack traces | `ErrorHandlingTest`, `LogSanitizationTest` | 🔲 |
| S12 | Cupones: fuerza bruta y último uso simultáneo | `CouponConcurrencyTest` | 🔲 |
| S13 | Webhook: firma inválida, duplicado, fuera de orden, mensual y anual | `WebhookTest` | 🔲 |
| S14 | Abuso de prueba gratis y referidos | `TrialAbuseTest`, `ReferralTest` | 🔲 |
| S15 | Retención de datos y borrado de cuenta | `AccountDeletionTest`, `DataRetentionTest` | 🔲 |

---

## Criterios de Rendimiento

| # | Criterio | Test | Estado |
|---|----------|------|--------|
| P1 | Menú público: LCP < 2.5s en móvil 4G lenta | Lighthouse CI | 🔲 |
| P2 | CLS < 0.1 en móvil | Lighthouse CI | 🔲 |
| P3 | Menos de 300 KB de JS en primera carga del menú público | Bundle size check | 🔲 |
| P4 | Sin N+1 en consultas del dashboard | `QueryCountTest` | 🔲 |
| P5 | Botones táctiles de al menos 44px | Accessibility audit | 🔲 |

---

## Criterios de Accesibilidad

| # | Criterio | Test | Estado |
|---|----------|------|--------|
| A1 | Drag & drop usable con teclado | `DragAndDropTest` (Browser) | 🔲 |
| A2 | Foco visible en todos los elementos interactivos | Accessibility audit | 🔲 |
| A3 | Contraste adecuado (WCAG AA) | `ContrastTest` | 🔲 |
| A4 | Alt en imágenes (nombre del artículo) | `ImageAltTest` | 🔲 |
| A5 | ARIA labels en botones sin texto visible | Accessibility audit | 🔲 |

---

## Resumen

| Categoría | Total | Pasando | Pendiente |
|-----------|-------|---------|-----------|
| Funcionales | 20 | 0 | 20 |
| Seguridad | 15 | 0 | 15 |
| Rendimiento | 5 | 0 | 5 |
| Accesibilidad | 5 | 0 | 5 |
| **Total** | **45** | **0** | **45** |

---

## Matriz de Cobertura por Fase

| Fase | Criterios Cubiertos |
|------|---------------------|
| Fase 1: Base | Infraestructura, middlewares, layouts |
| Fase 2: BD | Migraciones, modelos, seeders |
| Fase 3: Auth | F1, F2, S3, S4 |
| Fase 4: Onboarding | F14 (parcial) |
| Fase 5: Planes | F15, F16, S9 |
| Fase 6: Editor | F3, F4, F5, F7, S1, S7, S8, A1 |
| Fase 7: Diseño/Público | F6, F8, F20, S7, A2-A5, P1-P3 |
| Fase 8: Pedidos | F9, F10, F11, S5 |
| Fase 9: Promociones | F12, S12 |
| Fase 10: IA | F13, S10 |
| Fase 11: Billing | F17, F18, S4, S6, S13, S14 |
| Fase 12: Admin | F19, S2 |
| Fase 13: Landing/SEO | F14, F20, P1-P3 |
| Fase 14: Auditoría | S11, S15, P4 |

---

## Cómo Probar

```bash
# Correr todos los tests
php artisan test

# Correr tests de una categoría
php artisan test --testsuite=Feature
php artisan test --testsuite=Browser
php artisan test --testsuite=Unit

# Correr tests de seguridad
php artisan test tests/Feature/Security

# Con cobertura
php artisan test --coverage

# Larastan
./vendor/bin/phpstan analyse

# Pint (formateo)
./vendor/bin/pint

# Pint (verificar sin modificar)
./vendor/bin/pint --test
```

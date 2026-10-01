# Componentes Livewire

## Reglas Generales

1. **Componentes delgados**: Solo coordinan UI, la lógica vive en Actions/Services
2. **`#[Locked]`**: Todo ID, precio, estado, rol o dato sensible
3. **Re-autorizar**: `$this->authorize()` en CADA método de acción
4. **Form Objects**: Validación con reglas explícitas, nunca confiar en el cliente
5. **Espacios**: `wire:model.blur` en campos de texto (NUNCA `wire:model.live`)
6. **SortableJS**: `filter: 'input, textarea, [contenteditable]'` para no interceptar Espacio

---

## 1. Onboarding

### `Onboarding\Wizard`
- **Ruta**: `/dashboard/onboarding`
- **Props**: `#[Locked] public string $userId`, `public int $step = 1`
- **Métodos**: `saveBusinessInfo()`, `saveWhatsApp()`, `chooseTemplate()`, `finish()`
- **Vista**: Wizard de 4 pasos con barra de progreso

### `Onboarding\Checklist`
- **Ruta**: Sidebar del dashboard
- **Props**: `#[Locked] public string $userId`
- **Métodos**: `getSteps()` (calcula qué pasos faltan)
- **Vista**: Checklist persistente con barra de progreso

---

## 2. Menús

### `Menus\MenuList`
- **Ruta**: `/dashboard/menus`
- **Props**: `#[Locked] public string $userId`
- **Métodos**: `createMenu()`, `duplicateMenu()`, `deleteMenu()`
- **Vista**: Grid de tarjetas de menú con estado, preview y acciones

### `Menus\MenuEditor` ⭐ (el más complejo)
- **Ruta**: `/dashboard/menus/{slug}/editor`
- **Props**:
  - `#[Locked] public string $menuId`
  - `#[Locked] public string $userId`
  - `public array $sections = []` (estructura completa)
  - `public string $saveStatus = 'idle'` (idle|saving|saved|error)
- **Métodos**:
  - `addSection()`, `updateSection()`, `deleteSection()`
  - `addItem()`, `updateItem()`, `deleteItem()`
  - `reorderSections($orderedIds)` (valida en servidor)
  - `reorderItems($sectionId, $orderedIds)`
  - `moveItem($itemId, $fromSectionId, $toSectionId)`
  - `save()` (autoguardado con debounce de 1s)
- **Vista**: Editor con SortableJS, paneles laterales, preview toggle
- **JS**: Alpine + SortableJS para drag & drop anidado

### `Menus\ItemForm`
- **Tipo**: Modal
- **Props**:
  - `#[Locked] public string $menuId`
  - `#[Locked] public string $sectionId`
  - `#[Locked] public ?string $itemId = null`
  - `public string $name = ''` (wire:model.blur)
  - `public string $description = ''` (wire:model.blur)
  - `public string $price = ''`
  - `public bool $available = true`
- **Métodos**: `save()`, `delete()`
- **Vista**: Modal con campos de texto, precio, imagen, disponibilidad

### `Menus\OptionGroups`
- **Ruta**: Dentro del editor, por artículo
- **Props**:
  - `#[Locked] public string $itemId`
  - `#[Locked] public string $menuId`
  - `public array $groups = []`
- **Métodos**: `addGroup()`, `updateGroup()`, `deleteGroup()`, `addOption()`, `updateOption()`, `deleteOption()`, `reorderGroups()`, `reorderOptions()`
- **Vista**: Lista de grupos con opciones, drag & drop

### `Menus\ImageUploader`
- **Tipo**: Componente reutilizable
- **Props**:
  - `#[Locked] public string $type` ('item' | 'banner' | 'logo')
  - `#[Locked] public string $recordId`
  - `public ?string $currentUrl = null`
  - `public int $uploadProgress = 0`
  - `public ?string $uploadError = null`
- **Métodos**: `upload()`, `replace()`, `remove()`
- **Vista**: Dropzone con preview, estados de subida, botones reemplazar/quitar

### `Menus\DesignPanel`
- **Ruta**: `/dashboard/menus/{slug}/diseno`
- **Props**:
  - `#[Locked] public string $menuId`
  - `public string $colorPrimary = '#f97316'`
  - `public string $colorBg = '#ffffff'`
  - `public ?string $colorText = null`
  - `public ?string $bannerUrl = null`
- **Métodos**: `updateColor()`, `resetDesign()`, `uploadBanner()`, `removeBanner()`
- **Vista**: Selectores de color, paleta sugerida, preview en tiempo real, aviso de contraste

### `Menus\Settings`
- **Ruta**: `/dashboard/menus/{slug}/ajustes`
- **Props**:
  - `#[Locked] public string $menuId`
  - `public string $orderMessage` (wire:model.blur, textarea)
  - `public bool $allowPickup`, `allowDelivery`, `allowTable`
  - `public int $minimumOrder`
  - `public int $deliveryFee`
  - `public array $hours = []`
  - `public array $zones = []`
  - `public bool $isPaused`
  - `public string $pauseMessage`
- **Métodos**: `saveSettings()`, `addHour()`, `removeHour()`, `addZone()`, `removeZone()`, `togglePause()`
- **Vista**: Tabs (general, horarios, delivery, mensaje, pagos)

### `Menus\Promotions`
- **Ruta**: `/dashboard/promociones`
- **Props**: `#[Locked] public string $menuId`, `public array $promotions = []`
- **Métodos**: `createPromotion()`, `updatePromotion()`, `deletePromotion()`
- **Vista**: Lista de promociones con formulario inline

### `Menus\Coupons`
- **Ruta**: `/dashboard/cupones`
- **Props**: `#[Locked] public string $menuId`, `public array $coupons = []`
- **Métodos**: `createCoupon()`, `updateCoupon()`, `deleteCoupon()`
- **Vista**: Lista de cupones con estadísticas de uso

### `Menus\QrDownload`
- **Ruta**: `/dashboard/qr`
- **Props**: `#[Locked] public string $menuId`
- **Métodos**: `downloadPng()`, `downloadSvg()`, `downloadPdf()`
- **Vista**: Preview del QR con opciones de descarga

---

## 3. Pedidos

### `Orders\OrderList`
- **Ruta**: `/dashboard/pedidos`
- **Props**:
  - `#[Locked] public string $userId`
  - `public string $filter = 'all'` (all|new|preparing|delivered)
  - `public string $search = ''`
- **Métodos**: `loadOrders()`, `updateStatus()`, `exportCsv()`
- **Polling**: `wire:poll.10s="loadOrders"` para nuevos pedidos
- **Vista**: Tabla de pedidos con filtros, búsqueda, acciones

### `Orders\OrderDetail`
- **Ruta**: `/dashboard/pedidos/{code}`
- **Props**:
  - `#[Locked] public string $orderId`
  - `#[Locked] public string $userId`
- **Métodos**: `updateStatus()`, `replyWhatsApp()`, `printOrder()`
- **Vista**: Detalle completo con items, opciones, datos del cliente, comanda

---

## 4. IA

### `Ai\ImportWizard`
- **Ruta**: `/dashboard/importar`
- **Props**:
  - `#[Locked] public string $userId`
  - `public array $files = []`
  - `public int $uploadProgress = 0`
  - `public string $status = 'idle'`
- **Métodos**: `uploadFiles()`, `startImport()`
- **Vista**: Dropzone para 8 imágenes o 1 PDF, barra de progreso

### `Ai\ImportReview`
- **Ruta**: `/dashboard/importar/{job}/revision`
- **Props**:
  - `#[Locked] public string $jobId`
  - `#[Locked] public string $userId`
  - `public array $result = []`
- **Métodos**: `updateItem()`, `toggleItem()`, `confirmImport()`, `rejectImport()`
- **Vista**: Vista editable del resultado con casillas, advertencias de confianza

---

## 5. Billing

### `Billing\PlanPage`
- **Ruta**: `/dashboard/plan`
- **Props**:
  - `#[Locked] public string $userId`
  - `public string $billingInterval = 'monthly'`
- **Métodos**: `subscribe()`, `cancel()`, `resume()`
- **Vista**: Comparativa de planes, uso actual, botones de acción

### `Billing\TransferProofUpload`
- **Ruta**: Modal dentro de PlanPage
- **Props**:
  - `#[Locked] public string $userId`
  - `public ?string $proofUrl = null`
  - `public string $referenceCode = ''`
- **Métodos**: `upload()`, `submit()`
- **Vista**: Upload de comprobante + campo de referencia

---

## 6. Perfil

### `Profile\ProfileForm`
- **Ruta**: `/dashboard/perfil`
- **Props**:
  - `#[Locked] public string $userId`
  - `public string $restaurantName` (wire:model.blur)
  - `public string $whatsapp` (wire:model.blur)
  - `public string $businessType`
  - `public ?string $logoUrl = null`
- **Métodos**: `save()`, `changePassword()`, `changeEmail()`, `deleteAccount()`
- **Vista**: Formulario con secciones (datos, seguridad, zona peligrosa)

---

## 7. Referidos

### `Referrals\ReferralPanel`
- **Ruta**: `/dashboard/referidos`
- **Props**: `#[Locked] public string $userId`
- **Métodos**: `copyLink()`, `copyCode()`
- **Vista**: Código de referido, enlace, historial de referidos y beneficios

---

## 8. Soporte

### `Support\HelpButton`
- **Ruta**: Botón flotante en todas las páginas del dashboard
- **Props**: `#[Locked] public string $userId`
- **Métodos**: `openWhatsApp()`
- **Vista**: Botón flotante que abre WhatsApp con ID de usuario prellenado

---

## Resumen de Componentes

| Dominio | Componentes | Complejidad |
|---------|------------|-------------|
| Onboarding | 2 | Media |
| Menús | 10 | Alta (editor) |
| Pedidos | 2 | Media |
| IA | 2 | Media |
| Billing | 2 | Media |
| Perfil | 1 | Baja |
| Referidos | 1 | Baja |
| Soporte | 1 | Baja |
| **Total** | **21** | |

---

## Configuración de SortableJS (CRÍTICO)

```javascript
// resources/js/app.js
import Sortable from 'sortablejs';

document.addEventListener('alpine:init', () => {
    Alpine.data('menuEditor', () => ({
        init() {
            // Secciones
            new Sortable(this.$refs.sectionsList, {
                group: 'sections',
                animation: 150,
                handle: '.drag-handle',
                // CRÍTICO: No interceptar inputs
                filter: 'input, textarea, [contenteditable], .no-drag',
                preventOnFilter: false,
                onEnd: (evt) => {
                    this.$wire.reorderSections(this.getSectionOrder());
                }
            });
            
            // Items (nested)
            this.$refs.itemsLists.forEach(list => {
                new Sortable(list, {
                    group: 'items',
                    animation: 150,
                    handle: '.drag-handle',
                    filter: 'input, textarea, [contenteditable], .no-drag',
                    preventOnFilter: false,
                    onEnd: (evt) => {
                        if (evt.from !== evt.to) {
                            // Movió entre secciones
                            this.$wire.moveItem(
                                evt.item.dataset.id,
                                evt.from.dataset.sectionId,
                                evt.to.dataset.sectionId
                            );
                        } else {
                            // Reordenó dentro de la misma sección
                            this.$wire.reorderItems(
                                evt.from.dataset.sectionId,
                                this.getItemOrder(evt.to)
                            );
                        }
                    }
                });
            });
        }
    }));
});
```

## Regla de Espacios (CRÍTICO)

```blade
<!-- CORRECTO: wire:model.blur -->
<input type="text" wire:model.blur="name" />
<textarea wire:model.blur="description"></textarea>

<!-- INCORRECTO: wire:model.live (TrimStrings puede recortar espacios) -->
<input type="text" wire:model.live="name" />
```

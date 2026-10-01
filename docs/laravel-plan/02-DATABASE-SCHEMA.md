# Esquema de Base de Datos Completo

## Convenciones

- **IDs**: UUID v4 (todos los modelos usan el trait `HasUuid`)
- **Dinero**: Siempre en centavos (INTEGER), nunca floats
- **Timestamps**: `created_at` y `updated_at` en todas las tablas (excepto audit_log que es append-only)
- **Soft deletes**: Solo en `orders` (para retención)
- **Foreign keys**: Con `ON DELETE CASCADE` salvo que se indique lo contrario
- **Enums**: PHP nativos (no string en BD salvo donde se indique)

---

## 1. users (Laravel Fortify)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMPTZ,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100),
    
    -- Perfil extendido
    role VARCHAR(20) NOT NULL DEFAULT 'user',  -- 'user', 'admin'
    status VARCHAR(20) NOT NULL DEFAULT 'active',  -- 'active', 'suspended'
    suspension_reason TEXT,
    suspended_at TIMESTAMPTZ,
    suspended_by UUID REFERENCES users(id),
    
    -- Términos y onboarding
    terms_accepted_at TIMESTAMPTZ,
    onboarding_completed_at TIMESTAMPTZ,
    
    -- Trial
    trial_used BOOLEAN NOT NULL DEFAULT false,
    
    -- Marketing
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users(id),
    
    -- 2FA
    two_factor_secret TEXT,
    two_factor_recovery_codes TEXT,
    two_factor_confirmed_at TIMESTAMPTZ,
    
    -- Privacidad
    unsubscribed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_role CHECK (role IN ('user', 'admin')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'suspended')),
    CONSTRAINT valid_referral_code CHECK (referral_code ~ '^[A-Z0-9]{6,12}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_referral_code ON users(referral_code);
```

---

## 2. profiles

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    restaurant_name VARCHAR(100) NOT NULL,
    business_type VARCHAR(50),  -- pizzeria, hamburgueseria, cafe, etc.
    logo_url TEXT,
    whatsapp VARCHAR(15),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(255),
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/Argentina/Buenos_Aires',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_whatsapp CHECK (whatsapp IS NULL OR whatsapp ~ '^[0-9]{8,15}$'),
    CONSTRAINT valid_instagram CHECK (instagram IS NULL OR instagram ~ '^[a-zA-Z0-9._]{1,30}$')
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
```

---

## 3. plans

```sql
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,  -- 'free', 'basic', 'premium'
    name VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- Precios en centavos
    price_monthly_cents INTEGER NOT NULL DEFAULT 0,
    price_yearly_cents INTEGER NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'ARS',
    
    -- Límites
    max_menus INTEGER,  -- NULL = ilimitado (pero con tope técnico)
    max_items_per_menu INTEGER NOT NULL DEFAULT 40,
    max_option_groups_per_item INTEGER,  -- NULL = ilimitado
    storage_quota_mb INTEGER NOT NULL DEFAULT 50,
    max_ai_imports_monthly INTEGER NOT NULL DEFAULT 1,
    order_retention_days INTEGER NOT NULL DEFAULT 0,  -- 0 = no guarda pedidos
    
    -- Features (JSONB para flexibilidad)
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Estructura esperada:
    -- {
    --   "removeBranding": boolean,
    --   "qr": boolean,
    --   "qrPerTable": boolean,
    --   "promotions": boolean,
    --   "combos": boolean,
    --   "coupons": boolean,
    --   "analytics": boolean,
    --   "analyticsFull": boolean,
    --   "csvExport": boolean,
    --   "extraThemes": boolean,
    --   "prioritySupport": boolean,
    --   "scheduledOrders": boolean
    -- }
    
    -- Mercado Pago
    mp_monthly_plan_id TEXT,
    mp_yearly_plan_id TEXT,
    
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_plans_code ON plans(code);
CREATE INDEX idx_plans_active ON plans(is_active) WHERE is_active = true;
```

---

## 4. subscriptions

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    
    status VARCHAR(20) NOT NULL,  -- 'active', 'trialing', 'past_due', 'cancelled', 'expired'
    billing_interval VARCHAR(10) NOT NULL DEFAULT 'monthly',  -- 'monthly', 'yearly'
    
    -- Provider
    provider VARCHAR(20) NOT NULL DEFAULT 'mercadopago',  -- 'mercadopago', 'transfer', 'manual'
    provider_subscription_id TEXT UNIQUE,
    external_reference TEXT,  -- nuestro ID para conciliar con MP
    
    -- Períodos
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_starts_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    grace_until TIMESTAMPTZ,
    
    -- Cancelación
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    -- Método de pago
    payment_method VARCHAR(20),  -- 'credit_card', 'debit_card', 'transfer'
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_status CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
    CONSTRAINT valid_interval CHECK (billing_interval IN ('monthly', 'yearly')),
    CONSTRAINT valid_provider CHECK (provider IN ('mercadopago', 'transfer', 'manual'))
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);
CREATE INDEX idx_subscriptions_provider_id ON subscriptions(provider_subscription_id);
```

---

## 5. payments

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    provider_payment_id TEXT UNIQUE,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'ARS',
    status VARCHAR(20) NOT NULL,  -- 'approved', 'pending', 'rejected', 'refunded'
    
    billing_interval VARCHAR(10) NOT NULL,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    
    paid_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_payment_status CHECK (status IN ('approved', 'pending', 'rejected', 'refunded'))
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);
```

---

## 6. webhook_events

```sql
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_event_id TEXT NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'received',  -- 'received', 'processing', 'processed', 'failed'
    error TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ,
    
    CONSTRAINT valid_webhook_status CHECK (status IN ('received', 'processing', 'processed', 'failed'))
);

CREATE INDEX idx_webhook_events_provider_id ON webhook_events(provider_event_id);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_received_at ON webhook_events(received_at);
```

---

## 7. admin_audit_log (append-only)

```sql
CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),  -- 'user', 'subscription', 'plan', etc.
    target_id UUID,
    before JSONB,
    after JSONB,
    reason TEXT,
    ip INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_action ON admin_audit_log(action);
CREATE INDEX idx_audit_log_target ON admin_audit_log(target_type, target_id);
CREATE INDEX idx_audit_log_created_at ON admin_audit_log(created_at);

-- Trigger para hacer la tabla append-only
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'admin_audit_log is append-only. UPDATE and DELETE are not allowed.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_no_update
    BEFORE UPDATE ON admin_audit_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_audit_log_modification();

CREATE TRIGGER audit_log_no_delete
    BEFORE DELETE ON admin_audit_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_audit_log_modification();
```

---

## 8. menus

```sql
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    
    status VARCHAR(20) NOT NULL DEFAULT 'draft',  -- 'draft', 'active', 'archived'
    is_active BOOLEAN NOT NULL DEFAULT false,
    
    -- Mensaje de pedido
    order_message TEXT NOT NULL DEFAULT 'Hola, soy {cliente}. Quiero encargar:\n{items}\n\nSubtotal: {subtotal}\nEnvío: {envio}\nTotal: {total}\nModalidad: {modalidad}\nPago: {pago}\nNotas: {notas}\nPedido #{codigo_pedido}',
    
    -- Diseño
    color_primary VARCHAR(7) NOT NULL DEFAULT '#f97316',
    color_bg VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    color_text VARCHAR(7),  -- NULL = automático por contraste
    theme VARCHAR(50),  -- nombre del tema predefinido
    font_family VARCHAR(50) DEFAULT 'inter',
    
    -- Banner
    banner_url TEXT,
    
    -- SEO
    indexable BOOLEAN NOT NULL DEFAULT false,
    
    -- Contadores (para performance)
    items_count INTEGER NOT NULL DEFAULT 0,
    sections_count INTEGER NOT NULL DEFAULT 0,
    
    -- Oculto por plan (cuando degrada)
    hidden_by_plan BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_menu_status CHECK (status IN ('draft', 'active', 'archived')),
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$'),
    CONSTRAINT valid_hex_primary CHECK (color_primary ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT valid_hex_bg CHECK (color_bg ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT valid_hex_text CHECK (color_text IS NULL OR color_text ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE INDEX idx_menus_user_id ON menus(user_id);
CREATE INDEX idx_menus_slug ON menus(slug);
CREATE INDEX idx_menus_status ON menus(status);
CREATE INDEX idx_menus_active ON menus(user_id) WHERE is_active = true AND hidden_by_plan = false;
```

---

## 9. slug_redirects

```sql
CREATE TABLE slug_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    old_slug VARCHAR(50) NOT NULL UNIQUE,
    new_slug VARCHAR(50) NOT NULL,
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_old_slug CHECK (old_slug ~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$')
);

CREATE INDEX idx_slug_redirects_old_slug ON slug_redirects(old_slug);
```

---

## 10. sections

```sql
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    
    title VARCHAR(50) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    UNIQUE (menu_id, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_sections_menu_id ON sections(menu_id);
CREATE INDEX idx_sections_position ON sections(menu_id, position);
```

---

## 11. items

```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    
    name VARCHAR(80) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    compare_at_price_cents INTEGER,  -- precio tachado (promoción)
    
    image_url TEXT,
    
    available BOOLEAN NOT NULL DEFAULT true,
    hidden_by_plan BOOLEAN NOT NULL DEFAULT false,
    
    position INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_item_name_length CHECK (char_length(name) BETWEEN 1 AND 80),
    CONSTRAINT valid_item_desc_length CHECK (description IS NULL OR char_length(description) <= 300),
    CONSTRAINT valid_item_price CHECK (price_cents >= 0 AND price_cents <= 999999999),
    CONSTRAINT valid_compare_price CHECK (compare_at_price_cents IS NULL OR compare_at_price_cents > price_cents),
    
    UNIQUE (section_id, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_items_section_id ON items(section_id);
CREATE INDEX idx_items_position ON items(section_id, position);
CREATE INDEX idx_items_available ON items(section_id) WHERE available = true AND hidden_by_plan = false;
```

---

## 12. item_option_groups

```sql
CREATE TABLE item_option_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    
    name VARCHAR(60) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'single',  -- 'single' (obligatorio), 'multiple' (extras)
    required BOOLEAN NOT NULL DEFAULT false,
    min_selections INTEGER NOT NULL DEFAULT 0,
    max_selections INTEGER NOT NULL DEFAULT 0,  -- 0 = sin límite
    
    position INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_group_type CHECK (type IN ('single', 'multiple')),
    CONSTRAINT valid_group_name_length CHECK (char_length(name) BETWEEN 1 AND 60),
    CONSTRAINT valid_min_max CHECK (min_selections >= 0 AND max_selections >= 0),
    
    UNIQUE (item_id, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_option_groups_item_id ON item_option_groups(item_id);
```

---

## 13. item_options

```sql
CREATE TABLE item_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_group_id UUID NOT NULL REFERENCES item_option_groups(id) ON DELETE CASCADE,
    
    name VARCHAR(60) NOT NULL,
    price_modifier_cents INTEGER NOT NULL DEFAULT 0,  -- puede ser negativo (descuento)
    
    available BOOLEAN NOT NULL DEFAULT true,
    position INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_option_name_length CHECK (char_length(name) BETWEEN 1 AND 60),
    
    UNIQUE (option_group_id, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_options_group_id ON item_options(option_group_id);
```

---

## 14. tags

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(20),  -- emoji o nombre de ícono
    color VARCHAR(7) DEFAULT '#6b7280',
    
    is_system BOOLEAN NOT NULL DEFAULT false,  -- tags del sistema no se pueden borrar
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tags_slug ON tags(slug);
```

---

## 15. item_tags

```sql
CREATE TABLE item_tags (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    
    PRIMARY KEY (item_id, tag_id)
);

CREATE INDEX idx_item_tags_tag_id ON item_tags(tag_id);
```

---

## 16. menu_settings

```sql
CREATE TABLE menu_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL UNIQUE REFERENCES menus(id) ON DELETE CASCADE,
    
    -- Modalidades
    allow_pickup BOOLEAN NOT NULL DEFAULT true,
    allow_delivery BOOLEAN NOT NULL DEFAULT true,
    allow_table BOOLEAN NOT NULL DEFAULT false,
    
    -- Pedido mínimo
    minimum_order_cents INTEGER NOT NULL DEFAULT 0,
    
    -- Delivery
    delivery_flat_fee_cents INTEGER NOT NULL DEFAULT 0,
    free_delivery_from_cents INTEGER,  -- NULL = no hay envío gratis
    
    -- Pausa
    is_paused BOOLEAN NOT NULL DEFAULT false,
    pause_message TEXT,
    
    -- Pedidos programados
    allow_scheduled BOOLEAN NOT NULL DEFAULT false,
    
    -- Formas de pago (texto informativo)
    payment_methods TEXT,  -- JSON array de strings
    alias_cbu TEXT,
    
    -- Alérgenos
    allergen_notice TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 17. menu_hours

```sql
CREATE TABLE menu_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    
    day_of_week SMALLINT NOT NULL,  -- 0=domingo, 1=lunes, ..., 6=sábado
    opens_at TIME NOT NULL,
    closes_at TIME NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_day CHECK (day_of_week BETWEEN 0 AND 6),
    CONSTRAINT valid_hours CHECK (opens_at < closes_at),
    UNIQUE (menu_id, day_of_week, opens_at)
);

CREATE INDEX idx_menu_hours_menu_day ON menu_hours(menu_id, day_of_week);
```

---

## 18. menu_closed_dates

```sql
CREATE TABLE menu_closed_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    reason VARCHAR(100),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    UNIQUE (menu_id, date)
);

CREATE INDEX idx_closed_dates_menu_date ON menu_closed_dates(menu_id, date);
```

---

## 19. delivery_zones

```sql
CREATE TABLE delivery_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    estimated_minutes INTEGER,
    
    position INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_delivery_zones_menu_id ON delivery_zones(menu_id);
```

---

## 20. orders

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Código público corto (para el local)
    code VARCHAR(10) NOT NULL UNIQUE,
    
    -- Token privado largo (para enlace de detalle)
    token VARCHAR(128) NOT NULL UNIQUE,
    token_expires_at TIMESTAMPTZ NOT NULL,
    
    -- Datos del cliente (mínimos, con aviso de privacidad)
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_notes TEXT,
    
    -- Modalidad
    modality VARCHAR(20) NOT NULL,  -- 'pickup', 'delivery', 'table'
    delivery_zone VARCHAR(100),
    table_number VARCHAR(10),
    scheduled_at TIMESTAMPTZ,
    
    -- Pagos (texto informativo)
    payment_method VARCHAR(50),
    
    -- Totales recalculados en servidor (centavos)
    subtotal_cents INTEGER NOT NULL,
    delivery_fee_cents INTEGER NOT NULL DEFAULT 0,
    discount_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL,
    
    -- Cupón aplicado
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    coupon_code VARCHAR(50),
    
    -- Estado
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    
    -- Idempotencia
    idempotency_key VARCHAR(128) UNIQUE,
    
    -- WhatsApp
    whatsapp_url TEXT,
    whatsapp_sent_at TIMESTAMPTZ,
    
    -- Anonimización (Ley 25.326)
    anonymized_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_modality CHECK (modality IN ('pickup', 'delivery', 'table')),
    CONSTRAINT valid_order_status CHECK (status IN ('new', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    CONSTRAINT valid_totals CHECK (total_cents >= 0)
);

CREATE INDEX idx_orders_menu_id ON orders(menu_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_code ON orders(code);
CREATE INDEX idx_orders_token ON orders(token);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

---

## 21. order_items

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Snapshot del artículo (no FK a items, para preservar histórico)
    item_id UUID,  -- puede ser NULL si se borró el artículo
    item_name VARCHAR(80) NOT NULL,
    item_price_cents INTEGER NOT NULL,
    
    -- Snapshot de opciones
    options_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Estructura: [{group_name, option_name, price_modifier_cents}]
    
    -- Nota del cliente
    note VARCHAR(120),
    
    -- Cantidad
    quantity INTEGER NOT NULL DEFAULT 1,
    
    -- Precio calculado (unitario con opciones)
    unit_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    
    position INTEGER NOT NULL DEFAULT 0,
    
    CONSTRAINT valid_quantity CHECK (quantity BETWEEN 1 AND 99),
    CONSTRAINT valid_note_length CHECK (note IS NULL OR char_length(note) <= 120)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

---

## 22. promotions

```sql
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,  -- 'fixed_price', 'percentage', 'combo'
    
    -- Para fixed_price y percentage
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    discounted_price_cents INTEGER,
    discount_percentage INTEGER,  -- 0-100
    
    -- Para combo
    combo_price_cents INTEGER,
    combo_config JSONB,  -- {groups: [{item_ids: [...], required: true}]}
    
    -- Vigencia
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_promo_type CHECK (type IN ('fixed_price', 'percentage', 'combo')),
    CONSTRAINT valid_discount CHECK (discount_percentage IS NULL OR discount_percentage BETWEEN 1 AND 99)
);

CREATE INDEX idx_promotions_menu_id ON promotions(menu_id);
CREATE INDEX idx_promotions_active ON promotions(menu_id) WHERE is_active = true AND ends_at > now();
```

---

## 23. coupons

```sql
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,  -- 'percentage', 'fixed'
    value INTEGER NOT NULL,  -- porcentaje (1-99) o monto en centavos
    
    minimum_order_cents INTEGER NOT NULL DEFAULT 0,
    max_discount_cents INTEGER,  -- tope para porcentajes
    
    max_uses INTEGER,  -- NULL = ilimitado
    uses_count INTEGER NOT NULL DEFAULT 0,
    max_uses_per_customer INTEGER,  -- NULL = ilimitado
    
    expires_at TIMESTAMPTZ,
    
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_coupon_type CHECK (type IN ('percentage', 'fixed')),
    CONSTRAINT valid_coupon_value CHECK (
        (type = 'percentage' AND value BETWEEN 1 AND 99) OR
        (type = 'fixed' AND value > 0)
    ),
    UNIQUE (menu_id, code)
);

CREATE INDEX idx_coupons_menu_id ON coupons(menu_id);
CREATE INDEX idx_coupons_code ON coupons(menu_id, code);
CREATE INDEX idx_coupons_active ON coupons(menu_id) WHERE is_active = true AND (expires_at IS NULL OR expires_at > now());
```

---

## 24. coupon_redemptions

```sql
CREATE TABLE coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    customer_phone VARCHAR(20),  -- para límite por cliente
    discount_cents INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coupon_redemptions_coupon_id ON coupon_redemptions(coupon_id);
CREATE INDEX idx_coupon_redemptions_phone ON coupon_redemptions(customer_phone);
```

---

## 25. ai_import_jobs

```sql
CREATE TABLE ai_import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    menu_id UUID REFERENCES menus(id) ON DELETE SET NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'processing', 'completed', 'failed', 'reviewed', 'confirmed'
    
    -- Archivos subidos (paths en storage privado)
    files JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Resultado de la IA
    result JSONB,
    -- Estructura: {sections: [{title, items: [{name, description, price_cents, confidence, doubt_note}]}]}
    
    error TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    
    -- Modelo y tokens usados
    model VARCHAR(100),
    input_tokens INTEGER,
    output_tokens INTEGER,
    
    expires_at TIMESTAMPTZ NOT NULL,  -- 24h después de crear
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_ai_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reviewed', 'confirmed'))
);

CREATE INDEX idx_ai_jobs_user_id ON ai_import_jobs(user_id);
CREATE INDEX idx_ai_jobs_status ON ai_import_jobs(status);
CREATE INDEX idx_ai_jobs_expires ON ai_import_jobs(expires_at);
```

---

## 26. templates

```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- Estructura en JSON (secciones + items de ejemplo)
    structure JSONB NOT NULL,
    
    preview_image_url TEXT,
    
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 27. referrals

```sql
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'completed', 'expired'
    benefit_type VARCHAR(20),  -- 'free_month', 'credit'
    benefit_value_cents INTEGER,
    
    -- Se completa cuando el referido paga
    completed_at TIMESTAMPTZ,
    payment_id UUID REFERENCES payments(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_referral_status CHECK (status IN ('pending', 'completed', 'expired')),
    CONSTRAINT no_self_referral CHECK (referrer_id != referred_id),
    UNIQUE (referred_id)  -- un usuario solo puede ser referido una vez
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(status);
```

---

## 28. transfer_proofs

```sql
CREATE TABLE transfer_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    file_url TEXT NOT NULL,  -- disco privado, URL firmada
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    
    reference_code VARCHAR(100),
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
    reviewed_by UUID REFERENCES users(id),
    review_reason TEXT,
    reviewed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_proof_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX idx_transfer_proofs_user ON transfer_proofs(user_id);
CREATE INDEX idx_transfer_proofs_status ON transfer_proofs(status);
```

---

## 29. business_events (sin PII)

```sql
CREATE TABLE business_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    menu_id UUID REFERENCES menus(id) ON DELETE SET NULL,
    
    event_type VARCHAR(50) NOT NULL,  -- 'menu_view', 'item_click', 'cart_add', 'checkout_start'
    
    metadata JSONB DEFAULT '{}'::jsonb,
    
    ip INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_events_type ON business_events(event_type);
CREATE INDEX idx_business_events_menu ON business_events(menu_id);
CREATE INDEX idx_business_events_created ON business_events(created_at);
```

---

## 30. menu_analytics

```sql
CREATE TABLE menu_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    
    event VARCHAR(20) NOT NULL,  -- 'view', 'order_click', 'item_click'
    item_id UUID,
    
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    count INTEGER NOT NULL DEFAULT 1,
    
    UNIQUE (menu_id, event, item_id, date)
);

CREATE INDEX idx_analytics_menu_date ON menu_analytics(menu_id, date);
CREATE INDEX idx_analytics_event ON menu_analytics(menu_id, event, date);
```

---

## 31. support_tickets

```sql
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',  -- 'open', 'closed'
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_ticket_status CHECK (status IN ('open', 'closed'))
);

CREATE INDEX idx_tickets_user_id ON support_tickets(user_id);
```

---

## 32. email_events

```sql
CREATE TABLE email_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    type VARCHAR(100) NOT NULL,  -- 'welcome', 'verify_email', 'payment_success', etc.
    status VARCHAR(20) NOT NULL DEFAULT 'sent',  -- 'sent', 'failed', 'bounced'
    
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_events_user ON email_events(user_id);
CREATE INDEX idx_email_events_type ON email_events(type);
```

---

## Triggers de Límites de Plan

```sql
-- Función para verificar límite de menús
CREATE OR REPLACE FUNCTION check_menu_limit()
RETURNS TRIGGER AS $$
DECLARE
    user_plan_max INTEGER;
    current_count INTEGER;
BEGIN
    -- Obtener límite del plan activo
    SELECT p.max_menus INTO user_plan_max
    FROM subscriptions s
    JOIN plans p ON p.id = s.plan_id
    WHERE s.user_id = NEW.user_id
    AND s.status IN ('active', 'trialing')
    ORDER BY s.created_at DESC
    LIMIT 1;
    
    -- Si no tiene suscripción activa, usar plan gratis
    IF user_plan_max IS NULL THEN
        SELECT max_menus INTO user_plan_max FROM plans WHERE code = 'free';
    END IF;
    
    -- Si es ilimitado, permitir
    IF user_plan_max IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Contar menús activos actuales (con lock)
    SELECT COUNT(*) INTO current_count
    FROM menus
    WHERE user_id = NEW.user_id
    AND status IN ('draft', 'active')
    AND hidden_by_plan = false
    FOR UPDATE;
    
    -- Verificar límite
    IF current_count >= user_plan_max THEN
        RAISE EXCEPTION 'PLAN_LIMIT: Límite de menús alcanzado para tu plan actual';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_menu
    BEFORE INSERT ON menus
    FOR EACH ROW
    EXECUTE FUNCTION check_menu_limit();

-- Función para verificar límite de items por menú
CREATE OR REPLACE FUNCTION check_items_per_menu_limit()
RETURNS TRIGGER AS $$
DECLARE
    v_menu_id UUID;
    v_user_id UUID;
    user_plan_max INTEGER;
    current_count INTEGER;
BEGIN
    -- Obtener menu_id y user_id
    IF TG_TABLE_NAME = 'items' THEN
        SELECT m.id, m.user_id INTO v_menu_id, v_user_id
        FROM sections s
        JOIN menus m ON m.id = s.menu_id
        WHERE s.id = NEW.section_id;
    END IF;
    
    -- Obtener límite del plan
    SELECT p.max_items_per_menu INTO user_plan_max
    FROM subscriptions s
    JOIN plans p ON p.id = s.plan_id
    WHERE s.user_id = v_user_id
    AND s.status IN ('active', 'trialing')
    ORDER BY s.created_at DESC
    LIMIT 1;
    
    IF user_plan_max IS NULL THEN
        SELECT max_items_per_menu INTO user_plan_max FROM plans WHERE code = 'free';
    END IF;
    
    -- Contar items actuales
    SELECT COUNT(*) INTO current_count
    FROM items i
    JOIN sections s ON s.id = i.section_id
    WHERE s.menu_id = v_menu_id
    AND i.hidden_by_plan = false
    FOR UPDATE;
    
    IF current_count >= user_plan_max THEN
        RAISE EXCEPTION 'PLAN_LIMIT: Límite de artículos por menú alcanzado';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_item
    BEFORE INSERT ON items
    FOR EACH ROW
    EXECUTE FUNCTION check_items_per_menu_limit();
```

---

## Seeders

### PlanSeeder.php

```php
$plans = [
    [
        'code' => 'free',
        'name' => 'Gratis',
        'price_monthly_cents' => 0,
        'price_yearly_cents' => 0,
        'max_menus' => 1,
        'max_items_per_menu' => 40,
        'max_option_groups_per_item' => 2,
        'storage_quota_mb' => 50,
        'max_ai_imports_monthly' => 1,
        'order_retention_days' => 0,
        'features' => [
            'removeBranding' => false,
            'qr' => true,
            'qrPerTable' => false,
            'promotions' => false,
            'combos' => false,
            'coupons' => false,
            'analytics' => false,
            'analyticsFull' => false,
            'csvExport' => false,
            'extraThemes' => false,
            'prioritySupport' => false,
            'scheduledOrders' => false,
        ],
        'sort_order' => 0,
    ],
    [
        'code' => 'basic',
        'name' => 'Básico',
        'price_monthly_cents' => 800000,  // $8.000 ARS
        'price_yearly_cents' => 8000000,  // 10 × mensual
        'max_menus' => 2,
        'max_items_per_menu' => 150,
        'max_option_groups_per_item' => null,  // ilimitado
        'storage_quota_mb' => 200,
        'max_ai_imports_monthly' => 5,
        'order_retention_days' => 90,
        'features' => [
            'removeBranding' => true,
            'qr' => true,
            'qrPerTable' => false,
            'promotions' => true,
            'combos' => false,
            'coupons' => false,
            'analytics' => true,
            'analyticsFull' => false,
            'csvExport' => false,
            'extraThemes' => false,
            'prioritySupport' => false,
            'scheduledOrders' => true,
        ],
        'sort_order' => 1,
    ],
    [
        'code' => 'premium',
        'name' => 'Premium',
        'price_monthly_cents' => 2000000,  // $20.000 ARS
        'price_yearly_cents' => 20000000,  // 10 × mensual
        'max_menus' => 5,
        'max_items_per_menu' => 500,
        'max_option_groups_per_item' => null,
        'storage_quota_mb' => 1000,
        'max_ai_imports_monthly' => 30,
        'order_retention_days' => 365,
        'features' => [
            'removeBranding' => true,
            'qr' => true,
            'qrPerTable' => true,
            'promotions' => true,
            'combos' => true,
            'coupons' => true,
            'analytics' => true,
            'analyticsFull' => true,
            'csvExport' => true,
            'extraThemes' => true,
            'prioritySupport' => true,
            'scheduledOrders' => true,
        ],
        'sort_order' => 2,
    ],
];
```

### TagSeeder.php

```php
$tags = [
    ['slug' => 'vegan', 'name' => 'Vegano', 'icon' => '🌱', 'color' => '#10b981', 'is_system' => true],
    ['slug' => 'vegetarian', 'name' => 'Vegetariano', 'icon' => '🥬', 'color' => '#22c55e', 'is_system' => true],
    ['slug' => 'gluten_free', 'name' => 'Sin TACC', 'icon' => '🌾', 'color' => '#f59e0b', 'is_system' => true],
    ['slug' => 'spicy', 'name' => 'Picante', 'icon' => '🌶️', 'color' => '#ef4444', 'is_system' => true],
    ['slug' => 'featured', 'name' => 'Destacado', 'icon' => '⭐', 'color' => '#f97316', 'is_system' => true],
    ['slug' => 'new', 'name' => 'Nuevo', 'icon' => '✨', 'color' => '#8b5cf6', 'is_system' => true],
    ['slug' => 'popular', 'name' => 'El más pedido', 'icon' => '🔥', 'color' => '#ec4899', 'is_system' => true],
];
```

### AdminUserSeeder.php (solo local)

```php
User::create([
    'name' => 'Admin',
    'email' => 'admin@menucraft.local',
    'password' => Hash::make('password123'),
    'email_verified_at' => now(),
    'role' => 'admin',
    'two_factor_confirmed_at' => now(),  // Simulado para local
]);
```

### DemoUserSeeder.php

```php
// Usuario demo con menú completo
$user = User::create([...]);
$profile = Profile::create([...]);
$menu = Menu::create([...]);
// Secciones: Entradas, Principales, Bebidas, Postres
// Items: 3-5 por sección con opciones y tags
// Suscripción: plan free
```

---

## Resumen

| Tabla | Propósito |
|-------|-----------|
| users | Autenticación y roles |
| profiles | Datos del local |
| plans | Definición de planes |
| subscriptions | Suscripciones activas |
| payments | Historial de pagos |
| webhook_events | Idempotencia de webhooks |
| admin_audit_log | Auditoría append-only |
| menus | Cartas digitales |
| slug_redirects | Redirecciones 301 |
| sections | Categorías del menú |
| items | Productos |
| item_option_groups | Grupos de variantes |
| item_options | Opciones individuales |
| tags | Etiquetas de productos |
| item_tags | Relación items-tags |
| menu_settings | Configuración del local |
| menu_hours | Horarios de atención |
| menu_closed_dates | Días cerrados |
| delivery_zones | Zonas de delivery |
| orders | Pedidos |
| order_items | Items del pedido (snapshot) |
| promotions | Promociones activas |
| coupons | Cupones de descuento |
| coupon_redemptions | Historial de cupones |
| ai_import_jobs | Importaciones con IA |
| templates | Plantillas por rubro |
| referrals | Referidos |
| transfer_proofs | Comprobantes de transferencia |
| business_events | Eventos sin PII |
| menu_analytics | Analíticas de menú |
| support_tickets | Tickets de soporte |
| email_events | Historial de emails |

**Total: 32 tablas**

# Estructura de Carpetas del Proyecto

## Organización por Dominio (Domain-Driven Design)

```
menucraft/
├── app/
│   ├── Auth/                          # Dominio: Autenticación
│   │   ├── Actions/
│   │   │   ├── RegisterUser.php
│   │   │   ├── VerifyEmail.php
│   │   │   ├── ResendVerification.php
│   │   │   ├── EnableTwoFactor.php
│   │   │   ├── DisableTwoFactor.php
│   │   │   ├── DeleteAccount.php
│   │   │   └── SuspendUser.php
│   │   ├── DTOs/
│   │   │   ├── RegisterData.php
│   │   │   └── ProfileData.php
│   │   ├── Events/
│   │   │   ├── UserRegistered.php
│   │   │   ├── UserSuspended.php
│   │   │   └── AccountDeleted.php
│   │   ├── Listeners/
│   │   │   ├── SendWelcomeEmail.php
│   │   │   └── CreateDefaultProfile.php
│   │   ├── Models/
│   │   │   └── User.php              # Extends Authenticatable + MustVerifyEmail
│   │   ├── Policies/
│   │   │   └── UserProfilePolicy.php
│   │   └── ValueObjects/
│   │       └── WhatsAppNumber.php
│   │
│   ├── Menus/                         # Dominio: Menús y Carta
│   │   ├── Actions/
│   │   │   ├── CreateMenu.php
│   │   │   ├── UpdateMenu.php
│   │   │   ├── DeleteMenu.php
│   │   │   ├── DuplicateMenu.php
│   │   │   ├── CreateSection.php
│   │   │   ├── UpdateSection.php
│   │   │   ├── DeleteSection.php
│   │   │   ├── ReorderSections.php
│   │   │   ├── CreateItem.php
│   │   │   ├── UpdateItem.php
│   │   │   ├── DeleteItem.php
│   │   │   ├── ReorderItems.php
│   │   │   ├── MoveItemBetweenSections.php
│   │   │   ├── UploadItemImage.php
│   │   │   ├── DeleteItemImage.php
│   │   │   ├── CreateOptionGroup.php
│   │   │   ├── UpdateOptionGroup.php
│   │   │   ├── DeleteOptionGroup.php
│   │   │   ├── CreateOption.php
│   │   │   ├── UpdateOption.php
│   │   │   ├── DeleteOption.php
│   │   │   ├── AssignTag.php
│   │   │   ├── RemoveTag.php
│   │   │   ├── UpdateMenuDesign.php
│   │   │   ├── UploadBanner.php
│   │   │   ├── DeleteBanner.php
│   │   │   ├── UpdateMenuSettings.php
│   │   │   ├── UpdateMenuHours.php
│   │   │   ├── AddClosedDate.php
│   │   │   ├── RemoveClosedDate.php
│   │   │   ├── AddDeliveryZone.php
│   │   │   ├── UpdateDeliveryZone.php
│   │   │   ├── RemoveDeliveryZone.php
│   │   │   ├── GenerateQrCode.php
│   │   │   └── GenerateSlugRedirect.php
│   │   ├── DTOs/
│   │   │   ├── MenuData.php
│   │   │   ├── SectionData.php
│   │   │   ├── ItemData.php
│   │   │   ├── OptionGroupData.php
│   │   │   ├── OptionData.php
│   │   │   ├── DesignData.php
│   │   │   ├── SettingsData.php
│   │   │   ├── HoursData.php
│   │   │   └── DeliveryZoneData.php
│   │   ├── Enums/
│   │   │   ├── MenuStatus.php        # draft, active, archived
│   │   │   ├── TagType.php           # vegan, vegetarian, gluten_free, spicy, featured, new, popular
│   │   │   ├── DayOfWeek.php         # monday, tuesday, etc.
│   │   │   └── DeliveryModality.php  # pickup, delivery, table
│   │   ├── Events/
│   │   │   ├── MenuCreated.php
│   │   │   ├── MenuUpdated.php
│   │   │   ├── MenuPublished.php
│   │   │   ├── MenuArchived.php
│   │   │   └── MenuCacheInvalidated.php
│   │   ├── Jobs/
│   │   │   └── InvalidateMenuCache.php
│   │   ├── Models/
│   │   │   ├── Menu.php
│   │   │   ├── Section.php
│   │   │   ├── Item.php
│   │   │   ├── ItemOptionGroup.php
│   │   │   ├── ItemOption.php
│   │   │   ├── Tag.php
│   │   │   ├── MenuSetting.php
│   │   │   ├── MenuHour.php
│   │   │   ├── MenuClosedDate.php
│   │   │   ├── DeliveryZone.php
│   │   │   └── SlugRedirect.php
│   │   ├── Policies/
│   │   │   ├── MenuPolicy.php
│   │   │   ├── SectionPolicy.php
│   │   │   ├── ItemPolicy.php
│   │   │   ├── OptionGroupPolicy.php
│   │   │   └── OptionPolicy.php
│   │   ├── Services/
│   │   │   ├── MenuSlugGenerator.php
│   │   │   ├── ContrastCalculator.php
│   │   │   └── QrCodeGenerator.php
│   │   └── ValueObjects/
│   │       ├── HexColor.php
│   │       └── Price.php
│   │
│   ├── Orders/                        # Dominio: Pedidos
│   │   ├── Actions/
│   │   │   ├── CreatePublicOrder.php
│   │   │   ├── UpdateOrderStatus.php
│   │   │   ├── CancelOrder.php
│   │   │   ├── CalculateOrderTotal.php
│   │   │   ├── ValidateOrderData.php
│   │   │   ├── ApplyCoupon.php
│   │   │   ├── GenerateOrderToken.php
│   │   │   └── AnonymizeOldOrders.php
│   │   ├── DTOs/
│   │   │   ├── OrderData.php
│   │   │   ├── OrderItemData.php
│   │   │   └── CustomerData.php
│   │   ├── Enums/
│   │   │   ├── OrderStatus.php       # new, confirmed, preparing, ready, delivered, cancelled
│   │   │   └── PaymentMethod.php     # cash, transfer, card
│   │   ├── Events/
│   │   │   ├── OrderCreated.php
│   │   │   ├── OrderStatusChanged.php
│   │   │   └── OrderCancelled.php
│   │   ├── Listeners/
│   │   │   ├── NotifyNewOrder.php
│   │   │   └── SendOrderConfirmation.php
│   │   ├── Models/
│   │   │   ├── Order.php
│   │   │   └── OrderItem.php
│   │   ├── Policies/
│   │   │   └── OrderPolicy.php
│   │   └── Services/
│   │       ├── OrderCalculator.php
│   │       ├── WhatsAppMessageBuilder.php
│   │       └── OrderRetentionPolicy.php
│   │
│   ├── Billing/                       # Dominio: Planes y Pagos
│   │   ├── Actions/
│   │   │   ├── CreateSubscription.php
│   │   │   ├── CancelSubscription.php
│   │   │   ├── ResumeSubscription.php
│   │   │   ├── ChangePlan.php
│   │   │   ├── ExtendSubscription.php
│   │   │   ├── ProcessMercadoPagoWebhook.php
│   │   │   ├── VerifyMercadoPagoSignature.php
│   │   │   ├── ReconcileSubscriptions.php
│   │   │   ├── DegradePlan.php
│   │   │   ├── ArchiveExcessResources.php
│   │   │   ├── ReactivateArchivedResources.php
│   │   │   ├── StartFreeTrial.php
│   │   │   ├── EndFreeTrial.php
│   │   │   ├── UploadTransferProof.php
│   │   │   ├── ApproveTransfer.php
│   │   │   ├── RejectTransfer.php
│   │   │   └── ApplyReferralBenefit.php
│   │   ├── DTOs/
│   │   │   ├── SubscriptionData.php
│   │   │   ├── PaymentData.php
│   │   │   └── WebhookEventData.php
│   │   ├── Enums/
│   │   │   ├── PlanCode.php          # free, basic, premium
│   │   │   ├── SubscriptionStatus.php # active, trialing, past_due, cancelled, expired
│   │   │   ├── PaymentStatus.php     # approved, pending, rejected, refunded
│   │   │   ├── BillingInterval.php   # monthly, yearly
│   │   │   └── PaymentMethod.php     # mercadopago, transfer
│   │   ├── Events/
│   │   │   ├── SubscriptionCreated.php
│   │   │   ├── SubscriptionCancelled.php
│   │   │   ├── PaymentReceived.php
│   │   │   ├── PaymentFailed.php
│   │   │   ├── PlanDegraded.php
│   │   │   ├── TrialStarted.php
│   │   │   ├── TrialEnded.php
│   │   │   └── TransferApproved.php
│   │   ├── Jobs/
│   │   │   ├── ProcessWebhookEvent.php
│   │   │   └── SendPaymentReminder.php
│   │   ├── Listeners/
│   │   │   ├── SendPaymentSuccessEmail.php
│   │   │   ├── SendPaymentFailedEmail.php
│   │   │   ├── SendTrialEndingEmail.php
│   │   │   └── SendPlanDegradedEmail.php
│   │   ├── Models/
│   │   │   ├── Plan.php
│   │   │   ├── Subscription.php
│   │   │   ├── Payment.php
│   │   │   ├── WebhookEvent.php
│   │   │   └── TransferProof.php
│   │   ├── Policies/
│   │   │   └── SubscriptionPolicy.php
│   │   └── Services/
│   │       ├── Entitlements.php      # ÚNICA fuente de verdad para límites
│   │       ├── EntitlementsDto.php
│   │       ├── MercadoPagoClient.php
│   │       └── SubscriptionReconciler.php
│   │
│   ├── Ai/                            # Dominio: Importación con IA
│   │   ├── Actions/
│   │   │   ├── StartAiImport.php
│   │   │   ├── ProcessAiImport.php
│   │   │   ├── ReviewAiImport.php
│   │   │   ├── ConfirmAiImport.php
│   │   │   ├── RejectAiImport.php
│   │   │   └── CleanupExpiredImports.php
│   │   ├── DTOs/
│   │   │   ├── AiImportData.php
│   │   │   └── AiImportResult.php
│   │   ├── Enums/
│   │   │   └── AiImportStatus.php    # pending, processing, completed, failed, reviewed, confirmed
│   │   ├── Events/
│   │   │   ├── AiImportStarted.php
│   │   │   ├── AiImportCompleted.php
│   │   │   └── AiImportFailed.php
│   │   ├── Jobs/
│   │   │   └── ProcessAiImportJob.php
│   │   ├── Models/
│   │   │   └── AiImportJob.php
│   │   ├── Policies/
│   │   │   └── AiImportJobPolicy.php
│   │   └── Services/
│   │       ├── AnthropicClient.php
│   │       ├── AiPromptBuilder.php
│   │       └── AiResultValidator.php
│   │
│   ├── Promotions/                    # Dominio: Promociones y Cupones
│   │   ├── Actions/
│   │   │   ├── CreatePromotion.php
│   │   │   ├── UpdatePromotion.php
│   │   │   ├── DeletePromotion.php
│   │   │   ├── CreateCoupon.php
│   │   │   ├── UpdateCoupon.php
│   │   │   ├── DeleteCoupon.php
│   │   │   ├── RedeemCoupon.php
│   │   │   └── ExpireOldPromotions.php
│   │   ├── DTOs/
│   │   │   ├── PromotionData.php
│   │   │   └── CouponData.php
│   │   ├── Enums/
│   │   │   ├── PromotionType.php     # fixed_price, percentage, combo
│   │   │   └── CouponType.php        # percentage, fixed
│   │   ├── Models/
│   │   │   ├── Promotion.php
│   │   │   ├── Coupon.php
│   │   │   └── CouponRedemption.php
│   │   ├── Policies/
│   │   │   ├── PromotionPolicy.php
│   │   │   └── CouponPolicy.php
│   │   └── Services/
│   │       ├── PromotionCalculator.php
│   │       └── CouponValidator.php
│   │
│   ├── Referrals/                     # Dominio: Referidos
│   │   ├── Actions/
│   │   │   ├── GenerateReferralCode.php
│   │   │   ├── ApplyReferralCode.php
│   │   │   └── GrantReferralBenefit.php
│   │   ├── Models/
│   │   │   └── Referral.php
│   │   ├── Policies/
│   │   │   └── ReferralPolicy.php
│   │   └── Services/
│   │       └── ReferralValidator.php
│   │
│   ├── Admin/                         # Dominio: Panel de Administración
│   │   ├── Actions/
│   │   │   ├── SuspendUser.php
│   │   │   ├── ReactivateUser.php
│   │   │   ├── ChangeUserPlan.php
│   │   │   ├── ExtendUserSubscription.php
│   │   │   ├── CancelUserSubscription.php
│   │   │   ├── UpdatePlan.php
│   │   │   ├── ReprocessWebhook.php
│   │   │   └── AuditAction.php
│   │   ├── DTOs/
│   │   │   └── AuditData.php
│   │   ├── Enums/
│   │   │   └── AuditActionType.php
│   │   ├── Events/
│   │   │   └── AdminActionAudited.php
│   │   ├── Listeners/
│   │   │   └── RecordAuditLog.php
│   │   ├── Models/
│   │   │   └── AdminAuditLog.php
│   │   └── Services/
│   │       └── AdminMetricsCalculator.php
│   │
│   ├── Support/                       # Dominio: Soporte
│   │   ├── Actions/
│   │   │   ├── CreateSupportTicket.php
│   │   │   └── UpdateSupportTicket.php
│   │   ├── Models/
│   │   │   └── SupportTicket.php
│   │   └── Policies/
│   │       └── SupportTicketPolicy.php
│   │
│   ├── Shared/                        # Código compartido entre dominios
│   │   ├── Casts/
│   │   │   ├── MoneyCast.php         # Centavos ↔ dollars
│   │   │   ├── SanitizedTextCast.php # Saneamiento de texto
│   │   │   └── HexColorCast.php      # Validación de color hex
│   │   ├── Concerns/
│   │   │   ├── HasUuid.php
│   │   │   ├── HasSlug.php
│   │   │   └── BelongsToUser.php
│   │   ├── DTOs/
│   │   │   └── PaginatedData.php
│   │   ├── Enums/
│   │   │   └── UserRole.php          # user, admin
│   │   ├── Exceptions/
│   │   │   ├── PlanLimitExceededException.php
│   │   │   ├── InvalidImageException.php
│   │   │   ├── SubscriptionRequiredException.php
│   │   │   └── AccountSuspendedException.php
│   │   ├── Http/
│   │   │   ├── Middleware/
│   │   │   │   ├── EnsureUserIsActive.php
│   │   │   │   ├── EnsureAdmin.php
│   │   │   │   ├── VerifyOrigin.php
│   │   │   │   └── SecurityHeaders.php
│   │   │   └── Controllers/
│   │   │       └── Controller.php
│   │   ├── Rules/
│   │   │   ├── HexColor.php
│   │   │   ├── WhatsAppNumber.php
│   │   │   └── ValidImageFile.php
│   │   ├── Services/
│   │   │   ├── ImageProcessor.php
│   │   │   ├── TextSanitizer.php
│   │   │   └── SlugGenerator.php
│   │   └── Traits/
│   │       └── Auditable.php
│   │
│   ├── Console/
│   │   └── Commands/
│   │       ├── CreateAdmin.php
│   │       ├── ReconcileSubscriptions.php
│   │       ├── ExpireOldOrders.php
│   │       ├── CleanupAiImports.php
│   │       └── SendPaymentReminders.php
│   │
│   ├── Filament/                      # Panel de administración (Filament 5)
│   │   ├── Pages/
│   │   │   ├── Dashboard.php
│   │   │   └── AuditLog.php
│   │   ├── Resources/
│   │   │   ├── UserResource.php
│   │   │   ├── SubscriptionResource.php
│   │   │   ├── PaymentResource.php
│   │   │   ├── PlanResource.php
│   │   │   ├── WebhookEventResource.php
│   │   │   ├── TransferProofResource.php
│   │   │   └── ReferralResource.php
│   │   └── Widgets/
│   │       ├── StatsOverview.php
│   │       └── ActivationFunnel.php
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Marketing/
│   │   │   │   ├── LandingController.php
│   │   │   │   ├── PricingController.php
│   │   │   │   └── LegalController.php
│   │   │   ├── PublicMenu/
│   │   │   │   ├── MenuController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   └── EventController.php
│   │   │   ├── Webhooks/
│   │   │   │   └── MercadoPagoWebhookController.php
│   │   │   └── Api/
│   │   │       └── PublicOrderApiController.php
│   │   └── Requests/
│   │       ├── Auth/
│   │       │   ├── RegisterRequest.php
│   │       │   ├── LoginRequest.php
│   │       │   └── UpdateProfileRequest.php
│   │       ├── Menus/
│   │       │   ├── CreateMenuRequest.php
│   │       │   ├── UpdateMenuRequest.php
│   │       │   ├── CreateSectionRequest.php
│   │       │   ├── UpdateSectionRequest.php
│   │       │   ├── CreateItemRequest.php
│   │       │   ├── UpdateItemRequest.php
│   │       │   ├── ReorderSectionsRequest.php
│   │       │   ├── ReorderItemsRequest.php
│   │       │   └── UpdateDesignRequest.php
│   │       ├── Orders/
│   │       │   └── CreatePublicOrderRequest.php
│   │       └── Billing/
│   │           ├── CreateSubscriptionRequest.php
│   │           └── UploadTransferProofRequest.php
│   │
│   ├── Livewire/                      # Componentes Livewire
│   │   ├── Onboarding/
│   │   │   ├── Wizard.php
│   │   │   └── Checklist.php
│   │   ├── Menus/
│   │   │   ├── MenuList.php
│   │   │   ├── MenuEditor.php
│   │   │   ├── ItemForm.php
│   │   │   ├── OptionGroups.php
│   │   │   ├── ImageUploader.php
│   │   │   ├── DesignPanel.php
│   │   │   ├── Settings.php
│   │   │   ├── Promotions.php
│   │   │   ├── Coupons.php
│   │   │   └── QrDownload.php
│   │   ├── Orders/
│   │   │   ├── OrderList.php
│   │   │   └── OrderDetail.php
│   │   ├── Ai/
│   │   │   ├── ImportWizard.php
│   │   │   └── ImportReview.php
│   │   ├── Billing/
│   │   │   ├── PlanPage.php
│   │   │   └── TransferProofUpload.php
│   │   ├── Profile/
│   │   │   └── ProfileForm.php
│   │   ├── Referrals/
│   │   │   └── ReferralPanel.php
│   │   └── Support/
│   │       └── HelpButton.php
│   │
│   └── Providers/
│       ├── AppServiceProvider.php
│       ├── FortifyServiceProvider.php
│       └── FilamentServiceProvider.php
│
├── config/
│   ├── menucraft.php                  # Configuración específica de la app
│   ├── mercadopago.php
│   ├── anthropic.php
│   └── filament.php
│
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2026_03_01_000001_create_profiles_table.php
│   │   ├── 2026_03_01_000002_create_plans_table.php
│   │   ├── 2026_03_01_000003_create_subscriptions_table.php
│   │   ├── 2026_03_01_000004_create_payments_table.php
│   │   ├── 2026_03_01_000005_create_webhook_events_table.php
│   │   ├── 2026_03_01_000006_create_admin_audit_log_table.php
│   │   ├── 2026_03_01_000007_create_menus_table.php
│   │   ├── 2026_03_01_000008_create_slug_redirects_table.php
│   │   ├── 2026_03_01_000009_create_sections_table.php
│   │   ├── 2026_03_01_000010_create_items_table.php
│   │   ├── 2026_03_01_000011_create_item_option_groups_table.php
│   │   ├── 2026_03_01_000012_create_item_options_table.php
│   │   ├── 2026_03_01_000013_create_tags_table.php
│   │   ├── 2026_03_01_000014_create_item_tags_table.php
│   │   ├── 2026_03_01_000015_create_menu_settings_table.php
│   │   ├── 2026_03_01_000016_create_menu_hours_table.php
│   │   ├── 2026_03_01_000017_create_menu_closed_dates_table.php
│   │   ├── 2026_03_01_000018_create_delivery_zones_table.php
│   │   ├── 2026_03_01_000019_create_orders_table.php
│   │   ├── 2026_03_01_000020_create_order_items_table.php
│   │   ├── 2026_03_01_000021_create_promotions_table.php
│   │   ├── 2026_03_01_000022_create_coupons_table.php
│   │   ├── 2026_03_01_000023_create_coupon_redemptions_table.php
│   │   ├── 2026_03_01_000024_create_ai_import_jobs_table.php
│   │   ├── 2026_03_01_000025_create_templates_table.php
│   │   ├── 2026_03_01_000026_create_referrals_table.php
│   │   ├── 2026_03_01_000027_create_transfer_proofs_table.php
│   │   ├── 2026_03_01_000028_create_business_events_table.php
│   │   ├── 2026_03_01_000029_create_email_events_table.php
│   │   ├── 2026_03_01_000030_create_support_tickets_table.php
│   │   ├── 2026_03_01_000031_create_menu_analytics_table.php
│   │   └── 2026_03_01_000032_create_triggers_and_functions.php
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── PlanSeeder.php
│   │   ├── TagSeeder.php
│   │   ├── TemplateSeeder.php
│   │   ├── AdminUserSeeder.php
│   │   └── DemoUserSeeder.php
│   └── factories/
│       ├── UserFactory.php
│       ├── MenuFactory.php
│       ├── SectionFactory.php
│       ├── ItemFactory.php
│       ├── OrderFactory.php
│       └── SubscriptionFactory.php
│
├── resources/
│   ├── views/
│   │   ├── layouts/
│   │   │   ├── app.blade.php          # Layout principal
│   │   │   ├── marketing.blade.php    # Landing, precios, legal
│   │   │   ├── dashboard.blade.php    # Panel del usuario
│   │   │   ├── public-menu.blade.php  # Menú público (sin JS)
│   │   │   └── admin.blade.php        # Panel admin (Filament)
│   │   ├── marketing/
│   │   │   ├── landing.blade.php
│   │   │   ├── pricing.blade.php
│   │   │   ├── terms.blade.php
│   │   │   ├── privacy.blade.php
│   │   │   └── cancellation.blade.php
│   │   ├── auth/
│   │   │   ├── login.blade.php
│   │   │   ├── register.blade.php
│   │   │   ├── verify-email.blade.php
│   │   │   ├── forgot-password.blade.php
│   │   │   ├── reset-password.blade.php
│   │   │   └── two-factor.blade.php
│   │   ├── dashboard/
│   │   │   ├── index.blade.php
│   │   │   ├── onboarding/
│   │   │   │   └── wizard.blade.php
│   │   │   ├── menus/
│   │   │   │   ├── index.blade.php
│   │   │   │   └── editor.blade.php
│   │   │   ├── orders/
│   │   │   │   ├── index.blade.php
│   │   │   │   └── show.blade.php
│   │   │   ├── billing/
│   │   │   │   ├── plan.blade.php
│   │   │   │   └── result.blade.php
│   │   │   ├── profile/
│   │   │   │   └── edit.blade.php
│   │   │   └── ai/
│   │   │       ├── import.blade.php
│   │   │       └── review.blade.php
│   │   ├── public-menu/
│   │   │   ├── show.blade.php
│   │   │   └── order-detail.blade.php
│   │   ├── emails/
│   │   │   ├── welcome.blade.php
│   │   │   ├── verify-email.blade.php
│   │   │   ├── payment-success.blade.php
│   │   │   ├── payment-failed.blade.php
│   │   │   ├── trial-ending.blade.php
│   │   │   ├── plan-degraded.blade.php
│   │   │   └── subscription-cancelled.blade.php
│   │   └── errors/
│   │       ├── 404.blade.php
│   │       ├── 403.blade.php
│   │       ├── 419.blade.php
│   │       ├── 429.blade.php
│   │       └── 500.blade.php
│   ├── css/
│   │   └── app.css                    # Tailwind v4
│   └── js/
│       ├── app.js                     # Alpine.js + SortableJS
│       └── public-menu.js             # Solo para menú público (carrito)
│
├── routes/
│   ├── web.php                        # Rutas autenticadas (dashboard)
│   ├── public.php                     # Rutas públicas (menú, marketing)
│   ├── admin.php                      # Rutas admin (Filament)
│   ├── webhooks.php                   # Webhooks (Mercado Pago)
│   └── api.php                        # API pública (pedidos)
│
├── tests/
│   ├── Feature/
│   │   ├── Auth/
│   │   │   ├── RegistrationTest.php
│   │   │   ├── LoginTest.php
│   │   │   ├── EmailVerificationTest.php
│   │   │   ├── PasswordResetTest.php
│   │   │   ├── TwoFactorTest.php
│   │   │   └── AccountDeletionTest.php
│   │   ├── Menus/
│   │   │   ├── MenuCrudTest.php
│   │   │   ├── SectionCrudTest.php
│   │   │   ├── ItemCrudTest.php
│   │   │   ├── ReorderTest.php
│   │   │   ├── ImageUploadTest.php
│   │   │   ├── DesignTest.php
│   │   │   └── AuthorizationTest.php
│   │   ├── Orders/
│   │   │   ├── CreateOrderTest.php
│   │   │   ├── OrderCalculationTest.php
│   │   │   ├── CouponTest.php
│   │   │   └── WhatsAppMessageTest.php
│   │   ├── Billing/
│   │   │   ├── SubscriptionTest.php
│   │   │   ├── PlanLimitsTest.php
│   │   │   ├── WebhookTest.php
│   │   │   ├── TransferTest.php
│   │   │   └── ReferralTest.php
│   │   ├── Ai/
│   │   │   ├── ImportTest.php
│   │   │   └── PromptInjectionTest.php
│   │   ├── Admin/
│   │   │   ├── AdminAccessTest.php
│   │   │   ├── UserManagementTest.php
│   │   │   └── AuditLogTest.php
│   │   └── Security/
│   │       ├── IsolationTest.php
│   │       ├── MassAssignmentTest.php
│   │       ├── CsrfTest.php
│   │       ├── XssTest.php
│   │       └── SqlInjectionTest.php
│   ├── Browser/
│   │   ├── DragAndDropTest.php
│   │   ├── SpaceInFieldsTest.php
│   │   ├── CartTest.php
│   │   └── CheckoutTest.php
│   └── Unit/
│       ├── MoneyCastTest.php
│       ├── TextSanitizerTest.php
│       ├── HexColorTest.php
│       └── EntitlementsTest.php
│
├── storage/
│   ├── app/
│   │   ├── public/                    # Imágenes de menú (públicas)
│   │   └── private/                   # Comprobantes, archivos IA (privados)
│   └── logs/
│
├── .env.example
├── .gitignore
├── composer.json
├── package.json
├── vite.config.js
├── phpunit.xml
├── pint.json
├── phpstan.neon
└── README.md
```

## Principios de Organización

1. **Un dominio = una carpeta**: Cada dominio tiene sus Models, Actions, Policies, DTOs, Events, Jobs
2. **Actions con una responsabilidad**: Cada Action hace UNA cosa y la hace bien
3. **Controllers delgados**: Solo reciben request, invocan Action, retornan response
4. **Livewire delgado**: Componentes invocan Actions, no contienen lógica de negocio
5. **Shared para código transversal**: Casts, Rules, Services, Middleware compartidos
6. **Filament separado**: Panel admin en su propia carpeta, con su guard y policies
7. **Tests por dominio**: Estructura de tests refleja estructura de app

## Reglas de Nomenclatura

- **Models**: Singular (Menu, Section, Item)
- **Actions**: Verbo + Sustantivo (CreateMenu, UpdateItem)
- **DTOs**: Sustantivo + Data (MenuData, OrderData)
- **Events**: Sustantivo + Participio (MenuCreated, OrderCancelled)
- **Jobs**: Verbo + Sustantivo (ProcessWebhookEvent)
- **Policies**: Model + Policy (MenuPolicy, OrderPolicy)
- **Requests**: Verbo + Sustantivo + Request (CreateMenuRequest)
- **Livewire**: Dominio + Componente (Menus\MenuEditor)

import { useApp, plans, formatPrice } from '../store/useStore';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Check, X, Crown, Zap, Star, 
  Menu as MenuIcon
} from 'lucide-react';

export default function Pricing() {
  const { state, dispatch, currentPlan } = useApp();

  const handleSelectPlan = (planCode: string) => {
    if (planCode === state.user.plan) return;
    
    if (planCode === 'free') {
      dispatch({ type: 'UPDATE_USER', user: { plan: 'free' } });
    } else {
      // Simulate payment flow
      const confirmed = confirm(`¿Confirmás la suscripción al plan ${plans.find(p => p.code === planCode)?.name} por ${formatPrice(plans.find(p => p.code === planCode)?.priceCents || 0)}/mes?\n\nSerás redirigido a Mercado Pago para completar el pago.`);
      if (confirmed) {
        dispatch({ type: 'UPDATE_USER', user: { plan: planCode as 'free' | 'basic' | 'premium' } });
        alert('¡Suscripción activada exitosamente!');
      }
    }
  };

  const allFeatures = [
    { key: 'maxMenus', label: 'Menús', values: ['2', '5', 'Ilimitados'] },
    { key: 'maxItemsPerMenu', label: 'Artículos por menú', values: ['30', '100', '300'] },
    { key: 'storageQuotaMb', label: 'Almacenamiento', values: ['50 MB', '200 MB', '1 GB'] },
    { key: 'removeBranding', label: 'Sin marca de agua', values: [false, true, true] },
    { key: 'itemImages', label: 'Imágenes en artículos', values: [false, true, true] },
    { key: 'banner', label: 'Banner personalizado', values: [false, true, true] },
    { key: 'duplicateMenu', label: 'Duplicar menús', values: [false, true, true] },
    { key: 'qr', label: 'Códigos QR', values: [false, false, true] },
    { key: 'analytics', label: 'Analíticas avanzadas', values: [false, false, true] },
    { key: 'extraThemes', label: 'Temas exclusivos', values: [false, false, true] },
    { key: 'prioritySupport', label: 'Soporte prioritario', values: [false, false, true] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button 
              onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <MenuIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MenuCraft</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Elegí el plan ideal para tu negocio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empezá gratis y crecé a tu ritmo. Todos los planes incluyen actualización en tiempo real y soporte por WhatsApp.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => {
            const isCurrentPlan = plan.code === state.user.plan;
            const isPopular = plan.code === 'basic';

            return (
              <motion.div
                key={plan.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative card p-6 ${isPopular ? 'ring-2 ring-primary-500' : ''} ${isCurrentPlan ? 'bg-primary-50/50' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Más popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.code === 'free' && <Zap className="w-5 h-5 text-gray-500" />}
                    {plan.code === 'basic' && <Zap className="w-5 h-5 text-primary-500" />}
                    {plan.code === 'premium' && <Crown className="w-5 h-5 text-primary-500" />}
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {plan.priceCents === 0 ? 'Gratis' : formatPrice(plan.priceCents)}
                    </span>
                    {plan.priceCents > 0 && <span className="text-gray-500">/mes</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      {plan.maxMenus === null ? 'Menús ilimitados' : `${plan.maxMenus} menús`}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Hasta {plan.maxItemsPerMenu} artículos por menú</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{plan.storageQuotaMb} MB de almacenamiento</span>
                  </li>
                  {plan.features.itemImages && (
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Imágenes en artículos</span>
                    </li>
                  )}
                  {plan.features.removeBranding && (
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Sin marca de agua</span>
                    </li>
                  )}
                  {plan.features.qr && (
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Códigos QR para mesas</span>
                    </li>
                  )}
                  {plan.features.analytics && (
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Analíticas avanzadas</span>
                    </li>
                  )}
                  {plan.features.prioritySupport && (
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Soporte prioritario</span>
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.code)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : isPopular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {isCurrentPlan ? '✓ Plan actual' : plan.priceCents === 0 ? 'Empezar gratis' : 'Suscribirme'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Comparación detallada</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Función</th>
                  <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Gratis</th>
                  <th className="text-center px-6 py-3 text-sm font-medium text-primary-600">Básico</th>
                  <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allFeatures.map((feature, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{feature.label}</td>
                    {feature.values.map((value, j) => (
                      <td key={j} className="px-6 py-3 text-center">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Preguntas frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí, podés subir o bajar de plan cuando quieras. Los cambios se aplican inmediatamente.' },
              { q: '¿Qué pasa si cancelo mi suscripción?', a: 'Conservás los beneficios hasta el final del período pagado. Luego tu cuenta vuelve al plan Gratis.' },
              { q: '¿Cómo funciona el pago?', a: 'Usamos Mercado Pago. Podés pagar con tarjeta de crédito, débito o dinero en cuenta.' },
              { q: '¿Hay período de prueba?', a: 'El plan Gratis es para siempre. Los planes pagos incluyen 7 días de prueba gratuita.' },
            ].map((faq, i) => (
              <div key={i} className="card p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

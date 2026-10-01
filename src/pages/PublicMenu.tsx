import { useApp, formatPrice } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShoppingCart, Plus, Minus, X, 
  MessageCircle, Search, ChevronDown, Menu as MenuIcon
} from 'lucide-react';
import { useState, useMemo } from 'react';

export default function PublicMenu() {
  const { state, dispatch, viewingMenu } = useApp();
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const menu = viewingMenu || state.menus[0]; // Fallback to first menu

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Menú no encontrado</p>
      </div>
    );
  }

  const textColor = menu.colorText || (isLightColor(menu.colorBg) ? '#1f2937' : '#ffffff');
  const cartTotal = state.cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const cartCount = state.cart.reduce((acc, c) => acc + c.quantity, 0);

  const sortedSections = [...menu.sections].sort((a, b) => a.position - b.position);

  const filteredSections = sortedSections.map(section => ({
    ...section,
    items: section.items
      .filter(item => item.available)
      .filter(item => 
        !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.position - b.position),
  })).filter(section => section.items.length > 0);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleWhatsApp = () => {
    if (state.cart.length === 0) return;

    const items = state.cart.map(c => `${c.quantity}x ${c.item.name}`).join(', ');
    const total = formatPrice(cartTotal);
    
    let message = menu.orderMessage
      .replace('{items}', items)
      .replace('{total}', total);

    const phone = state.user.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: menu.colorBg, color: textColor }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-40 border-b backdrop-blur-lg"
        style={{ 
          backgroundColor: menu.colorBg + 'ee',
          borderColor: isLightColor(menu.colorBg) ? '#e5e7eb' : 'rgba(255,255,255,0.1)'
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })}
                className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-bold text-lg leading-tight">{state.user.restaurantName}</h1>
                <p className="text-xs opacity-70">{menu.name}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-lg hover:bg-black/5 transition-colors"
              style={{ color: menu.colorPrimary }}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: menu.colorPrimary }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Banner */}
      {menu.bannerUrl && (
        <div className="max-w-lg mx-auto">
          <img src={menu.bannerUrl} alt="" className="w-full h-48 object-cover" />
        </div>
      )}

      {/* Search */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar en el menú..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm"
            style={{ 
              backgroundColor: isLightColor(menu.colorBg) ? '#f9fafb' : 'rgba(255,255,255,0.1)',
              borderColor: isLightColor(menu.colorBg) ? '#e5e7eb' : 'rgba(255,255,255,0.2)',
              color: textColor,
            }}
          />
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-lg mx-auto px-4 pb-32">
        {filteredSections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="mb-6"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between mb-3"
            >
              <h2 className="text-xl font-bold" style={{ color: menu.colorPrimary }}>
                {section.title}
              </h2>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${expandedSections.has(section.id) ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {(!expandedSections.size || expandedSections.has(section.id)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3">
                    {section.items.map(item => {
                      const cartItem = state.cart.find(c => c.item.id === item.id);
                      const quantity = cartItem?.quantity || 0;

                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                          style={{ 
                            backgroundColor: isLightColor(menu.colorBg) ? '#f9fafb' : 'rgba(255,255,255,0.05)',
                          }}
                        >
                          {item.imageUrl && (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{item.name}</h3>
                            {item.description && (
                              <p className="text-xs opacity-70 mt-0.5 line-clamp-2">{item.description}</p>
                            )}
                            <p className="font-bold text-sm mt-1" style={{ color: menu.colorPrimary }}>
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {quantity === 0 ? (
                              <button
                                onClick={() => dispatch({ type: 'ADD_TO_CART', item })}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
                                style={{ backgroundColor: menu.colorPrimary }}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', itemId: item.id, quantity: quantity - 1 })}
                                  className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 active:scale-95"
                                  style={{ borderColor: menu.colorPrimary, color: menu.colorPrimary }}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-bold w-5 text-center">{quantity}</span>
                                <button
                                  onClick={() => dispatch({ type: 'ADD_TO_CART', item })}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
                                  style={{ backgroundColor: menu.colorPrimary }}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {filteredSections.length === 0 && (
          <div className="text-center py-12 opacity-60">
            <p className="text-lg">No se encontraron artículos</p>
            <p className="text-sm mt-1">Probá con otra búsqueda</p>
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-4 left-4 right-4 z-30 max-w-lg mx-auto"
        >
          <button
            onClick={() => setShowCart(true)}
            className="w-full py-4 rounded-2xl shadow-xl flex items-center justify-between px-6 text-white font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: menu.colorPrimary }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span>Ver pedido ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
            </div>
            <span className="text-lg">{formatPrice(cartTotal)}</span>
          </button>
        </motion.div>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[80vh] flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Tu Pedido</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {state.cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.cart.map(cartItem => (
                      <div key={cartItem.item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{cartItem.item.name}</p>
                          <p className="text-sm text-gray-500">{formatPrice(cartItem.item.price)} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', itemId: cartItem.item.id, quantity: cartItem.quantity - 1 })}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-5 text-center">{cartItem.quantity}</span>
                          <button
                            onClick={() => dispatch({ type: 'ADD_TO_CART', item: cartItem.item })}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: menu.colorPrimary }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm w-16 text-right">
                          {formatPrice(cartItem.item.price * cartItem.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {state.cart.length > 0 && (
                <div className="p-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Pedir por WhatsApp
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'CLEAR_CART' })}
                    className="w-full py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Branding (Free plan) */}
      {state.user.plan === 'free' && (
        <div className="fixed bottom-4 right-4 z-20 hidden sm:block">
          <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 text-xs text-gray-500">
            Hecho con <span className="font-semibold text-primary-600">MenuCraft</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

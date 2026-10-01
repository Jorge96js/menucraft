import { useApp } from '../store/useStore';
import { motion } from 'framer-motion';
import { 
  QrCode, ShoppingCart, Palette, Zap, 
  BarChart3, Smartphone, Globe, Shield,
  ArrowRight, Check, Star, Menu as MenuIcon, X
} from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const { dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { icon: Palette, title: 'Editor Visual', desc: 'Diseñá tu carta con drag & drop, colores y personalización total' },
    { icon: ShoppingCart, title: 'Pedidos por WhatsApp', desc: 'Tus clientes arman su pedido y te lo envían directo' },
    { icon: QrCode, title: 'Código QR', desc: 'Generá QR para cada mesa y imprimí en tus locales' },
    { icon: Zap, title: 'Ultra Rápido', desc: 'Menús optimizados que cargan en milisegundos' },
    { icon: BarChart3, title: 'Analíticas', desc: 'Sabé qué platos miran más y cuáles piden' },
    { icon: Shield, title: 'Seguro', desc: 'Datos protegidos con encriptación de nivel bancario' },
  ];

  const testimonials = [
    { name: 'María González', role: 'Restaurante El Fogón', text: 'Desde que usamos MenuCraft, nuestros pedidos por WhatsApp se triplicaron. ¡Increíble!', rating: 5 },
    { name: 'Carlos Ruiz', role: 'Café Central', text: 'La facilidad de uso es impresionante. En 10 minutos teníamos la carta digital lista.', rating: 5 },
    { name: 'Laura Méndez', role: 'Pizzería Don Antonio', text: 'Los clientes aman poder ver el menú desde su celular. Las ventas subieron un 40%.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <MenuIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MenuCraft</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Funciones</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={(e) => { e.preventDefault(); dispatch({ type: 'SET_PAGE', page: 'pricing' }); }}>
                Precios
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Testimonios</a>
              <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })} className="btn-ghost">
                Ingresar
              </button>
              <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })} className="btn-primary">
                Empezar Gratis
              </button>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 font-medium py-2">Funciones</a>
              <a href="#pricing" className="block text-gray-600 font-medium py-2"
                onClick={(e) => { e.preventDefault(); dispatch({ type: 'SET_PAGE', page: 'pricing' }); }}>
                Precios
              </a>
              <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })} className="w-full btn-primary">
                Empezar Gratis
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Nuevo: Importación de menú con IA
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Tu carta digital en{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                  minutos
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Creá menús digitales hermosos con drag & drop. Tus clientes ven la carta, arman su pedido y te lo envían por WhatsApp. Sin apps, sin complicaciones.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })}
                  className="btn-primary text-lg px-8 py-3.5 flex items-center gap-2"
                >
                  Crear mi menú gratis
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => dispatch({ type: 'SET_PAGE', page: 'public' })}
                  className="btn-secondary text-lg px-8 py-3.5 flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  Ver demo en vivo
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500">Sin tarjeta de crédito • 2 menús gratis para siempre</p>
            </motion.div>
          </div>

          {/* Hero Image / Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-8 sm:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-3">La Cocina de Demo</h3>
                    <p className="text-white/80 mb-4">Carta Principal</p>
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Hamburguesa completa</p>
                            <p className="text-sm text-white/70">Carne 200g, cheddar, lechuga...</p>
                          </div>
                          <span className="font-bold">$3.500</span>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Milanesa napolitana</p>
                            <p className="text-sm text-white/70">Con jamón, mozzarella...</p>
                          </div>
                          <span className="font-bold">$4.200</span>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Ñoquis de papa & queso</p>
                            <p className="text-sm text-white/70">Caseros con salsa cuatro quesos</p>
                          </div>
                          <span className="font-bold">$3.800</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-white rounded-2xl p-6 w-64 shadow-xl">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <ShoppingCart className="w-6 h-6 text-primary-600" />
                        </div>
                        <p className="font-semibold text-gray-900">Tu Pedido</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>1x Hamburguesa</span>
                          <span>$3.500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1x Coca Cola</span>
                          <span>$1.200</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span>$4.700</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-green-500 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Pedir por WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitás para tu carta digital
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Herramientas profesionales diseñadas para locales gastronómicos que quieren modernizarse.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              3 pasos para tener tu carta digital
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Creá tu cuenta', desc: 'Registrate gratis y configurá los datos de tu local en 2 minutos.' },
              { step: '2', title: 'Diseñá tu menú', desc: 'Agregá secciones y platos con nuestro editor visual de drag & drop.' },
              { step: '3', title: 'Compartí el link', desc: 'Enviá el link o QR a tus clientes. Ellos piden directo por WhatsApp.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¿Listo para digitalizar tu carta?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Empezá gratis hoy. Sin tarjeta de crédito, sin compromisos.
          </p>
          <button 
            onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })}
            className="btn-primary text-lg px-8 py-3.5 inline-flex items-center gap-2"
          >
            Crear mi menú gratis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <MenuIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MenuCraft</span>
              </div>
              <p className="text-gray-400 text-sm">
                El constructor de menús digitales más fácil de Argentina.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funciones</a></li>
                <li><button onClick={() => dispatch({ type: 'SET_PAGE', page: 'pricing' })} className="hover:text-white transition-colors">Precios</button></li>
                <li><button onClick={() => dispatch({ type: 'SET_PAGE', page: 'public' })} className="hover:text-white transition-colors">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del servicio</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 MenuCraft. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

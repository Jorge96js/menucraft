import { useApp, formatPrice, plans } from '../store/useStore';
import { motion } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, Copy, Eye, Link, 
  Menu as MenuIcon, Settings, LogOut, Crown,
  BarChart3, QrCode, Bell
} from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Menu } from '../types';

export default function Dashboard() {
  const { state, dispatch, currentPlan } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const canCreateMenu = currentPlan.maxMenus === null || state.menus.length < currentPlan.maxMenus;

  const handleCreateMenu = () => {
    if (!newMenuName.trim()) return;
    
    const slug = newMenuName.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50);

    const newMenu: Menu = {
      id: uuidv4(),
      name: newMenuName.trim(),
      slug: slug || `menu-${Date.now()}`,
      isActive: false,
      orderMessage: 'Hola, me gustaría encargar: {items}. Total: {total}',
      colorPrimary: '#f97316',
      colorBg: '#ffffff',
      colorText: null,
      bannerUrl: null,
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_MENU', menu: newMenu });
    setShowCreateModal(false);
    setNewMenuName('');
  };

  const handleEditMenu = (menuId: string) => {
    dispatch({ type: 'SET_EDITING_MENU', menuId });
    dispatch({ type: 'SET_PAGE', page: 'editor' });
  };

  const handleViewPublic = (slug: string) => {
    dispatch({ type: 'SET_VIEWING_SLUG', slug });
    dispatch({ type: 'SET_PAGE', page: 'public' });
  };

  const handleDeleteMenu = (menuId: string) => {
    if (confirm('¿Estás seguro de que querés eliminar este menú?')) {
      dispatch({ type: 'DELETE_MENU', menuId });
    }
  };

  const handleDuplicateMenu = (menu: Menu) => {
    if (!currentPlan.features.duplicateMenu) {
      alert('La función de duplicar menús está disponible en el plan Básico o superior.');
      return;
    }
    const newMenu: Menu = {
      ...menu,
      id: uuidv4(),
      name: `${menu.name} (copia)`,
      slug: `${menu.slug}-copia-${Date.now()}`,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MENU', menu: newMenu });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <MenuIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MenuCraft</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', page: 'admin' })}
                className="btn-ghost text-sm hidden sm:flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-sm">
                    {state.user.restaurantName.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {state.user.restaurantName}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="fixed inset-0 z-50" onClick={() => setShowProfile(false)}>
          <div className="absolute top-16 right-4 sm:right-8 bg-white rounded-xl shadow-xl border border-gray-200 w-72 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900">{state.user.restaurantName}</p>
              <p className="text-sm text-gray-500">{state.user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Crown className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-700">Plan {currentPlan.name}</span>
              </div>
            </div>
            <div className="p-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                <Settings className="w-4 h-4" /> Configuración
              </button>
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', page: 'pricing' })}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <Crown className="w-4 h-4" /> Cambiar plan
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                <QrCode className="w-4 h-4" /> Mis códigos QR
              </button>
            </div>
            <div className="p-2 border-t border-gray-100">
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', page: 'landing' })}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MenuIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Menús</p>
                <p className="text-xl font-bold text-gray-900">
                  {state.menus.length} / {currentPlan.maxMenus ?? '∞'}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Visitas hoy</p>
                <p className="text-xl font-bold text-gray-900">47</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pedidos hoy</p>
                <p className="text-xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Plan actual</p>
                <p className="text-xl font-bold text-gray-900">{currentPlan.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menus Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis Menús</h1>
          <button 
            onClick={() => canCreateMenu ? setShowCreateModal(true) : dispatch({ type: 'SET_PAGE', page: 'pricing' })}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Menú
          </button>
        </div>

        {/* Plan Limit Warning */}
        {!canCreateMenu && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Crown className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Límite de menús alcanzado</p>
              <p className="text-sm text-amber-700 mt-1">
                Tu plan {currentPlan.name} permite {currentPlan.maxMenus} menús. 
                <button onClick={() => dispatch({ type: 'SET_PAGE', page: 'pricing' })} className="font-semibold underline ml-1">
                  Mejorá tu plan
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Menus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.menus.map((menu, i) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden group"
            >
              {/* Menu Preview Header */}
              <div 
                className="h-32 relative"
                style={{ backgroundColor: menu.colorPrimary + '20' }}
              >
                {menu.bannerUrl && (
                  <img src={menu.bannerUrl} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: menu.colorPrimary }}
                  >
                    {menu.name.charAt(0)}
                  </div>
                </div>
                {menu.isActive && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Activo
                  </span>
                )}
              </div>

              {/* Menu Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{menu.name}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  {menu.sections.length} secciones • {menu.sections.reduce((acc, s) => acc + s.items.length, 0)} platos
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  /m/{menu.slug}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <button 
                    onClick={() => handleEditMenu(menu.id)}
                    className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleViewPublic(menu.slug)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ver público"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDuplicateMenu(menu)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteMenu(menu.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Menu Card */}
          {canCreateMenu && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: state.menus.length * 0.05 }}
              onClick={() => setShowCreateModal(true)}
              className="card p-8 border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all flex flex-col items-center justify-center gap-3 min-h-[250px]"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <span className="font-medium text-gray-500">Crear nuevo menú</span>
            </motion.button>
          )}
        </div>

        {/* Plan Info Section */}
        <div className="mt-12 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mi Plan</h2>
            <button 
              onClick={() => dispatch({ type: 'SET_PAGE', page: 'pricing' })}
              className="text-primary-600 font-medium text-sm hover:text-primary-700"
            >
              Cambiar plan →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Menús</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{state.menus.length}</span>
                <span className="text-sm text-gray-500">/ {currentPlan.maxMenus ?? '∞'}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: currentPlan.maxMenus ? `${(state.menus.length / currentPlan.maxMenus) * 100}%` : '30%' }}
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Artículos por menú</p>
              <p className="text-2xl font-bold text-gray-900">
                máx. {currentPlan.maxItemsPerMenu}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Almacenamiento</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">12</span>
                <span className="text-sm text-gray-500">/ {currentPlan.storageQuotaMb} MB</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(12 / currentPlan.storageQuotaMb) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Menu Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCreateModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Crear nuevo menú</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del menú
                  </label>
                  <input
                    type="text"
                    value={newMenuName}
                    onChange={e => setNewMenuName(e.target.value)}
                    placeholder="Ej: Carta Principal, Menú de verano..."
                    className="input-field"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleCreateMenu()}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
                Cancelar
              </button>
              <button 
                onClick={handleCreateMenu}
                disabled={!newMenuName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear menú
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

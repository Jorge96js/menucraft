import { useApp, plans, formatPrice } from '../store/useStore';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, CreditCard, TrendingUp, 
  BarChart3, Shield, Activity, Settings,
  Menu as MenuIcon, DollarSign, Eye, AlertTriangle,
  CheckCircle, XCircle, Clock, Search
} from 'lucide-react';
import { useState } from 'react';

export default function Admin() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subscriptions' | 'webhooks'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock admin data
  const mockStats = {
    totalUsers: 1247,
    activeSubscriptions: 834,
    mrr: 4580000, // $45.800 ARS
    monthlyGrowth: 12.5,
    totalMenus: 2891,
    ordersToday: 456,
  };

  const mockUsers = [
    { id: '1', name: 'La Cocina de Demo', email: 'demo@menucraft.com', plan: 'basic', status: 'active', menus: 3, joined: '2025-12-01' },
    { id: '2', name: 'Pizzería Don Antonio', email: 'antonio@email.com', plan: 'premium', status: 'active', menus: 5, joined: '2025-11-15' },
    { id: '3', name: 'Café Central', email: 'cafe@email.com', plan: 'free', status: 'active', menus: 1, joined: '2026-01-05' },
    { id: '4', name: 'Bar El Rincón', email: 'rincon@email.com', plan: 'basic', status: 'past_due', menus: 2, joined: '2025-10-20' },
    { id: '5', name: 'Sushi Express', email: 'sushi@email.com', plan: 'premium', status: 'active', menus: 4, joined: '2025-09-10' },
    { id: '6', name: 'Heladería Dolce', email: 'dolce@email.com', plan: 'free', status: 'active', menus: 2, joined: '2026-01-10' },
  ];

  const mockWebhooks = [
    { id: '1', type: 'payment.created', status: 'processed', time: '2 min ago' },
    { id: '2', type: 'subscription.updated', status: 'processed', time: '15 min ago' },
    { id: '3', type: 'payment.failed', status: 'failed', time: '1 hour ago' },
    { id: '4', type: 'subscription.cancelled', status: 'processed', time: '3 hours ago' },
    { id: '5', type: 'payment.created', status: 'processed', time: '5 hours ago' },
  ];

  const filteredUsers = mockUsers.filter(u => 
    !searchQuery || 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { key: 'overview', label: 'Resumen', icon: BarChart3 },
    { key: 'users', label: 'Usuarios', icon: Users },
    { key: 'subscriptions', label: 'Suscripciones', icon: CreditCard },
    { key: 'webhooks', label: 'Webhooks', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => dispatch({ type: 'SET_PAGE', page: 'dashboard' })}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Sistema operativo
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Usuarios totales</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Suscripciones activas</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStats.activeSubscriptions}</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">MRR</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(mockStats.mrr)}</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Crecimiento mensual</p>
                    <p className="text-2xl font-bold text-green-600">+{mockStats.monthlyGrowth}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ingresos mensuales</h3>
                <div className="h-48 flex items-end gap-2">
                  {[40, 55, 45, 60, 70, 65, 80, 75, 85, 90, 88, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-primary-500 rounded-t-sm transition-all hover:bg-primary-600"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-xs text-gray-400">
                        {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Distribución de planes</h3>
                <div className="space-y-4">
                  {plans.map(plan => {
                    const count = plan.code === 'free' ? 413 : plan.code === 'basic' ? 534 : 300;
                    const total = 1247;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={plan.code}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{plan.name}</span>
                          <span className="text-gray-500">{count} ({pct}%)</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              plan.code === 'free' ? 'bg-gray-400' : plan.code === 'basic' ? 'bg-primary-500' : 'bg-primary-700'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Actividad reciente</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { action: 'Nuevo usuario registrado', user: 'heladeria@email.com', time: '5 min', type: 'success' },
                  { action: 'Pago procesado', user: 'Pizzería Don Antonio', time: '12 min', type: 'success' },
                  { action: 'Pago rechazado', user: 'Bar El Rincón', time: '1 hora', type: 'error' },
                  { action: 'Cambio de plan', user: 'Sushi Express → Premium', time: '2 horas', type: 'info' },
                  { action: 'Menú creado', user: 'Café Central', time: '3 horas', type: 'info' },
                ].map((item, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'success' ? 'bg-green-500' : item.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.user}</p>
                    </div>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar usuarios..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Local</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Plan</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Menús</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            user.plan === 'premium' ? 'bg-purple-100 text-purple-700' :
                            user.plan === 'basic' ? 'bg-primary-100 text-primary-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 w-fit ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                            user.status === 'past_due' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                            {user.status === 'past_due' && <AlertTriangle className="w-3 h-3" />}
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{user.menus}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Cambiar plan">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspender">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="card p-4 text-center">
                <p className="text-3xl font-bold text-green-600">834</p>
                <p className="text-sm text-gray-500">Activas</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">23</p>
                <p className="text-sm text-gray-500">Período de gracia</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-3xl font-bold text-red-600">12</p>
                <p className="text-sm text-gray-500">Pago fallido</p>
              </div>
            </div>

            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Últimas transacciones</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { user: 'Pizzería Don Antonio', plan: 'Premium', amount: 2000000, status: 'approved', date: 'Hoy, 14:30' },
                  { user: 'Sushi Express', plan: 'Premium', amount: 2000000, status: 'approved', date: 'Hoy, 12:15' },
                  { user: 'La Cocina de Demo', plan: 'Básico', amount: 800000, status: 'approved', date: 'Ayer, 09:00' },
                  { user: 'Bar El Rincón', plan: 'Básico', amount: 800000, status: 'rejected', date: 'Ayer, 08:45' },
                  { user: 'Café Central', plan: 'Básico', amount: 800000, status: 'pending', date: '22 Ene' },
                ].map((tx, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.status === 'approved' ? 'bg-green-100' : tx.status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                      {tx.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {tx.status === 'rejected' && <XCircle className="w-4 h-4 text-red-600" />}
                      {tx.status === 'pending' && <Clock className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{tx.user}</p>
                      <p className="text-xs text-gray-500">Plan {tx.plan}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(tx.amount)}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Eventos de webhook</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Mercado Pago</span>
              </div>
              <div className="divide-y divide-gray-100">
                {mockWebhooks.map(webhook => (
                  <div key={webhook.id} className="px-4 py-3 flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      webhook.status === 'processed' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-gray-900">{webhook.type}</p>
                      <p className="text-xs text-gray-500">ID: {webhook.id}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      webhook.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {webhook.status}
                    </span>
                    <span className="text-xs text-gray-400">{webhook.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

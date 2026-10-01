import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/useStore';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MenuEditor from './pages/MenuEditor';
import PublicMenu from './pages/PublicMenu';
import Pricing from './pages/Pricing';
import Admin from './pages/Admin';

function AppContent() {
  const { state } = useApp();

  switch (state.currentPage) {
    case 'landing':
      return <Landing />;
    case 'dashboard':
      return <Dashboard />;
    case 'editor':
      return <MenuEditor />;
    case 'public':
      return <PublicMenu />;
    case 'pricing':
      return <Pricing />;
    case 'admin':
      return <Admin />;
    default:
      return <Landing />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

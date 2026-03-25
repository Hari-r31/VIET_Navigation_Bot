
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home';
import Directions from './views/Directions';
import Fees from './views/Fees';
import MobileDirections from './views/MobileDirections';
import Assistant from './components/Assistant';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import { useLanguage } from './contexts/LanguageContext';

import Welcome from './views/Welcome';

// Layout for the main kiosk application
const KioskLayout = () => {
  const location = useLocation();
  const { language } = useLanguage();   // ✅ THIS is what you were missing

  const isHome = location.pathname === '/home';
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [dirKeyboardOpen, setDirKeyboardOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: Event) => {
      setDirKeyboardOpen((e as CustomEvent).detail.open);
    };
    window.addEventListener('directions-keyboard', handler);
    return () => window.removeEventListener('directions-keyboard', handler);
  }, []);

  const showFab = !isHome && !menuOpen && !dirKeyboardOpen;

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-50 relative overflow-hidden 
      ${language === 'te' ? 'telugu' : ''}`}   // ✅ GLOBAL APPLY
    >
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="flex-1 overflow-hidden p-4 pb-20 w-full max-w-[1600px] mx-auto flex flex-col">
        <Outlet />
      </main>
      {!isHome && <Assistant showFab={showFab} />}
      <Toaster position="top-center" />
    </div>
  );
};

// Main App Component with Routing
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          {/* Welcome Screen - Standalone */}
          <Route path="/" element={<Welcome />} />

          {/* Mobile View - No Kiosk UI elements */}
          <Route path="/mobile/directions" element={<MobileDirections />} />

          {/* Kiosk Views - Wrapped in Layout */}
          <Route element={<KioskLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/directions" element={<Directions />} />
            <Route path="/fees" element={<Fees />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;

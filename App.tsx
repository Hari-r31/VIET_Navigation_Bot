
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

import Welcome from './views/Welcome';

// Layout for the main kiosk application
const KioskLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/home';

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 relative overflow-hidden">
      <Header />
      {/* Reduced bottom padding to maximize view area while keeping Assistant button visible */}
      <main className="flex-1 overflow-hidden p-4 pb-20 w-full max-w-[1600px] mx-auto flex flex-col">
        <Outlet />
      </main>
      {/* Only show global Assistant if NOT on Home screen */}
      {!isHome && <Assistant />}
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
          <Route path="/welcome" element={<Welcome />} />

          {/* Mobile View - No Kiosk UI elements */}
          <Route path="/mobile/directions" element={<MobileDirections />} />

          {/* Kiosk Views - Wrapped in Layout */}
          <Route element={<KioskLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/directions" element={<Directions />} />
            <Route path="/fees" element={<Fees />} />
          </Route>

          {/* Default Redirect to Welcome */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;


import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home';
import Directions from './views/Directions';
import Fees from './views/Fees';
import MobileDirections from './views/MobileDirections';
import Assistant from './components/Assistant';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';

// Layout for the main kiosk application
const KioskLayout = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <Header />
      {/* Reduced bottom padding to maximize view area while keeping Assistant button visible */}
      <main className="flex-1 overflow-y-auto p-4 pb-20 w-full max-w-[1600px] mx-auto">
        <Outlet />
      </main>
      <Assistant />
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
          {/* Mobile View - No Kiosk UI elements */}
          <Route path="/mobile/directions" element={<MobileDirections />} />

          {/* Kiosk Views - Wrapped in Layout */}
          <Route element={<KioskLayout />}>
            <Route path="/" element={<Home />} />
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

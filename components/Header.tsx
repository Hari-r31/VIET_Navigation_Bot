import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm z-10 flex justify-between items-center">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Visakha Institute of Engineering & Technology
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Main Campus Interactive Kiosk</p>
      </div>
    </header>
  );
};

export default Header;
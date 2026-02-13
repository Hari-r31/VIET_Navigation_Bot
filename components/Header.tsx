
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
    }`;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-30 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex flex-col text-center md:text-left">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Visakha Institute of Engineering & Technology
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">Main Campus Interactive Kiosk</p>
      </div>

      <nav className="flex items-center gap-2 md:gap-4 bg-white/50 backdrop-blur-sm p-1 rounded-full">
        <NavLink to="/" className={navLinkClass}>
          <Home size={18} />
          <span className="hidden md:inline">Home</span>
        </NavLink>
        <NavLink to="/directions" className={navLinkClass}>
          <Map size={18} />
          <span>Navigation</span>
        </NavLink>
        <NavLink to="/fees" className={navLinkClass}>
          <GraduationCap size={18} />
          <span>Course Details</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;

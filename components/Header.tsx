
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, GraduationCap, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const Header: React.FC = () => {
  const { t, language, setLanguage, speak } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'te' | 'hi') => {
      setLanguage(lang);
      setTimeout(() => {
          speak(translations[lang].speak_lang_changed);
      }, 100);
  };

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
          {t.header_title}
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">{t.header_subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher Mini */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button 
            onClick={() => handleLanguageChange('en')} 
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
          >
            EN
          </button>
          <button 
            onClick={() => handleLanguageChange('te')} 
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'te' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
          >
            తె
          </button>
          <button 
            onClick={() => handleLanguageChange('hi')} 
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'hi' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
          >
            हि
          </button>
        </div>

        <nav className="flex items-center gap-2 md:gap-4 bg-white/50 backdrop-blur-sm p-1 rounded-full">
          <NavLink to="/" className={navLinkClass}>
            <Home size={18} />
            <span className="hidden md:inline">{t.nav_home}</span>
          </NavLink>
          <NavLink to="/directions" className={navLinkClass}>
            <Map size={18} />
            <span>{t.nav_directions}</span>
          </NavLink>
          <NavLink to="/fees" className={navLinkClass}>
            <GraduationCap size={18} />
            <span>{t.nav_fees}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;

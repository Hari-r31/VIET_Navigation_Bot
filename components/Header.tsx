import React from 'react';
import { Volume2, VolumeX, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ menuOpen, setMenuOpen }) => {

  const { language, setLanguage, speak, isVoiceEnabled, toggleVoice } = useLanguage();
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const changeLanguage = (lang: 'en' | 'te' | 'hi') => {

    setLanguage(lang);

    const messages = {
      en: "Language changed to English.",
      te: "భాష తెలుగు గా మార్చబడింది.",
      hi: "भाषा हिंदी में बदल दी गई है।"
    };

    speak(messages[lang]);
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-30 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="VIET Logo"
            className="w-12 h-12 object-contain"
          />

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Visakha Institute of Engineering & Technology [VSPT]
            </h1>
            <p className="text-xs text-slate-500">
              Main Campus Interactive Kiosk
            </p>
          </div>
        </div>


        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <button
            onClick={toggleVoice}
            className={`p-3 rounded-full ${
              isVoiceEnabled
                ? 'bg-blue-100 text-blue-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {isVoiceEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="p-3 rounded-full bg-slate-100 hover:bg-slate-200"
          >
            <Menu size={22} />
          </button>

        </div>

      </header>


      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}


      {/* SIDE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">

          <h2 className="text-lg font-bold text-slate-800">Menu</h2>

          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>


        {/* MENU LINKS */}
        <div className="flex-1 flex flex-col">

          <button
            onClick={() => go('/')}
            className="px-6 py-4 text-left hover:bg-blue-50 font-medium"
          >
            Welcome
          </button>

          <button
            onClick={() => go('/home')}
            className="px-6 py-4 text-left hover:bg-blue-50 font-medium"
          >
            Home
          </button>

          <button
            onClick={() => go('/directions')}
            className="px-6 py-4 text-left hover:bg-blue-50 font-medium"
          >
            Directions
          </button>

          <button
            onClick={() => go('/fees')}
            className="px-6 py-4 text-left hover:bg-blue-50 font-medium"
          >
            Fees
          </button>

        </div>


        {/* LANGUAGE SWITCHER */}
        <div className="border-t p-4">

          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-bold uppercase">
            <Globe size={14} />
            Language
          </div>

          <div className="grid grid-cols-3 gap-2">

            <button
              onClick={() => changeLanguage('en')}
              className={`py-2 rounded-lg text-sm font-bold border ${
                language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100'
              }`}
            >
              English
            </button>

            <button
              onClick={() => changeLanguage('te')}
              className={`py-2 rounded-lg text-sm font-bold border ${
                language === 'te'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100'
              }`}
            >
              తెలుగు
            </button>

            <button
              onClick={() => changeLanguage('hi')}
              className={`py-2 rounded-lg text-sm font-bold border ${
                language === 'hi'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100'
              }`}
            >
              हिंदी
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default Header;
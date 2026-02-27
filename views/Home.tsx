
import React, { useEffect } from 'react';
import { Map, GraduationCap, Info, Users, Sparkles, Code, School, ChevronRight, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, speak } = useLanguage();

  useEffect(() => {
    // Announce welcome message on mount
    speak(t.assist_welcome);
  }, []); // Run once on mount

  const handleNavigation = (path: string, announcement: string) => {
      speak(announcement);
      navigate(path);
  };

  return (
    <div className="flex flex-col h-full gap-2 animate-in fade-in duration-500">
      
      {/* 1. Hero - Compact */}
      <div className="flex-shrink-0 text-center py-1 md:py-2 relative">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-1 md:mb-2">
          {language === 'en' ? (
              <>Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Campus Guide</span></>
          ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{t.home_title}</span>
          )}
        </h1>
        <p className="text-sm md:text-lg text-slate-500 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
           <Sparkles size={16} className="text-yellow-500 fill-yellow-500" />
           {t.home_subtitle}
        </p>
      </div>

      {/* 2. Primary Actions (Directions & Fees) - Flexible with min-height safety */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 min-h-0">
        
        {/* Directions Card */}
        <button 
          onClick={() => handleNavigation('/directions', t.card_directions_title)}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-blue-600 text-white p-4 md:p-6 text-left group shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex flex-col justify-between h-full w-full"
        >
          {/* Decor */}
          <div className="absolute right-0 top-0 w-32 h-32 md:w-60 md:h-60 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute right-2 bottom-2 md:right-6 md:bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
             <Map className="w-16 h-16 md:w-32 md:h-32" />
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner mb-2 md:mb-4">
               <Map className="w-5 h-5 md:w-8 md:h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 tracking-tight">{t.card_directions_title}</h2>
            <p className="text-blue-100 text-xs md:text-base font-medium max-w-xs leading-relaxed line-clamp-2 md:line-clamp-none">
              {t.card_directions_desc}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] md:text-sm mt-2 md:mt-4 bg-black/20 w-fit px-3 py-1.5 md:px-5 md:py-2.5 rounded-full hover:bg-black/30 transition-colors">
             {t.btn_start_nav} <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        </button>

        {/* Fees Card */}
        <button 
          onClick={() => handleNavigation('/fees', t.card_fees_title)}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-slate-200 text-slate-900 p-4 md:p-6 text-left group shadow-lg hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between h-full w-full"
        >
          {/* Decor */}
          <div className="absolute right-0 top-0 w-32 h-32 md:w-60 md:h-60 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute right-2 bottom-2 md:right-6 md:bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-500 text-emerald-900">
             <GraduationCap className="w-16 h-16 md:w-32 md:h-32" />
          </div>

          <div className="relative z-10">
            <div className="bg-emerald-100 w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-emerald-700 shadow-sm mb-2 md:mb-4">
               <GraduationCap className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 tracking-tight">{t.card_fees_title}</h2>
            <p className="text-slate-500 text-xs md:text-base font-medium max-w-xs leading-relaxed line-clamp-2 md:line-clamp-none">
              {t.card_fees_desc}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] md:text-sm mt-2 md:mt-4 text-emerald-700 bg-emerald-50 w-fit px-3 py-1.5 md:px-5 md:py-2.5 rounded-full group-hover:bg-emerald-100 transition-colors">
             {t.btn_check_structure} <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        </button>
      </div>

      {/* 3. Info Section - Compact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 flex-shrink-0 mt-1">
        
        {/* College Profile */}
        <div className="bg-white rounded-xl p-3 md:p-4 border border-slate-200 shadow-sm flex flex-col gap-1 md:gap-2 group hover:border-indigo-300 transition-colors">
          <div className="flex items-center gap-1.5 text-indigo-600 font-bold uppercase text-[9px] md:text-[10px] tracking-wider">
             <School size={12} /> {t.info_profile}
          </div>
          <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight line-clamp-1">Visakha Institute of Eng & Tech</h3>
          <p className="text-slate-500 text-[10px] md:text-xs leading-relaxed line-clamp-2">
             NAAC 'A' Grade • Autonomous • AICTE Approved • JNTUK Affiliated.
          </p>
        </div>

        {/* About Project */}
        <div className="bg-white rounded-xl p-3 md:p-4 border border-slate-200 shadow-sm flex flex-col gap-1 md:gap-2 group hover:border-orange-300 transition-colors">
           <div className="flex items-center gap-1.5 text-orange-600 font-bold uppercase text-[9px] md:text-[10px] tracking-wider">
             <Info size={12} /> {t.info_system}
          </div>
          <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-1">Offline Smart Kiosk</h3>
          <p className="text-slate-500 text-[10px] md:text-xs leading-relaxed line-clamp-2">
            v1.0 • React & Speech API • Offline Capable Campus Guide.
          </p>
        </div>

        {/* Development Team */}
        <div className="bg-slate-900 rounded-xl p-3 md:p-4 shadow-sm flex flex-col gap-1 md:gap-2 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Code className="w-6 h-6 md:w-10 md:h-10" />
           </div>
           <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase text-[9px] md:text-[10px] tracking-wider relative z-10">
             <Users size={12} /> {t.info_credits}
          </div>
          <h3 className="text-sm md:text-base font-bold relative z-10 line-clamp-1">Project Team</h3>
          <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed relative z-10 line-clamp-2">
            Final Year <strong>ECE</strong> Students • Batch of 2025
          </p>
        </div>

      </div>

    </div>
  );
};

export default Home;

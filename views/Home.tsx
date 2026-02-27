
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
    <div className="flex flex-col h-full gap-2 md:gap-4 animate-in fade-in duration-500">
      
      {/* 1. Hero */}
      <div className="flex-shrink-0 text-center py-2 md:py-4 relative">
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-2 md:mb-4 pt-4 md:pt-0">
          {language === 'en' ? (
              <>Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Campus Guide</span></>
          ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{t.home_title}</span>
          )}
        </h1>
        <p className="text-base md:text-xl text-slate-500 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
           <Sparkles size={20} className="text-yellow-500 fill-yellow-500" />
           {t.home_subtitle}
        </p>
      </div>

      {/* 2. Primary Actions (Directions & Fees) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-0">
        
        {/* Directions Card - Primary Action */}
        <button 
          onClick={() => handleNavigation('/directions', t.card_directions_title)}
          className="relative overflow-hidden rounded-3xl bg-blue-600 text-white p-6 md:p-8 lg:p-10 text-left group shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all flex flex-col justify-between h-full w-full"
        >
          {/* Decor */}
          <div className="absolute right-0 top-0 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
             <Map className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48" />
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner mb-4 md:mb-6">
               <Map className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 tracking-tight">{t.card_directions_title}</h2>
            <p className="text-blue-100 text-sm md:text-lg lg:text-xl font-medium max-w-sm leading-relaxed">
              {t.card_directions_desc}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 md:gap-3 font-bold uppercase tracking-wider text-xs md:text-sm lg:text-base mt-4 md:mt-8 bg-black/20 w-fit px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-black/30 transition-colors">
             {t.btn_start_nav} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </button>

        {/* Fees Card - Secondary Action */}
        <button 
          onClick={() => handleNavigation('/fees', t.card_fees_title)}
          className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 text-slate-900 p-6 md:p-8 lg:p-10 text-left group shadow-xl hover:shadow-2xl hover:border-emerald-400 transition-all flex flex-col justify-between h-full w-full"
        >
          {/* Decor */}
          <div className="absolute right-0 top-0 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-500 text-emerald-900">
             <GraduationCap className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48" />
          </div>

          <div className="relative z-10">
            <div className="bg-emerald-100 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm mb-4 md:mb-6">
               <GraduationCap className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 tracking-tight">{t.card_fees_title}</h2>
            <p className="text-slate-500 text-sm md:text-lg lg:text-xl font-medium max-w-sm leading-relaxed">
              {t.card_fees_desc}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 md:gap-3 font-bold uppercase tracking-wider text-xs md:text-sm lg:text-base mt-4 md:mt-8 text-emerald-700 bg-emerald-50 w-fit px-4 py-2 md:px-6 md:py-3 rounded-full group-hover:bg-emerald-100 transition-colors">
             {t.btn_check_structure} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </button>
      </div>

      {/* 3. Info Section (College, Project, Team) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-shrink-0 mt-2">
        
        {/* College Profile */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm flex flex-col gap-2 md:gap-3 group hover:border-indigo-300 transition-colors">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] md:text-xs tracking-wider mb-1">
             <School size={16} /> {t.info_profile}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">Visakha Institute of Engineering & Technology</h3>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-3">
             NAAC 'A' Grade • Autonomous • AICTE Approved • Affiliated to JNTUK.
             Empowering students with quality technical education since 2008 in Visakhapatnam.
          </p>
        </div>

        {/* About Project */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm flex flex-col gap-2 md:gap-3 group hover:border-orange-300 transition-colors">
           <div className="flex items-center gap-2 text-orange-600 font-bold uppercase text-[10px] md:text-xs tracking-wider mb-1">
             <Info size={16} /> {t.info_system}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900">Offline Smart Kiosk</h3>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-3">
            v1.0 • Built with React & Speech API.
            Designed to work completely offline for reliable campus guidance without internet dependency.
          </p>
        </div>

        {/* Development Team */}
        <div className="bg-slate-900 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-2 md:gap-3 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Code className="w-8 h-8 md:w-16 md:h-16" />
           </div>
           <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-[10px] md:text-xs tracking-wider mb-1 relative z-10">
             <Users size={16} /> {t.info_credits}
          </div>
          <h3 className="text-lg md:text-xl font-bold relative z-10">Project Team</h3>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed relative z-10">
            Developed by Final Year <strong>ECE</strong> Students.
            <span className="opacity-70 mt-1 block">Batch of 2025</span>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Home;

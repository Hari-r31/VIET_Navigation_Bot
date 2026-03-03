
import React, { useEffect, useState, useRef } from 'react';
import { Map, GraduationCap, Sparkles, ChevronRight, Home as HomeIcon, Navigation as NavigationIcon, Mic, RefreshCw, ChevronDown, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Assistant from '../components/Assistant';
import { startWakeWordListener } from '../services/speechService';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage, speak } = useLanguage();
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [startVoice, setStartVoice] = useState(false);
  const wakeWordRef = useRef<any>(null);

  useEffect(() => {
    // Announce welcome message on mount
    speak(t.assist_welcome);
  }, []); // Run once on mount

  // Wake word listener for Home (when Assistant is NOT active)
  useEffect(() => {
    if (isAssistantActive) {
        if (wakeWordRef.current) {
            wakeWordRef.current.stop();
            wakeWordRef.current = null;
        }
        return;
    }

    const onWake = () => {
        console.log('Home: Wake word detected!');
        setStartVoice(true);
        setIsAssistantActive(true);
    };

    const onError = (err: string) => {
        // console.warn('Home wake word error:', err);
    };

    const langCode = language === 'te' ? 'te-IN' : (language === 'hi' ? 'hi-IN' : 'en-US');
    wakeWordRef.current = startWakeWordListener(onWake, onError, langCode);

    return () => {
        if (wakeWordRef.current) wakeWordRef.current.stop();
    };
  }, [isAssistantActive, language]);

  const handleNavigation = (path: string, announcement: string) => {
      speak(announcement);
      navigate(path);
  };

  const handleLanguageChange = (lang: 'en' | 'te' | 'hi') => {
      setLanguage(lang);
  };

  const handleTouchTrigger = () => {
    setStartVoice(false);
    setIsAssistantActive(true);
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500 p-2 relative">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/welcome')}
        className="absolute top-4 right-4 z-10 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
      >
        <ChevronRight className="w-6 h-6 rotate-180" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Hero Heading */}
        <div className="flex items-center gap-3 py-2">
            <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight">
                Touch or speak to <span className="text-blue-600">navigate</span> or get directions
            </h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
            
            {/* Navigation Card (Blue) */}
            <button 
              onClick={() => handleNavigation('/directions', t.card_directions_title)}
              className="relative overflow-hidden rounded-3xl bg-blue-600 text-white p-6 text-left group shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-full w-full"
            >
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                 <Map className="w-64 h-64" />
              </div>
              
              <div className="relative z-10">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner mb-4">
                   <Map className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight">{t.card_directions_title}</h2>
                <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-xs">
                  {t.card_directions_desc}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 font-bold uppercase tracking-wider text-xs bg-black/20 w-fit px-4 py-2 rounded-full hover:bg-black/30 transition-colors">
                 {t.btn_start_nav} <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Fee Details Card (White) */}
            <button 
              onClick={() => handleNavigation('/fees', t.card_fees_title)}
              className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 text-slate-900 p-6 text-left group shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-full w-full"
            >
              <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4">
                 <GraduationCap className="w-64 h-64" />
              </div>

              <div className="relative z-10">
                <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-700 shadow-sm mb-4">
                   <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight">{t.card_fees_title}</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                  {t.card_fees_desc}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 font-bold uppercase tracking-wider text-xs text-emerald-700 bg-emerald-50 w-fit px-4 py-2 rounded-full group-hover:bg-emerald-100 transition-colors">
                 {t.btn_check_structure} <ChevronRight className="w-4 h-4" />
              </div>
            </button>

        </div>

        {/* Campus Assistant Area */}
        <div 
            onClick={handleTouchTrigger}
            className="flex-1 flex flex-col items-center justify-center p-8 relative cursor-pointer group/banner min-h-[280px]"
        >
            {/* Large Bot Icon */}
            <div className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 group-hover/banner:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Mic size={48} className="animate-pulse" />
                </div>
                <div className="absolute -bottom-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                    LISTENING
                </div>
            </div>

            {/* Text */}
            <div className="text-center max-w-lg">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight">
                    Say "<span className="text-blue-600">Hey Champ</span>"
                </h3>
                <p className="text-slate-500 font-medium text-lg">
                    or touch to start chatting
                </p>
            </div>
        </div>

        {isAssistantActive && (
            <Assistant 
                mode="modal" 
                showFab={false}
                defaultOpen={true}
                onClose={() => setIsAssistantActive(false)} 
                startVoiceOnMount={startVoice}
            />
        )}

        {/* Instructions Footer */}
        <div className="mt-auto p-4 bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in duration-500">
            <p>{t.instructions_footer}</p>
        </div>
      </div>

    </div>
  );
};

export default Home;

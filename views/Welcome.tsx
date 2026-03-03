import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { School, Users, Globe, ChevronRight, Info, Home, Map, FileText, Sparkles, GraduationCap } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { language, t, setLanguage, speak } = useLanguage();

  const handleLanguageSelect = (lang: 'en' | 'te' | 'hi') => {
    setLanguage(lang);
    
    const messages = {
      en: "Welcome to Visakha Institute of Engineering and Technology.",
      te: "విశాఖ ఇన్‌స్టిట్యూట్ ఆఫ్ ఇంజనీరింగ్ అండ్ టెక్నాలజీకి స్వాగతం.",
      hi: "विशाखा इंस्टीट्यूट ऑफ इंजीनियरिंग एंड टेक्नोलॉजी में आपका स्वागत है।"
    };
    
    speak(messages[lang]);
    navigate('/home');
  };

  const handleQuickLink = (path: string) => {
      setLanguage('en'); 
      navigate(path);
  };

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden font-sans selection:bg-blue-100">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section - Modern & Clean */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm flex-shrink-0 py-4 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-2xl shadow-md border border-slate-100">
                    <img 
                      src="https://i.imgur.com/8J5j5j5.png" 
                      alt="VIET Logo" 
                      className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/100x100?text=VIET";
                      }}
                    />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
                        Visakha Institute of Engineering & Technology
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm font-bold mt-1 tracking-wide uppercase">
                        Autonomous • NAAC 'A' Grade • AICTE Approved
                    </p>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 shadow-sm">
                <Sparkles size={14} className="text-blue-500" /> Smart Campus Kiosk
            </div>
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="flex-1 p-4 md:p-8 min-h-0 overflow-hidden flex flex-col items-center justify-center relative z-10">
        
        {/* Page Title Banner */}
        <div className="flex-shrink-0 text-center py-1 md:py-2 relative mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-1 md:mb-2">
            {language === 'en' ? (
                <>Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Campus Guide</span></>
            ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{t.home_title}</span>
            )}
            </h1>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
            
            {/* Left Column (Language & Info) - Spans 7 cols */}
            <div className="lg:col-span-7 flex flex-col gap-6 h-full min-h-0">
                
                {/* Language Selection Card - Hero */}
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 md:p-8 flex-1 min-h-0 flex flex-col relative overflow-hidden group">
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/30 opacity-50 pointer-events-none" />
                    
                    <div className="relative z-10 flex-shrink-0 mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                            <Globe size={14} /> Select Language
                        </div>
                        <h2 className="text-3xl md:text-4xl font-medium text-slate-900 tracking-tight">
                            Choose your preferred language
                        </h2>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center gap-4 overflow-y-auto pr-2 custom-scrollbar">
                         <LanguageButton 
                            lang="English" 
                            subtext="Proceed in English" 
                            onClick={() => handleLanguageSelect('en')} 
                            color="blue"
                         />
                         <LanguageButton 
                            lang="తెలుగు" 
                            subtext="తెలుగులో కొనసాగండి" 
                            onClick={() => handleLanguageSelect('te')} 
                            color="emerald"
                         />
                         <LanguageButton 
                            lang="हिंदी" 
                            subtext="हिंदी में आगे बढ़ें" 
                            onClick={() => handleLanguageSelect('hi')} 
                            color="orange"
                         />
                    </div>
                </div>

                {/* Bottom Info Row */}
                <div className="grid grid-cols-2 gap-6 h-32 flex-shrink-0">
                    <InfoCard 
                        icon={<School size={18} />}
                        title="Institute Profile"
                        mainText="Visakha Institute of Eng & Tech"
                        subText="NAAC 'A' Grade • Autonomous"
                        color="indigo"
                    />
                    <InfoCard 
                        icon={<Info size={18} />}
                        title="Offline Smart Kiosk"
                        mainText="Campus Guide v1.0"
                        subText="React & Speech API • Offline Capable"
                        color="violet"
                    />
                </div>

            </div>

            {/* Right Column (Quick Links & Team) - Spans 5 cols */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-full min-h-0">
                
                {/* Quick Links */}
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 flex-shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 pointer-events-none" />
                    <h3 className="text-lg font-bold text-slate-900 mb-4 relative z-10">Quick Links</h3>
                    <div className="grid grid-cols-3 gap-3 relative z-10">
                        <QuickLinkButton icon={<Home size={20} />} label="Home" onClick={() => handleQuickLink('/home')} />
                        <QuickLinkButton icon={<Map size={20} />} label="Navigation" onClick={() => handleQuickLink('/directions')} />
                        <QuickLinkButton icon={<FileText size={20} />} label="Details" onClick={() => handleQuickLink('/fees')} />
                    </div>
                </div>

                {/* Submitted By */}
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 flex-1 min-h-0 flex flex-col overflow-hidden relative">
                    <div className="flex-shrink-0 flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">
                        <Users size={14} /> Submitted By
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        <TeamMember name="K. CHIRANJEEVI" id="22NT1A0428" />
                        <TeamMember name="B. GLORY" id="23NT5A0404" />
                        <TeamMember name="CH. PRAVEEN" id="23NT5A0407" />
                        <TeamMember name="CH. ARAVIND" id="22NT1A0409" />
                    </div>
                </div>

                {/* Guidance */}
                <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex-shrink-0 group">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/30 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -ml-10 -mb-10" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[10px] mb-3">
                            <GraduationCap size={14} /> Under the Guidance of
                        </div>
                        <h3 className="text-xl font-bold mb-1">Mr. M. Hemanth Kumar</h3>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Assistant Professor</span>
                            <span>•</span>
                            <span>Dept of ECE</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>

    </div>
  );
};

// --- Sub-Components for Cleaner Code ---

const LanguageButton: React.FC<{ lang: string; subtext: string; onClick: () => void; color: 'blue' | 'emerald' | 'orange' }> = ({ lang, subtext, onClick, color }) => {
    const colorClasses = {
        blue: 'hover:bg-blue-50 hover:border-blue-200 group-hover:text-blue-600',
        emerald: 'hover:bg-emerald-50 hover:border-emerald-200 group-hover:text-emerald-600',
        orange: 'hover:bg-orange-50 hover:border-orange-200 group-hover:text-orange-600'
    };
    
    const iconColors = {
        blue: 'text-blue-500',
        emerald: 'text-emerald-500',
        orange: 'text-orange-500'
    };

    return (
        <button onClick={onClick} className={`w-full group bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${colorClasses[color]}`}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-white transition-colors ${iconColors[color]}`}>
                    <span className="text-lg font-bold">{lang[0]}</span>
                </div>
                <div className="text-left">
                    <span className="block text-lg font-bold text-slate-800 group-hover:text-current transition-colors">{lang}</span>
                    <span className="text-xs text-slate-400 font-medium">{subtext}</span>
                </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-white transition-colors ${iconColors[color]}`}>
                <ChevronRight size={18} />
            </div>
        </button>
    );
};

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; mainText: string; subText: string; color: 'indigo' | 'violet' }> = ({ icon, title, mainText, subText, color }) => {
    const colorClasses = {
        indigo: 'group-hover:text-indigo-600',
        violet: 'group-hover:text-violet-600'
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-5 flex flex-col justify-center hover:border-slate-200 transition-all duration-300 hover:-translate-y-1 group">
            <div className={`flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider mb-3 text-slate-400 ${colorClasses[color]} transition-colors`}>
                {icon} {title}
            </div>
            <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 mb-1">{mainText}</h3>
            <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{subText}</p>
        </div>
    );
};

const QuickLinkButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-100 hover:border-blue-100 rounded-2xl p-4 transition-all duration-200 active:scale-95">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
            {icon}
        </div>
        <span className="text-xs font-bold">{label}</span>
    </button>
);

const TeamMember: React.FC<{ name: string; id: string }> = ({ name, id }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-colors group">
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-blue-500 group-hover:border-blue-100 transition-colors">
            {name.charAt(0)}
        </div>
        <span className="font-bold text-slate-700 text-xs md:text-sm group-hover:text-slate-900">{name}</span>
    </div>
    <span className="font-mono text-slate-400 text-[10px] md:text-xs bg-white px-2 py-1 rounded-md border border-slate-100 group-hover:border-slate-200">{id}</span>
  </div>
);

export default Welcome;

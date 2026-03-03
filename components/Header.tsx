
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { t, isVoiceEnabled, toggleVoice } = useLanguage();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-30 flex justify-between items-center relative">
      <div className="flex items-center gap-3">
        <img 
            src="https://i.imgur.com/8J5j5j5.png" 
            alt="VIET Logo" 
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
            onError={(e) => {
                e.currentTarget.src = "https://placehold.co/100x100?text=VIET";
            }}
        />
        <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Visakha Institute of Engineering & Technology <span className="text-blue-600">[VSPT]</span>
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium">Main Campus Interactive Kiosk</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Voice Toggle */}
        <button
            onClick={toggleVoice}
            className={`p-3 rounded-full transition-all ${isVoiceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
            title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
        >
            {isVoiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;


import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { translations } from '../data/translations';
import { speak as speakService, stopSpeaking as stopSpeakingService, isVoiceAvailable } from '../services/speechService';
import VoiceHelpModal from '../components/VoiceHelpModal';
import toast from 'react-hot-toast';

type Language = 'en' | 'te' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [showHelp, setShowHelp] = useState(false);

  const handleSetLanguage = (lang: Language) => {
      setLanguage(lang);
      
      // Check if voice exists for this language
      // We use a small timeout to ensure voices are loaded if this is the very first interaction
      setTimeout(() => {
          if (lang !== 'en' && !isVoiceAvailable(lang)) {
              toast((t) => (
                  <div className="flex items-center gap-2">
                      <span>Voice pack missing for {lang === 'te' ? 'Telugu' : 'Hindi'}.</span>
                      <button 
                        onClick={() => { setShowHelp(true); toast.dismiss(t.id); }}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold hover:bg-blue-200"
                      >
                          Fix
                      </button>
                  </div>
              ), { duration: 5000, icon: '⚠️' });
          }
      }, 500);
  };

  const speak = useCallback((text: string) => {
    speakService(text, language);
  }, [language]);

  const stopSpeaking = useCallback(() => {
    stopSpeakingService();
  }, []);

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
    speak,
    stopSpeaking
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <VoiceHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

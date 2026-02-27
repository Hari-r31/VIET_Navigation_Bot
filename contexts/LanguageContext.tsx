
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { translations } from '../data/translations';
import { speak as speakService, stopSpeaking as stopSpeakingService } from '../services/speechService';

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

  const speak = useCallback((text: string) => {
    speakService(text, language);
  }, [language]);

  const stopSpeaking = useCallback(() => {
    stopSpeakingService();
  }, []);

  const value = {
    language,
    setLanguage,
    t: translations[language],
    speak,
    stopSpeaking
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
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

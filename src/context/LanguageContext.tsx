import React, { createContext, useContext, useState } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  toggleLang: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('zh');

  const toggleLang = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

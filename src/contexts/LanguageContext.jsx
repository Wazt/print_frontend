import { createContext, useContext, useState, useCallback } from "react";
import fr from "@/translations/fr.json";
import en from "@/translations/en.json";

const translations = { fr, en };

const LanguageContext = createContext();

export default LanguageContext;

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("lang") || "fr"
  );

  const switchLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split(".");
      let val = translations[language];
      for (const k of keys) {
        val = val?.[k];
      }
      return val ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage: switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json";

const normalizeLanguage = (value) => {
  if (value === "en" || value === "en-US") return "en-US";
  return "pt-BR";
};

const savedLanguage = normalizeLanguage(localStorage.getItem("language"));

i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": {
      translation: ptBR,
    },
    "en-US": {
      translation: en,
    },
  },
  lng: savedLanguage,
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import nbTranslations from "./locales/nb.json";

// Initialize i18next with best practices
i18n.use(initReactI18next).init({
  // Set Norwegian as the default language
  lng: "nb",
  fallbackLng: "en",

  // Resources for translations
  resources: {
    en: {
      translation: enTranslations,
    },
    nb: {
      translation: nbTranslations,
    },
  },

  // React-specific options
  react: {
    useSuspense: false,
  },

  // Interpolation options
  interpolation: {
    escapeValue: false, // React already escapes by default
  },

  // Debug mode (can be turned off in production)
  debug: false,
});

export default i18n;

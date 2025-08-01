import { createI18n } from 'vue-i18n';
import ar from './locales/ar.json';
import en from './locales/en.json';

const savedLanguage = localStorage.getItem('language') || 'ar';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLanguage,
  fallbackLocale: 'ar',
  messages: {
    ar,
    en
  }
});

export default i18n;

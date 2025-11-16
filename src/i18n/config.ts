import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// Dynamically load translation files to avoid JSON module resolution issues
const zh_CN = require('./locales/zh-CN.json');
const en = require('./locales/en.json');

// Get device language
const deviceLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';

// Map device language to supported language
const getSupportedLanguage = (deviceLang: string): 'zh-CN' | 'en' => {
  if (deviceLang.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en';
};

const resources = {
  'zh-CN': { translation: zh_CN },
  en: { translation: en }
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSupportedLanguage(deviceLanguage),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React is safe from XSS
  },
  ns: ['translation'],
  defaultNS: 'translation'
});

export default i18n;

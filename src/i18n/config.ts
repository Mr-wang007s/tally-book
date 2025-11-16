/**
 * i18n Configuration for Ledger Analytics
 * 
 * Initializes i18next with Chinese (zh-CN) and English (en) language support.
 * Uses react-native-localize for automatic device locale detection.
 * 
 * @module src/i18n/config
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

// Import translation files
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

/**
 * Available namespaces for translations
 * Organized by feature for better code splitting
 */
export const NAMESPACES = ['common', 'transactions', 'home', 'summary', 'trends', 'categories', 'messages'] as const;

/**
 * Supported language codes
 */
export const SUPPORTED_LANGUAGES = ['zh-CN', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Detect device language and select best match
 * Falls back to Chinese if no supported language is detected
 */
function getDeviceLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  
  if (locales && locales.length > 0) {
    const deviceLanguage = locales[0].languageTag;
    
    // Exact match (e.g., "zh-CN")
    if (SUPPORTED_LANGUAGES.includes(deviceLanguage as SupportedLanguage)) {
      return deviceLanguage as SupportedLanguage;
    }
    
    // Language code match (e.g., "zh" matches "zh-CN")
    const languageCode = deviceLanguage.split('-')[0];
    const match = SUPPORTED_LANGUAGES.find(lang => lang.startsWith(languageCode));
    if (match) {
      return match;
    }
  }
  
  // Default to Chinese
  return 'zh-CN';
}

/**
 * Translation resources
 * Structured by language → namespace → keys
 */
const resources = {
  'zh-CN': zhCN,
  'en': en,
};

/**
 * Initialize i18next
 */
i18n
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    // Resources
    resources,
    
    // Language settings
    lng: getDeviceLanguage(), // Detected language
    fallbackLng: 'zh-CN', // Fallback to Chinese
    supportedLngs: [...SUPPORTED_LANGUAGES],
    
    // Namespace settings
    ns: [...NAMESPACES],
    defaultNS: 'common',
    
    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React settings
    react: {
      useSuspense: false, // Disable suspense mode for React Native
    },
    
    // Development settings
    debug: __DEV__, // Enable debug logging in development
    
    // Missing key handling
    saveMissing: __DEV__, // Log missing keys in development
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      if (__DEV__) {
        console.warn(`[i18n] Missing translation: [${lngs}] ${ns}:${key}`);
      }
    },
    
    // Formatting
    returnNull: false, // Return key if translation is null
    returnEmptyString: false, // Return key if translation is empty
  });

/**
 * Change language programmatically
 * 
 * @example
 * import { changeLanguage } from '@/i18n/config';
 * changeLanguage('en');
 */
export async function changeLanguage(language: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(language);
}

/**
 * Get current language
 */
export function getCurrentLanguage(): SupportedLanguage {
  return i18n.language as SupportedLanguage;
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(language: string): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
}

export default i18n;

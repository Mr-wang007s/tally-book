/**
 * Type-safe i18n Translation Hook
 * 
 * Wraps react-i18next with type safety based on translation contracts.
 * Provides autocomplete and type checking for translation keys.
 * 
 * @module src/i18n/useTranslation
 */

import { useTranslation as useI18nBase } from 'react-i18next';
import type { UseTranslationReturn } from '@/contracts/i18n';
import type { SupportedLanguage } from './config';

/**
 * Type-safe translation hook
 * 
 * Provides strongly-typed translation function with autocomplete
 * for all translation keys defined in the i18n contracts.
 * 
 * @example
 * ```tsx
 * const { t, language, i18n } = useTranslation();
 * 
 * // Type-safe translation (autocomplete works!)
 * const okLabel = t('common.ok');
 * const amountLabel = t('transactions.amount');
 * const errorMsg = t('transactions.validation.amountRequired');
 * 
 * // Get current language
 * console.log(language); // 'zh-CN' or 'en'
 * 
 * // Change language programmatically
 * await i18n.changeLanguage('en');
 * ```
 * 
 * @returns Translation utilities with type safety
 */
export function useTranslation(): UseTranslationReturn {
  const { t, i18n } = useI18nBase();
  
  return {
    // Cast translation function to type-safe version
    t: t as UseTranslationReturn['t'],
    
    // Current language as typed value
    language: i18n.language as SupportedLanguage,
    
    // i18n instance for advanced usage
    i18n: {
      changeLanguage: async (lang: SupportedLanguage) => {
        await i18n.changeLanguage(lang);
      },
      language: i18n.language as SupportedLanguage,
      languages: i18n.languages as SupportedLanguage[],
    },
  };
}

/**
 * Hook for getting current language without translation function
 * 
 * Useful when you only need to check the current language
 * without triggering re-renders on translation updates.
 * 
 * @example
 * ```tsx
 * const language = useLanguage();
 * console.log(language); // 'zh-CN' or 'en'
 * ```
 */
export function useLanguage(): SupportedLanguage {
  const { i18n } = useI18nBase();
  return i18n.language as SupportedLanguage;
}

/**
 * Hook for changing language programmatically
 * 
 * Returns a stable function reference for changing language.
 * 
 * @example
 * ```tsx
 * const changeLanguage = useChangeLanguage();
 * 
 * const handleLanguageSwitch = async () => {
 *   await changeLanguage('en');
 * };
 * ```
 */
export function useChangeLanguage() {
  const { i18n } = useI18nBase();
  
  return async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
  };
}

/**
 * Re-export base hook for advanced usage
 * 
 * Use this when you need access to all i18next features
 * beyond what the type-safe hook provides.
 */
export { useI18nBase };

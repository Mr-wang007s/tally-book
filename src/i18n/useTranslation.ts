import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { Translations } from './types';

/**
 * Custom i18n hook with TypeScript type safety
 * Wraps react-i18next's useTranslation to provide strict typing
 */
export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  return {
    /**
     * Type-safe translation function
     * Usage: t('common.ok') or t('transactions.add')
     */
    t: t as (key: keyof Translations | string, options?: Record<string, any>) => string,
    i18n,
    language: i18n.language as 'zh-CN' | 'en'
  };
}

export default useTranslation;

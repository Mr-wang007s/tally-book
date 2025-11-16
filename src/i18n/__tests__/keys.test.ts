/**
 * Translation key validation utilities
 * Ensures all keys exist in both zh-CN and en locales
 */

import zhCN from '../locales/zh-CN.json';
import en from '../locales/en.json';

/**
 * Validate that both locale files have identical structure
 */
export function validateTranslationStructure(): { valid: boolean; errors: string[] } {
  const getKeys = (obj: any, prefix = ''): string[] => {
    const keys: string[] = [];
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...getKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  };

  const zhCNKeys = new Set(getKeys(zhCN));
  const enKeys = new Set(getKeys(en));

  const errors: string[] = [];
  const missingInEn = [...zhCNKeys].filter((key) => !enKeys.has(key));
  const missingInZhCN = [...enKeys].filter((key) => !zhCNKeys.has(key));

  if (missingInEn.length > 0) {
    errors.push(`Missing in English: ${missingInEn.join(', ')}`);
  }
  if (missingInZhCN.length > 0) {
    errors.push(`Missing in Chinese: ${missingInZhCN.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate that all required namespaces exist
 */
export function validateNamespaces(): { valid: boolean; errors: string[] } {
  const requiredNamespaces = ['common', 'transactions', 'home', 'summary', 'trends', 'validation'];
  const errors: string[] = [];

  for (const namespace of requiredNamespaces) {
    if (!zhCN.hasOwnProperty(namespace)) {
      errors.push(`Missing namespace in zh-CN: ${namespace}`);
    }
    if (!en.hasOwnProperty(namespace)) {
      errors.push(`Missing namespace in en: ${namespace}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate that no translation strings are empty
 */
export function validateNoEmptyStrings(): { valid: boolean; errors: string[] } {
  const checkForEmpty = (obj: any, namespace = ''): string[] => {
    const errors: string[] = [];
    for (const key in obj) {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const value = obj[key];

      if (typeof value === 'string') {
        if (value.trim() === '') {
          errors.push(`Empty string at ${fullKey}`);
        }
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        errors.push(...checkForEmpty(value, fullKey));
      }
    }
    return errors;
  };

  const zhCNErrors = checkForEmpty(zhCN, 'zh-CN');
  const enErrors = checkForEmpty(en, 'en');
  const allErrors = [...zhCNErrors, ...enErrors];

  return { valid: allErrors.length === 0, errors: allErrors };
}

/**
 * Run all validation checks
 */
export function validateAllTranslations(): { valid: boolean; summary: Record<string, any> } {
  const structureCheck = validateTranslationStructure();
  const namespaceCheck = validateNamespaces();
  const emptyCheck = validateNoEmptyStrings();

  return {
    valid: structureCheck.valid && namespaceCheck.valid && emptyCheck.valid,
    summary: {
      structure: structureCheck,
      namespaces: namespaceCheck,
      empty: emptyCheck
    }
  };
}

/**
 * Form validation schemas and utilities
 * Provides type-safe validation with i18n error messages
 */

import { useTranslation } from '@/src/i18n/useTranslation';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationSchema {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => ValidationResult;
}

/**
 * Validate amount field (positive number, max 2 decimals)
 */
export function validateAmount(value: string | number): ValidationResult {
  const { t } = useTranslation();
  const num = parseFloat(String(value));

  if (!value || isNaN(num)) {
    return { isValid: false, error: t('transactions.validation.amountRequired') };
  }

  if (num <= 0) {
    return { isValid: false, error: t('transactions.validation.amountPositive') };
  }

  if (!/^\d+(\.\d{0,2})?$/.test(String(value))) {
    return { isValid: false, error: t('transactions.validation.amountDecimal') };
  }

  return { isValid: true };
}

/**
 * Validate date field
 */
export function validateDate(value: Date | null): ValidationResult {
  const { t } = useTranslation();

  if (!value) {
    return { isValid: false, error: t('transactions.validation.dateRequired') };
  }

  if (!(value instanceof Date) || isNaN(value.getTime())) {
    return { isValid: false, error: t('transactions.validation.dateInvalid') };
  }

  const now = new Date();
  if (value > now) {
    return { isValid: false, error: t('transactions.validation.dateFuture') };
  }

  return { isValid: true };
}

/**
 * Validate category field
 */
export function validateCategory(value: string | null): ValidationResult {
  const { t } = useTranslation();

  if (!value || value.trim() === '') {
    return { isValid: false, error: t('transactions.validation.categoryRequired') };
  }

  return { isValid: true };
}

/**
 * Validate type field (income or expense)
 */
export function validateType(value: 'income' | 'expense' | null): ValidationResult {
  const { t } = useTranslation();

  if (!value || !['income', 'expense'].includes(value)) {
    return { isValid: false, error: t('transactions.validation.typeRequired') };
  }

  return { isValid: true };
}

/**
 * Generic field validation
 */
export function validateField(value: any, schema: ValidationSchema): ValidationResult {
  const { t } = useTranslation();

  if (schema.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return { isValid: false, error: t('validation.required') };
  }

  if (schema.minLength && String(value).length < schema.minLength) {
    return {
      isValid: false,
      error: t('validation.tooShort', { min: schema.minLength })
    };
  }

  if (schema.maxLength && String(value).length > schema.maxLength) {
    return {
      isValid: false,
      error: t('validation.tooLong', { max: schema.maxLength })
    };
  }

  if (schema.pattern && !schema.pattern.test(String(value))) {
    return { isValid: false, error: t('validation.pattern') };
  }

  if (schema.custom) {
    return schema.custom(value);
  }

  return { isValid: true };
}

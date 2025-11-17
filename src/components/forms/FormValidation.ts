/**
 * Form Validation Schemas
 * 
 * Zod-based validation schemas for all forms in the application.
 * Integrates with i18n for localized error messages.
 * 
 * @module src/components/forms/FormValidation
 */

import { z } from 'zod';

/**
 * Transaction validation schema
 * 
 * Validates transaction data including:
 * - Type (income/expense)
 * - Amount (positive number)
 * - Date (valid ISO date string)
 * - Category ID (required string)
 * - Note (optional, max 500 chars)
 * - Payment method (optional)
 */
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'transactions.validation.typeRequired',
    invalid_type_error: 'transactions.validation.typeRequired',
  }),
  
  amount: z
    .number({
      required_error: 'transactions.validation.amountRequired',
      invalid_type_error: 'transactions.validation.amountInvalid',
    })
    .positive({
      message: 'transactions.validation.amountPositive',
    }),
  
  date: z
    .string({
      required_error: 'transactions.validation.dateRequired',
    })
    .datetime({
      message: 'transactions.validation.dateInvalid',
    })
    .or(
      z.date({
        required_error: 'transactions.validation.dateRequired',
        invalid_type_error: 'transactions.validation.dateInvalid',
      })
    ),
  
  categoryId: z
    .string({
      required_error: 'transactions.validation.categoryRequired',
    })
    .min(1, {
      message: 'transactions.validation.categoryRequired',
    }),
  
  note: z
    .string()
    .max(500, {
      message: 'transactions.validation.noteMaxLength',
    })
    .optional(),
  
  paymentMethod: z.string().optional(),
});

/**
 * Type inference from schema
 */
export type TransactionFormData = z.infer<typeof transactionSchema>;

/**
 * Partial schema for step-by-step validation
 * Use when validating individual fields
 */
export const transactionPartialSchema = transactionSchema.partial();

/**
 * String amount schema for form input (converts to number)
 * Use this for text input fields that need to be converted to numbers
 */
export const transactionStringAmountSchema = transactionSchema.extend({
  amount: z
    .string({
      required_error: 'transactions.validation.amountRequired',
    })
    .min(1, {
      message: 'transactions.validation.amountRequired',
    })
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      {
        message: 'transactions.validation.amountPositive',
      }
    )
    .transform((val) => Number(val)),
});

/**
 * Validate a single field
 * Returns error message (i18n key) or undefined if valid
 * 
 * @example
 * const amountError = validateField('amount', formData.amount, transactionSchema);
 * if (amountError) {
 *   setErrors({ ...errors, amount: amountError });
 * }
 */
export function validateField<T extends z.ZodType>(
  fieldName: string,
  value: any,
  schema: T
): string | undefined {
  try {
    // Extract the field schema
    if (schema instanceof z.ZodObject) {
      const fieldSchema = schema.shape[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
      }
    }
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return first error message (i18n key)
      return error.errors[0]?.message;
    }
    return 'messages.error.invalidInput';
  }
}

/**
 * Validate entire form
 * Returns object with field errors or empty object if valid
 * 
 * @example
 * const errors = validateForm(formData, transactionSchema);
 * if (Object.keys(errors).length > 0) {
 *   setErrors(errors);
 *   return;
 * }
 */
export function validateForm<T extends z.ZodType>(
  data: any,
  schema: T
): Record<string, string> {
  try {
    schema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      return errors;
    }
    return { _form: 'messages.error.invalidInput' };
  }
}

/**
 * Safe parse with detailed error information
 * Returns { success: true, data } or { success: false, errors }
 * 
 * @example
 * const result = safeValidate(formData, transactionSchema);
 * if (!result.success) {
 *   console.error(result.errors);
 * } else {
 *   await submitTransaction(result.data);
 * }
 */
export function safeValidate<T extends z.ZodType>(
  data: any,
  schema: T
): 
  | { success: true; data: z.infer<T> }
  | { success: false; errors: Record<string, string> } 
{
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      const field = err.path.join('.');
      errors[field] = err.message;
    });
    return { success: false, errors };
  }
}

/**
 * Custom error formatter
 * Formats Zod errors for display in forms
 */
export function formatValidationError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const field = err.path.join('.');
    formatted[field] = err.message;
  });
  
  return formatted;
}

/**
 * Validation helpers for individual fields
 * These return { isValid: boolean; error?: string } format
 */

export function validateType(type: string): { isValid: boolean; error?: string } {
  try {
    z.enum(['income', 'expense']).parse(type);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'transactions.validation.typeRequired' };
  }
}

export function validateAmount(amount: string): { isValid: boolean; error?: string } {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'transactions.validation.amountRequired' };
  }
  
  const numAmount = Number(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'transactions.validation.amountInvalid' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'transactions.validation.amountPositive' };
  }
  
  return { isValid: true };
}

export function validateDate(date: Date | string): { isValid: boolean; error?: string } {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: 'transactions.validation.dateInvalid' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'transactions.validation.dateInvalid' };
  }
}

export function validateCategory(categoryId: string): { isValid: boolean; error?: string } {
  if (!categoryId || categoryId.trim() === '') {
    return { isValid: false, error: 'transactions.validation.categoryRequired' };
  }
  return { isValid: true };
}

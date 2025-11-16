/**
 * Validation Message Mapping
 * 
 * Maps validation error messages to i18n translation keys.
 * Used by FormField component to display localized errors.
 * 
 * @module src/components/forms/validationMessages
 */

/**
 * Transaction validation messages
 * All values are i18n keys that will be translated by FormField
 */
export const transactionValidationMessages = {
  // Type validation
  typeRequired: 'transactions.validation.typeRequired',
  
  // Amount validation
  amountRequired: 'transactions.validation.amountRequired',
  amountPositive: 'transactions.validation.amountPositive',
  amountInvalid: 'transactions.validation.amountInvalid',
  
  // Category validation
  categoryRequired: 'transactions.validation.categoryRequired',
  categoryInvalid: 'transactions.validation.categoryInvalid',
  
  // Date validation
  dateRequired: 'transactions.validation.dateRequired',
  dateInvalid: 'transactions.validation.dateInvalid',
  
  // Note validation
  noteMaxLength: 'transactions.validation.noteMaxLength',
} as const;

/**
 * Common validation messages
 * Generic error messages used across multiple forms
 */
export const commonValidationMessages = {
  required: 'common.error',
  invalid: 'messages.error.invalidInput',
  tooLong: 'messages.error.invalidInput',
  tooShort: 'messages.error.invalidInput',
} as const;

/**
 * All validation messages combined
 * Export as default for easy import
 */
export const validationMessages = {
  transaction: transactionValidationMessages,
  common: commonValidationMessages,
} as const;

/**
 * Type for validation message keys
 */
export type ValidationMessageKey = 
  | keyof typeof transactionValidationMessages
  | keyof typeof commonValidationMessages;

/**
 * Get validation message i18n key
 * 
 * @example
 * const errorKey = getValidationMessage('amountRequired');
 * // Returns: 'transactions.validation.amountRequired'
 */
export function getValidationMessage(
  key: keyof typeof transactionValidationMessages
): string {
  return transactionValidationMessages[key];
}

/**
 * Helper to create error object for FormField
 * 
 * @example
 * const errors = createFormErrors({
 *   amount: 'amountRequired',
 *   category: 'categoryRequired',
 * });
 * // Returns: { amount: 'transactions.validation.amountRequired', ... }
 */
export function createFormErrors(
  errors: Record<string, keyof typeof transactionValidationMessages>
): Record<string, string> {
  const result: Record<string, string> = {};
  
  Object.entries(errors).forEach(([field, key]) => {
    result[field] = transactionValidationMessages[key];
  });
  
  return result;
}

export default validationMessages;

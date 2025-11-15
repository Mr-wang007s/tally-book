/**
 * Validation Utilities
 * Provides validation rules for transactions and other entities
 */

import { CreateTransactionInput, UpdateTransactionInput } from '@/models/transaction';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate amount
 */
export function validateAmount(amount: number | undefined): string | null {
  if (amount === undefined || amount === null) {
    return 'Amount is required';
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Amount must be a valid number';
  }
  if (amount <= 0) {
    return 'Amount must be greater than zero';
  }
  if (amount > 999999999) {
    return 'Amount is too large';
  }
  return null;
}

/**
 * Validate date
 */
export function validateDate(date: string | undefined): string | null {
  if (!date) {
    return 'Date is required';
  }

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return 'Date is not valid';
  }

  // Check reasonable bounds (not too far in past or future)
  const now = new Date();
  const minDate = new Date(2000, 0, 1);
  const maxDate = new Date(now.getFullYear() + 10, 11, 31);

  if (parsed < minDate) {
    return 'Date is too far in the past';
  }
  if (parsed > maxDate) {
    return 'Date is too far in the future';
  }

  return null;
}

/**
 * Validate category ID
 */
export function validateCategoryId(
  categoryId: string | undefined,
  validCategoryIds: string[]
): string | null {
  if (!categoryId) {
    return 'Category is required';
  }
  if (!validCategoryIds.includes(categoryId)) {
    return 'Invalid category selected';
  }
  return null;
}

/**
 * Validate note
 */
export function validateNote(note: string | undefined): string | null {
  if (!note) {
    return null; // Note is optional
  }
  if (note.length > 500) {
    return 'Note cannot exceed 500 characters';
  }
  return null;
}

/**
 * Validate transaction creation input
 */
export function validateCreateTransaction(
  input: CreateTransactionInput,
  validCategoryIds: string[]
): ValidationResult {
  const errors: Record<string, string> = {};

  const amountError = validateAmount(input.amount);
  if (amountError) errors.amount = amountError;

  const dateError = validateDate(input.date);
  if (dateError) errors.date = dateError;

  const categoryError = validateCategoryId(input.categoryId, validCategoryIds);
  if (categoryError) errors.categoryId = categoryError;

  const noteError = validateNote(input.note);
  if (noteError) errors.note = noteError;

  if (!input.type || !['income', 'expense'].includes(input.type)) {
    errors.type = 'Transaction type must be income or expense';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate transaction update input
 */
export function validateUpdateTransaction(
  input: UpdateTransactionInput,
  validCategoryIds: string[]
): ValidationResult {
  const errors: Record<string, string> = {};

  if (input.amount !== undefined) {
    const amountError = validateAmount(input.amount);
    if (amountError) errors.amount = amountError;
  }

  if (input.date !== undefined) {
    const dateError = validateDate(input.date);
    if (dateError) errors.date = dateError;
  }

  if (input.categoryId !== undefined) {
    const categoryError = validateCategoryId(input.categoryId, validCategoryIds);
    if (categoryError) errors.categoryId = categoryError;
  }

  if (input.note !== undefined) {
    const noteError = validateNote(input.note);
    if (noteError) errors.note = noteError;
  }

  if (input.type !== undefined && !['income', 'expense'].includes(input.type)) {
    errors.type = 'Transaction type must be income or expense';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

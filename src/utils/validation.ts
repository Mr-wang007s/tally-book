/**
 * Validation Utilities
 * 
 * Provides validation functions for transactions and filter criteria
 * based on business rules defined in data-model.md
 * 
 * @module ValidationUtils
 */

import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  FilterCriteria,
  ValidationResult,
  TransactionType,
} from '@/types/transaction';

/**
 * Validate a complete transaction object
 */
export function validateTransaction(transaction: Partial<Transaction>): ValidationResult {
  const errors: string[] = [];

  // Amount validation
  if (transaction.amount === undefined || transaction.amount === null) {
    errors.push('Amount is required');
  } else if (transaction.amount <= 0) {
    errors.push('Amount must be greater than 0');
  } else if (!Number.isFinite(transaction.amount)) {
    errors.push('Amount must be a valid number');
  } else {
    // Check decimal places (max 2)
    const decimalPlaces = (transaction.amount.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      errors.push('Amount cannot have more than 2 decimal places');
    }
  }

  // Type validation
  if (!transaction.type) {
    errors.push('Transaction type is required');
  } else if (!['income', 'expense', 'transfer'].includes(transaction.type)) {
    errors.push('Invalid transaction type');
  }

  // Account validation based on type
  if (transaction.type) {
    switch (transaction.type) {
      case 'income':
        if (!transaction.toAccount) {
          errors.push('Income transactions require a destination account (toAccount)');
        }
        if (transaction.fromAccount) {
          errors.push('Income transactions should not have a source account (fromAccount)');
        }
        break;
      case 'expense':
        if (!transaction.fromAccount) {
          errors.push('Expense transactions require a source account (fromAccount)');
        }
        if (transaction.toAccount) {
          errors.push('Expense transactions should not have a destination account (toAccount)');
        }
        break;
      case 'transfer':
        if (!transaction.fromAccount || !transaction.toAccount) {
          errors.push('Transfer transactions require both source and destination accounts');
        }
        if (transaction.fromAccount === transaction.toAccount) {
          errors.push('Transfer source and destination accounts must be different');
        }
        break;
    }
  }

  // Category validation
  if (!transaction.category) {
    errors.push('Category is required');
  } else if (typeof transaction.category !== 'string' || transaction.category.trim() === '') {
    errors.push('Category must be a non-empty string');
  }

  // Description validation (optional, but if provided must be valid)
  if (transaction.description !== undefined && transaction.description !== null) {
    if (typeof transaction.description !== 'string') {
      errors.push('Description must be a string');
    } else if (transaction.description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }
  }

  // Attachments validation (optional)
  if (transaction.attachments !== undefined && transaction.attachments !== null) {
    if (!Array.isArray(transaction.attachments)) {
      errors.push('Attachments must be an array');
    } else {
      transaction.attachments.forEach((uri, index) => {
        if (typeof uri !== 'string' || uri.trim() === '') {
          errors.push(`Attachment at index ${index} must be a non-empty string`);
        }
      });
    }
  }

  // Timestamp validation (optional, but if provided must be valid)
  if (transaction.timestamp !== undefined && transaction.timestamp !== null) {
    if (!Number.isInteger(transaction.timestamp) || transaction.timestamp < 0) {
      errors.push('Timestamp must be a positive integer (Unix epoch in milliseconds)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate create transaction input
 */
export function validateCreateInput(input: CreateTransactionInput): ValidationResult {
  return validateTransaction({
    ...input,
    id: 'temp', // Dummy ID for validation
    createdAt: Date.now(),
    updatedAt: Date.now(),
    timestamp: input.timestamp || Date.now(),
  });
}

/**
 * Validate update transaction input
 */
export function validateUpdateInput(input: UpdateTransactionInput): ValidationResult {
  const errors: string[] = [];

  // ID is required for updates
  if (!input.id || typeof input.id !== 'string' || input.id.trim() === '') {
    errors.push('Transaction ID is required for updates');
  }

  // Validate only the fields that are being updated
  // We'll construct a partial transaction with only the provided fields
  const partialTransaction: Partial<Transaction> = {
    id: input.id,
  };

  // Add fields if they're being updated
  if (input.amount !== undefined) partialTransaction.amount = input.amount;
  if (input.type !== undefined) partialTransaction.type = input.type;
  if (input.fromAccount !== undefined) partialTransaction.fromAccount = input.fromAccount;
  if (input.toAccount !== undefined) partialTransaction.toAccount = input.toAccount;
  if (input.category !== undefined) partialTransaction.category = input.category;
  if (input.description !== undefined) partialTransaction.description = input.description;
  if (input.attachments !== undefined) partialTransaction.attachments = input.attachments;
  if (input.timestamp !== undefined) partialTransaction.timestamp = input.timestamp;

  // If at least one field is being updated, validate those fields
  // But skip validation if no fields are provided (except ID)
  const fieldsToUpdate = Object.keys(input).filter(key => key !== 'id');
  if (fieldsToUpdate.length === 0) {
    errors.push('At least one field must be provided for update');
  }

  // Partial validation - only validate fields that are present
  // Note: We need the full transaction for proper account validation,
  // so this is a simplified validation. Full validation should happen
  // after merging with the existing transaction.
  if (input.amount !== undefined) {
    if (input.amount <= 0) errors.push('Amount must be greater than 0');
    if (!Number.isFinite(input.amount)) errors.push('Amount must be a valid number');
    const decimalPlaces = (input.amount.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) errors.push('Amount cannot have more than 2 decimal places');
  }

  if (input.type !== undefined && !['income', 'expense', 'transfer'].includes(input.type)) {
    errors.push('Invalid transaction type');
  }

  if (input.category !== undefined) {
    if (typeof input.category !== 'string' || input.category.trim() === '') {
      errors.push('Category must be a non-empty string');
    }
  }

  if (input.description !== undefined && input.description !== null) {
    if (typeof input.description !== 'string') {
      errors.push('Description must be a string');
    } else if (input.description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate filter criteria
 */
export function validateFilterCriteria(criteria: FilterCriteria): ValidationResult {
  const errors: string[] = [];

  // Type filter validation (optional)
  if (criteria.typeFilter !== null && criteria.typeFilter !== undefined) {
    if (!['income', 'expense', 'transfer'].includes(criteria.typeFilter)) {
      errors.push('Invalid type filter');
    }
  }

  // Sort option validation (required)
  if (!criteria.sortBy) {
    errors.push('Sort option is required');
  } else if (!['highest', 'lowest', 'newest', 'oldest'].includes(criteria.sortBy)) {
    errors.push('Invalid sort option');
  }

  // Selected categories validation (optional)
  if (criteria.selectedCategories !== undefined && criteria.selectedCategories !== null) {
    if (!Array.isArray(criteria.selectedCategories)) {
      errors.push('Selected categories must be an array');
    } else {
      criteria.selectedCategories.forEach((categoryId, index) => {
        if (typeof categoryId !== 'string' || categoryId.trim() === '') {
          errors.push(`Category ID at index ${index} must be a non-empty string`);
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

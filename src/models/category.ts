/**
 * Category Entity
 * Represents an income or expense category
 */

import { TransactionType } from './transaction';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Generate a unique ID for a category
 */
export function generateCategoryId(): string {
  return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new category
 */
export function createCategory(
  name: string,
  type: TransactionType,
  isDefault: boolean = false
): Category {
  return {
    id: generateCategoryId(),
    name,
    type,
    isDefault,
    createdAt: new Date().toISOString(),
  };
}

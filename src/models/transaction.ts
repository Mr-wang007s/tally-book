/**
 * Transaction Entity
 * Represents an income or expense transaction
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO date string
  categoryId: string;
  note?: string;
  paymentMethod?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  date: string;
  categoryId: string;
  note?: string;
  paymentMethod?: string;
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  amount?: number;
  date?: string;
  categoryId?: string;
  note?: string;
  paymentMethod?: string;
}

/**
 * Generate a unique ID for a transaction
 */
export function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new transaction
 */
export function createTransaction(input: CreateTransactionInput): Transaction {
  const now = new Date().toISOString();
  return {
    id: generateTransactionId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update an existing transaction
 */
export function updateTransaction(
  transaction: Transaction,
  updates: UpdateTransactionInput
): Transaction {
  return {
    ...transaction,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

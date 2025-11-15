/**
 * Transactions Service
 * Manages transaction CRUD operations with local persistence
 */

import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  createTransaction,
  updateTransaction as updateTransactionModel,
} from '@/models/transaction';
import { Category } from '@/models/category';
import { storage } from '@/storage/localAdapter';
import { STORAGE_KEYS } from '@/storage/storage';
import { validateCreateTransaction, validateUpdateTransaction } from './validation';
import defaultCategories from '@/storage/seeds/categories.json';

/**
 * Load all transactions from storage
 */
export async function loadTransactions(): Promise<Transaction[]> {
  const transactions = await storage.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS);
  return transactions || [];
}

/**
 * Save transactions to storage
 */
async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await storage.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
}

/**
 * Load categories from storage
 */
export async function loadCategories(): Promise<Category[]> {
  let categories = await storage.getItem<Category[]>(STORAGE_KEYS.CATEGORIES);

  // Initialize with default categories if none exist
  if (!categories || categories.length === 0) {
    categories = (defaultCategories as any[]).map((cat) => ({
      ...cat,
      createdAt: new Date().toISOString(),
    })) as Category[];
    await storage.setItem(STORAGE_KEYS.CATEGORIES, categories);
  }

  return categories;
}

/**
 * Create a new transaction
 */
export async function addTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const categories = await loadCategories();
  const categoryIds = categories.map((c) => c.id);

  // Validate input
  const validation = validateCreateTransaction(input, categoryIds);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError || 'Validation failed');
  }

  const transactions = await loadTransactions();
  const newTransaction = createTransaction(input);
  transactions.push(newTransaction);
  await saveTransactions(transactions);

  return newTransaction;
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(
  id: string,
  updates: UpdateTransactionInput
): Promise<Transaction> {
  const categories = await loadCategories();
  const categoryIds = categories.map((c) => c.id);

  // Validate updates
  const validation = validateUpdateTransaction(updates, categoryIds);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError || 'Validation failed');
  }

  const transactions = await loadTransactions();
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error('Transaction not found');
  }

  const updatedTransaction = updateTransactionModel(transactions[index], updates);
  transactions[index] = updatedTransaction;
  await saveTransactions(transactions);

  return updatedTransaction;
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string): Promise<void> {
  const transactions = await loadTransactions();
  const filtered = transactions.filter((t) => t.id !== id);

  if (filtered.length === transactions.length) {
    throw new Error('Transaction not found');
  }

  await saveTransactions(filtered);
}

/**
 * Get transactions by period
 */
export async function getTransactionsByPeriod(
  startDate: string,
  endDate: string
): Promise<Transaction[]> {
  const transactions = await loadTransactions();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return transactions
    .filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= start && txnDate <= end;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single transaction by ID
 */
export async function getTransactionById(id: string): Promise<Transaction | null> {
  const transactions = await loadTransactions();
  return transactions.find((t) => t.id === id) || null;
}

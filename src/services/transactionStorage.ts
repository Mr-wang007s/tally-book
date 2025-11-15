/**
 * Transaction Storage Service
 * 
 * Handles all AsyncStorage operations for transactions, accounts, categories, and filter criteria.
 * Uses in-memory caching for performance optimization.
 * 
 * @module TransactionStorageService
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Transaction,
  Account,
  Category,
  FilterCriteria,
  DEFAULT_FILTER_CRITERIA,
} from '@/types/transaction';

// Storage keys
const KEYS = {
  TRANSACTIONS: '@transactions',
  ACCOUNTS: '@accounts',
  CATEGORIES: '@categories',
  FILTER_CRITERIA: '@filter_criteria',
} as const;

// In-memory cache
let transactionsCache: Transaction[] | null = null;
let accountsCache: Account[] | null = null;
let categoriesCache: Category[] | null = null;

/**
 * Load all transactions from AsyncStorage
 */
export async function loadTransactions(): Promise<Transaction[]> {
  try {
    // Return cached value if available
    if (transactionsCache !== null) {
      return transactionsCache;
    }

    const data = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
    if (!data) {
      transactionsCache = [];
      return [];
    }

    const transactions = JSON.parse(data) as Transaction[];
    transactionsCache = transactions;
    return transactions;
  } catch (error) {
    console.error('[transactionStorage] Failed to load transactions:', error);
    return [];
  }
}

/**
 * Save all transactions to AsyncStorage
 */
export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    transactionsCache = transactions; // Update cache
  } catch (error) {
    console.error('[transactionStorage] Failed to save transactions:', error);
    throw new Error('Failed to save transactions');
  }
}

/**
 * Load all accounts from AsyncStorage
 */
export async function loadAccounts(): Promise<Account[]> {
  try {
    // Return cached value if available
    if (accountsCache !== null) {
      return accountsCache;
    }

    const data = await AsyncStorage.getItem(KEYS.ACCOUNTS);
    if (!data) {
      accountsCache = [];
      return [];
    }

    const accounts = JSON.parse(data) as Account[];
    accountsCache = accounts;
    return accounts;
  } catch (error) {
    console.error('[transactionStorage] Failed to load accounts:', error);
    return [];
  }
}

/**
 * Load all categories from AsyncStorage
 */
export async function loadCategories(): Promise<Category[]> {
  try {
    // Return cached value if available
    if (categoriesCache !== null) {
      return categoriesCache;
    }

    const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
    if (!data) {
      categoriesCache = [];
      return [];
    }

    const categories = JSON.parse(data) as Category[];
    categoriesCache = categories;
    return categories;
  } catch (error) {
    console.error('[transactionStorage] Failed to load categories:', error);
    return [];
  }
}

/**
 * Save filter criteria to AsyncStorage
 */
export async function saveFilterCriteria(criteria: FilterCriteria): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.FILTER_CRITERIA, JSON.stringify(criteria));
  } catch (error) {
    console.error('[transactionStorage] Failed to save filter criteria:', error);
    throw new Error('Failed to save filter criteria');
  }
}

/**
 * Load filter criteria from AsyncStorage
 */
export async function loadFilterCriteria(): Promise<FilterCriteria | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.FILTER_CRITERIA);
    if (!data) {
      return null;
    }

    return JSON.parse(data) as FilterCriteria;
  } catch (error) {
    console.error('[transactionStorage] Failed to load filter criteria:', error);
    return null;
  }
}

/**
 * Clear all transaction-related cache
 * Useful for testing or when forcing a full reload
 */
export function clearCache(): void {
  transactionsCache = null;
  accountsCache = null;
  categoriesCache = null;
}

/**
 * Service object implementing TransactionStorageService interface
 */
export const transactionStorageService = {
  loadTransactions,
  saveTransactions,
  loadAccounts,
  loadCategories,
  saveFilterCriteria,
  loadFilterCriteria,
};

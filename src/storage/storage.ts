/**
 * Storage Adapter Interface
 * Abstract interface for local persistence, allowing different implementations
 */

export interface StorageAdapter {
  /**
   * Get item by key
   */
  getItem<T>(key: string): Promise<T | null>;

  /**
   * Set item by key
   */
  setItem<T>(key: string, value: T): Promise<void>;

  /**
   * Remove item by key
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clear all items
   */
  clear(): Promise<void>;

  /**
   * Get all keys
   */
  getAllKeys(): Promise<string[]>;
}

/**
 * Storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  PREFERENCES: 'preferences',
} as const;

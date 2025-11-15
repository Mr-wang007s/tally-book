/**
 * useTransactionCRUD Hook
 * 
 * Provides CRUD operations for transactions with AsyncStorage persistence
 * 
 * @module useTransactionCRUD
 */

import { useState, useEffect, useCallback } from 'react';
import * as storageService from '@/services/transactionStorage';
import { validateCreateInput, validateUpdateInput } from '@/utils/validation';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  UseTransactionCRUDResult,
} from '@/types/transaction';

/**
 * Generate a simple UUID v4
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useTransactionCRUD(): UseTransactionCRUDResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load transactions on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const loadedTransactions = await storageService.loadTransactions();
        setTransactions(loadedTransactions);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('[useTransactionCRUD] Failed to load transactions:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  /**
   * Create a new transaction
   */
  const createTransaction = useCallback(
    async (input: CreateTransactionInput): Promise<Transaction> => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate input
        const validation = validateCreateInput(input);
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        const now = Date.now();
        const newTransaction: Transaction = {
          id: generateId(),
          amount: input.amount,
          timestamp: input.timestamp || now,
          type: input.type,
          fromAccount: input.fromAccount,
          toAccount: input.toAccount,
          category: input.category,
          description: input.description,
          attachments: input.attachments,
          createdAt: now,
          updatedAt: now,
        };

        const updatedTransactions = [...transactions, newTransaction];
        await storageService.saveTransactions(updatedTransactions);
        setTransactions(updatedTransactions);

        return newTransaction;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [transactions]
  );

  /**
   * Update an existing transaction
   */
  const updateTransaction = useCallback(
    async (input: UpdateTransactionInput): Promise<Transaction> {
      setIsLoading(true);
      setError(null);

      try {
        // Validate input
        const validation = validateUpdateInput(input);
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Find existing transaction
        const existingTransaction = transactions.find((t) => t.id === input.id);
        if (!existingTransaction) {
          throw new Error(`Transaction with ID ${input.id} not found`);
        }

        // Merge updates
        const updatedTransaction: Transaction = {
          ...existingTransaction,
          ...input,
          updatedAt: Date.now(),
        };

        const updatedTransactions = transactions.map((t) =>
          t.id === input.id ? updatedTransaction : t
        );

        await storageService.saveTransactions(updatedTransactions);
        setTransactions(updatedTransactions);

        return updatedTransaction;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [transactions]
  );

  /**
   * Delete a transaction
   */
  const deleteTransaction = useCallback(
    async (id: string): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const updatedTransactions = transactions.filter((t) => t.id !== id);
        await storageService.saveTransactions(updatedTransactions);
        setTransactions(updatedTransactions);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [transactions]
  );

  /**
   * Get a single transaction by ID
   */
  const getTransaction = useCallback(
    (id: string): Transaction | undefined => {
      return transactions.find((t) => t.id === id);
    },
    [transactions]
  );

  return {
    transactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    isLoading,
    error,
  };
}

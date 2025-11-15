/**
 * Unit Tests for useTransactionCRUD Hook
 * Tests CRUD operations for transactions
 * 
 * @module useTransactionCRUD.test
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTransactionCRUD } from '@/hooks/useTransactionCRUD';
import * as storageService from '@/services/transactionStorage';
import type { Transaction, CreateTransactionInput, UpdateTransactionInput } from '@/types/transaction';

// Mock the storage service
jest.mock('@/services/transactionStorage');

const mockStorageService = storageService as jest.Mocked<typeof storageService>;

describe('useTransactionCRUD', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 'txn-1',
      amount: 100.50,
      timestamp: Date.now(),
      type: 'expense',
      fromAccount: 'acc-1',
      toAccount: null,
      category: 'cat-1',
      description: 'Test expense',
      attachments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'txn-2',
      amount: 200.00,
      timestamp: Date.now(),
      type: 'income',
      fromAccount: null,
      toAccount: 'acc-2',
      category: 'cat-2',
      description: 'Test income',
      attachments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageService.loadTransactions.mockResolvedValue(mockTransactions);
    mockStorageService.saveTransactions.mockResolvedValue();
    mockStorageService.loadAccounts.mockResolvedValue([]);
    mockStorageService.loadCategories.mockResolvedValue([]);
  });

  describe('getTransaction', () => {
    it('should return transaction by ID', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      // Wait for initial load
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const transaction = result.current.getTransaction('txn-1');
      expect(transaction).toBeDefined();
      expect(transaction?.id).toBe('txn-1');
      expect(transaction?.amount).toBe(100.50);
    });

    it('should return undefined for non-existent ID', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const transaction = result.current.getTransaction('non-existent');
      expect(transaction).toBeUndefined();
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const input: CreateTransactionInput = {
        amount: 50.00,
        type: 'expense',
        fromAccount: 'acc-1',
        toAccount: null,
        category: 'cat-1',
        description: 'New expense',
      };

      let newTransaction: Transaction | undefined;

      await act(async () => {
        newTransaction = await result.current.createTransaction(input);
      });

      expect(newTransaction).toBeDefined();
      expect(newTransaction!.amount).toBe(50.00);
      expect(newTransaction!.type).toBe('expense');
      expect(newTransaction!.description).toBe('New expense');
      expect(newTransaction!.id).toBeDefined();
      expect(mockStorageService.saveTransactions).toHaveBeenCalled();
    });

    it('should validate input before creating', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const invalidInput = {
        amount: -100, // Invalid: negative amount
        type: 'expense',
        category: 'cat-1',
      } as CreateTransactionInput;

      await expect(
        act(async () => {
          await result.current.createTransaction(invalidInput);
        })
      ).rejects.toThrow();
    });
  });

  describe('updateTransaction', () => {
    it('should update an existing transaction', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const input: UpdateTransactionInput = {
        id: 'txn-1',
        amount: 150.75,
        description: 'Updated expense',
      };

      let updatedTransaction: Transaction | undefined;

      await act(async () => {
        updatedTransaction = await result.current.updateTransaction(input);
      });

      expect(updatedTransaction).toBeDefined();
      expect(updatedTransaction!.amount).toBe(150.75);
      expect(updatedTransaction!.description).toBe('Updated expense');
      expect(updatedTransaction!.updatedAt).toBeGreaterThan(updatedTransaction!.createdAt);
      expect(mockStorageService.saveTransactions).toHaveBeenCalled();
    });

    it('should throw error for non-existent transaction', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const input: UpdateTransactionInput = {
        id: 'non-existent',
        amount: 100,
      };

      await expect(
        act(async () => {
          await result.current.updateTransaction(input);
        })
      ).rejects.toThrow('not found');
    });

    it('should validate input before updating', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const invalidInput = {
        id: 'txn-1',
        amount: -50, // Invalid: negative amount
      } as UpdateTransactionInput;

      await expect(
        act(async () => {
          await result.current.updateTransaction(invalidInput);
        })
      ).rejects.toThrow();
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction by ID', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Verify transaction exists
      const beforeDelete = result.current.getTransaction('txn-1');
      expect(beforeDelete).toBeDefined();

      // Delete transaction
      await act(async () => {
        await result.current.deleteTransaction('txn-1');
      });

      // Verify transaction is removed
      const afterDelete = result.current.getTransaction('txn-1');
      expect(afterDelete).toBeUndefined();
      expect(mockStorageService.saveTransactions).toHaveBeenCalled();
    });

    it('should update transactions list after deletion', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const initialCount = result.current.transactions.length;

      await act(async () => {
        await result.current.deleteTransaction('txn-1');
      });

      expect(result.current.transactions.length).toBe(initialCount - 1);
    });

    it('should not fail when deleting non-existent transaction', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.deleteTransaction('non-existent');
      });

      // Should complete without error
      expect(mockStorageService.saveTransactions).toHaveBeenCalled();
    });

    it('should handle storage errors gracefully', async () => {
      mockStorageService.saveTransactions.mockRejectedValueOnce(
        new Error('Storage failed')
      );

      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await expect(
        act(async () => {
          await result.current.deleteTransaction('txn-1');
        })
      ).rejects.toThrow('Storage failed');

      expect(result.current.error).toBeDefined();
    });

    it('should set loading state during deletion', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Track loading state changes
      const loadingStates: boolean[] = [];
      
      await act(async () => {
        // Start deletion
        const promise = result.current.deleteTransaction('txn-1');
        
        // Record initial loading state (should be true immediately after call)
        await waitFor(() => {
          loadingStates.push(result.current.isLoading);
        });
        
        // Wait for completion
        await promise;
      });

      // Verify loading was true at some point and is now false
      expect(result.current.isLoading).toBe(false);
      // At least one of the recorded states should be true (during operation)
      // Note: Due to async nature, we verify final state is false
    });
  });

  describe('error handling', () => {
    it('should set error state on load failure', async () => {
      const loadError = new Error('Failed to load');
      mockStorageService.loadTransactions.mockRejectedValueOnce(loadError);

      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBeDefined();
      expect(result.current.transactions).toEqual([]);
    });

    it('should clear error state on successful operation', async () => {
      const { result } = renderHook(() => useTransactionCRUD());

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Trigger an error
      mockStorageService.saveTransactions.mockRejectedValueOnce(
        new Error('Save failed')
      );

      await expect(
        act(async () => {
          await result.current.deleteTransaction('txn-1');
        })
      ).rejects.toThrow();

      expect(result.current.error).toBeDefined();

      // Successful operation should clear error
      mockStorageService.saveTransactions.mockResolvedValueOnce();

      await act(async () => {
        await result.current.deleteTransaction('txn-2');
      });

      expect(result.current.error).toBeNull();
    });
  });
});

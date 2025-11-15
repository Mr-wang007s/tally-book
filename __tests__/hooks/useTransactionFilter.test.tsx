/**
 * Unit Tests for useTransactionFilter Hook
 * Tests filtering and sorting logic
 * 
 * @module useTransactionFilter.test
 */

import { renderHook, act } from '@testing-library/react-native';
import { useTransactionFilter } from '@/hooks/useTransactionFilter';
import type { Transaction, FilterCriteria } from '@/types/transaction';

describe('useTransactionFilter', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 'txn-1',
      amount: 100.00,
      timestamp: 1000000,
      type: 'expense',
      fromAccount: 'acc-1',
      toAccount: null,
      category: 'cat-shopping',
      description: 'Shopping',
      createdAt: 1000000,
      updatedAt: 1000000,
    },
    {
      id: 'txn-2',
      amount: 200.00,
      timestamp: 2000000,
      type: 'income',
      fromAccount: null,
      toAccount: 'acc-2',
      category: 'cat-salary',
      description: 'Salary',
      createdAt: 2000000,
      updatedAt: 2000000,
    },
    {
      id: 'txn-3',
      amount: 50.00,
      timestamp: 3000000,
      type: 'expense',
      fromAccount: 'acc-1',
      toAccount: null,
      category: 'cat-food',
      description: 'Food',
      createdAt: 3000000,
      updatedAt: 3000000,
    },
    {
      id: 'txn-4',
      amount: 300.00,
      timestamp: 4000000,
      type: 'transfer',
      fromAccount: 'acc-1',
      toAccount: 'acc-2',
      category: 'cat-transfer',
      description: 'Transfer',
      createdAt: 4000000,
      updatedAt: 4000000,
    },
  ];

  describe('type filtering', () => {
    it('should filter by expense type', () => {
      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions)
      );

      // Set filter criteria
      act(() => {
        result.current.setFilterCriteria({
          typeFilter: 'expense',
          sortBy: 'newest',
          selectedCategories: [],
        });
      });

      expect(result.current.filteredTransactions.length).toBe(2);
      expect(result.current.filteredTransactions.every(t => t.type === 'expense')).toBe(true);
    });

    it('should filter by income type', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: 'income',
        sortBy: 'newest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.filteredTransactions.length).toBe(1);
      expect(result.current.filteredTransactions[0].type).toBe('income');
    });

    it('should filter by transfer type', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: 'transfer',
        sortBy: 'newest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.filteredTransactions.length).toBe(1);
      expect(result.current.filteredTransactions[0].type).toBe('transfer');
    });

    it('should not filter when typeFilter is null', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'newest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.filteredTransactions.length).toBe(4);
    });
  });

  describe('category filtering', () => {
    it('should filter by single category', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'newest',
        selectedCategories: ['cat-shopping'],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.filteredTransactions.length).toBe(1);
      expect(result.current.filteredTransactions[0].category).toBe('cat-shopping');
    });

    it('should filter by multiple categories', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'newest',
        selectedCategories: ['cat-shopping', 'cat-food'],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.filteredTransactions.length).toBe(2);
      expect(result.current.filteredTransactions.every(t =>
        ['cat-shopping', 'cat-food'].includes(t.category)
      )).toBe(true);
    });

    it('should not filter when selectedCategories is empty', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'newest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.filteredTransactions.length).toBe(4);
    });
  });

  describe('sorting', () => {
    it('should sort by highest amount', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'highest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      const amounts = result.current.filteredTransactions.map(t => t.amount);
      expect(amounts).toEqual([300, 200, 100, 50]);
    });

    it('should sort by lowest amount', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'lowest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      const amounts = result.current.filteredTransactions.map(t => t.amount);
      expect(amounts).toEqual([50, 100, 200, 300]);
    });

    it('should sort by newest timestamp', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'newest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      const timestamps = result.current.filteredTransactions.map(t => t.timestamp);
      expect(timestamps).toEqual([4000000, 3000000, 2000000, 1000000]);
    });

    it('should sort by oldest timestamp', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'oldest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      const timestamps = result.current.filteredTransactions.map(t => t.timestamp);
      expect(timestamps).toEqual([1000000, 2000000, 3000000, 4000000]);
    });
  });

  describe('combined filters', () => {
    it('should filter by type AND category', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: 'expense',
        sortBy: 'newest',
        selectedCategories: ['cat-shopping'],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.filteredTransactions.length).toBe(1);
      expect(result.current.filteredTransactions[0].id).toBe('txn-1');
    });

    it('should filter, sort, and return correct order', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: 'expense',
        sortBy: 'highest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.filteredTransactions.length).toBe(2);
      expect(result.current.filteredTransactions[0].amount).toBe(100);
      expect(result.current.filteredTransactions[1].amount).toBe(50);
    });
  });

  describe('active filter count', () => {
    it('should count 0 active filters for default state', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'newest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.activeFilterCount).toBe(0);
    });

    it('should count 1 active filter when type is selected', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: 'expense',
        sortBy: 'newest',
        selectedCategories: [],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.activeFilterCount).toBe(1);
    });

    it('should count categories as active filters', () => {
      const filterCriteria: FilterCriteria = {
        typeFilter: null,
        sortBy: 'newest',
        selectedCategories: ['cat-shopping', 'cat-food'],
      };

      const { result } = renderHook(() =>
        useTransactionFilter(mockTransactions, filterCriteria)
      );

      expect(result.current.activeFilterCount).toBeGreaterThan(0);
    });
  });

  describe('performance', () => {
    it('should handle large transaction lists efficiently', () => {
      // Generate 1000 transactions
      const largeTransactionList: Transaction[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `txn-${i}`,
        amount: Math.random() * 1000,
        timestamp: Date.now() - i * 1000,
        type: ['income', 'expense', 'transfer'][i % 3] as any,
        fromAccount: 'acc-1',
        toAccount: 'acc-2',
        category: `cat-${i % 10}`,
        description: `Transaction ${i}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));

      const filterCriteria: FilterCriteria = {
        typeFilter: 'expense',
        sortBy: 'highest',
        selectedCategories: [],
      };

      const startTime = Date.now();
      
      const { result } = renderHook(() =>
        useTransactionFilter(largeTransactionList, filterCriteria)
      );

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should complete in less than 500ms (performance requirement)
      expect(executionTime).toBeLessThan(500);
      expect(result.current.filteredTransactions.length).toBeGreaterThan(0);
    });
  });
});

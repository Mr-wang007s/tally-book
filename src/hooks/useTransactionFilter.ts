/**
 * useTransactionFilter Hook
 * 
 * Provides transaction filtering and sorting with useMemo optimization
 * 
 * @module useTransactionFilter
 */

import { useState, useMemo, useCallback } from 'react';
import type {
  Transaction,
  FilterCriteria,
  UseTransactionFilterResult,
  DEFAULT_FILTER_CRITERIA,
} from '@/types/transaction';

const defaultCriteria: FilterCriteria = {
  typeFilter: null,
  sortBy: 'newest',
  selectedCategories: [],
};

export function useTransactionFilter(
  transactions: Transaction[]
): UseTransactionFilterResult {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(defaultCriteria);

  // Filtered and sorted transactions with useMemo optimization
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filterCriteria.typeFilter) {
      result = result.filter((t) => t.type === filterCriteria.typeFilter);
    }

    // Filter by categories
    if (filterCriteria.selectedCategories.length > 0) {
      result = result.filter((t) =>
        filterCriteria.selectedCategories.includes(t.category)
      );
    }

    // Sort
    switch (filterCriteria.sortBy) {
      case 'highest':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        result.sort((a, b) => a.amount - b.amount);
        break;
      case 'newest':
        result.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'oldest':
        result.sort((a, b) => a.timestamp - b.timestamp);
        break;
    }

    return result;
  }, [transactions, filterCriteria]);

  // Reset filter to default
  const resetFilter = useCallback(() => {
    setFilterCriteria(defaultCriteria);
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCriteria.typeFilter !== null) count++;
    if (filterCriteria.selectedCategories.length > 0) count++;
    if (filterCriteria.sortBy !== 'newest') count++; // Newest is default
    return count;
  }, [filterCriteria]);

  return {
    filteredTransactions,
    filterCriteria,
    setFilterCriteria,
    resetFilter,
    activeFilterCount,
  };
}

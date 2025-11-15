/**
 * useExpenses Hook
 * 支出记录管理 Hook，封装 expenseStore
 * 遵循 Constitution Principle II (Code Quality - Hooks 分离业务逻辑)
 */

import { useEffect } from 'react';
import { useExpenseStore } from '@/store/expenseStore';
import type { CreateExpenseDTO, UpdateExpenseDTO } from '@/types/expense';

/**
 * useExpenses Hook
 * 
 * @returns {Object} 支出记录状态和操作方法
 */
export function useExpenses() {
  const {
    expenses,
    isLoading,
    error,
    loadExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
  } = useExpenseStore();

  // 初始加载支出记录
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
  };
}

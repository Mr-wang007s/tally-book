/**
 * Expense Store (Zustand)
 * 支出记录状态管理
 */

import { create } from 'zustand';
import type { Expense, CreateExpenseDTO, UpdateExpenseDTO } from '@/types/expense';
import * as database from '@/services/database';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadExpenses: () => Promise<void>;
  addExpense: (dto: CreateExpenseDTO) => Promise<Expense>;
  updateExpense: (id: string, dto: UpdateExpenseDTO) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;
  refreshExpenses: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  isLoading: false,
  error: null,

  loadExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await database.getAllExpenses({ limit: 100 });
      set({ expenses, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load expenses',
        isLoading: false,
      });
    }
  },

  addExpense: async (dto: CreateExpenseDTO) => {
    set({ isLoading: true, error: null });
    try {
      const newExpense = await database.insertExpense(dto);
      set((state) => ({
        expenses: [newExpense, ...state.expenses],
        isLoading: false,
      }));
      return newExpense;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add expense',
        isLoading: false,
      });
      throw error;
    }
  },

  updateExpense: async (id: string, dto: UpdateExpenseDTO) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await database.updateExpense(id, dto);
      set((state) => ({
        expenses: state.expenses.map((exp) => (exp.id === id ? updated : exp)),
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update expense',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteExpense: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await database.deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete expense',
        isLoading: false,
      });
      throw error;
    }
  },

  refreshExpenses: async () => {
    await get().loadExpenses();
  },
}));

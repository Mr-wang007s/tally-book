/**
 * Category Store (Zustand)
 * 类别状态管理
 */

import { create } from 'zustand';
import type { Category } from '@/types/category';
import * as database from '@/services/database';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  refreshCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await database.getAllCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load categories',
        isLoading: false,
      });
    }
  },

  getCategoryById: (id: string) => {
    return get().categories.find((cat) => cat.id === id);
  },

  refreshCategories: async () => {
    await get().loadCategories();
  },
}));

/**
 * useCategories Hook
 * 类别管理 Hook，封装 categoryStore
 */

import { useEffect } from 'react';
import { useCategoryStore } from '@/store/categoryStore';

/**
 * useCategories Hook
 * 
 * @returns {Object} 类别列表和操作方法
 */
export function useCategories() {
  const {
    categories,
    isLoading,
    error,
    loadCategories,
    getCategoryById,
    refreshCategories,
  } = useCategoryStore();

  // 初始加载类别
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    error,
    getCategoryById,
    refreshCategories,
  };
}

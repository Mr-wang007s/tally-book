/**
 * Web Storage Service
 * Web 平台的内存存储服务（替代 SQLite）
 */

import type { Expense, CreateExpenseDTO, UpdateExpenseDTO, ExpenseQueryParams } from '@/types/expense';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/types/category';
import { DEFAULT_CATEGORIES, CategoryType } from '@/types/category';

// 内存存储
let expenses: Expense[] = [];
let categories: Category[] = [];

/**
 * 生成 UUID
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 初始化 Web 存储
 */
export async function initWebStorage(): Promise<void> {
  // 加载 localStorage 中的数据
  const savedExpenses = localStorage.getItem('expenses');
  const savedCategories = localStorage.getItem('categories');
  
  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
  }
  
  if (savedCategories) {
    categories = JSON.parse(savedCategories);
  } else {
    // 初始化默认类别
    categories = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    }));
    localStorage.setItem('categories', JSON.stringify(categories));
  }
}

/**
 * 保存到 localStorage
 */
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('categories', JSON.stringify(categories));
}

// ============ Expense CRUD ============

export async function createExpense(dto: CreateExpenseDTO): Promise<Expense> {
  const now = new Date().toISOString();
  const expense: Expense = {
    id: generateUUID(),
    amount: dto.amount,
    categoryId: dto.categoryId,
    note: dto.note || '',
    date: dto.date || now.split('T')[0],
    inputMethod: dto.inputMethod,
    photoPath: dto.photoPath,
    recognizedText: dto.recognizedText,
    createdAt: now,
    updatedAt: now,
  };
  
  expenses.push(expense);
  saveToLocalStorage();
  return expense;
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  return expenses.find((e) => e.id === id) || null;
}

export async function queryExpenses(params: ExpenseQueryParams = {}): Promise<Expense[]> {
  let result = [...expenses];
  
  // 日期范围筛选
  if (params.startDate) {
    result = result.filter((e) => e.date >= params.startDate!);
  }
  if (params.endDate) {
    result = result.filter((e) => e.date <= params.endDate!);
  }
  
  // 类别筛选
  if (params.categoryId) {
    result = result.filter((e) => e.categoryId === params.categoryId);
  }
  
  // 金额范围筛选
  if (params.minAmount !== undefined) {
    result = result.filter((e) => e.amount >= params.minAmount!);
  }
  if (params.maxAmount !== undefined) {
    result = result.filter((e) => e.amount <= params.maxAmount!);
  }
  
  // 按日期降序排序
  result.sort((a, b) => b.date.localeCompare(a.date));
  
  // 分页
  if (params.offset !== undefined) {
    result = result.slice(params.offset);
  }
  if (params.limit !== undefined) {
    result = result.slice(0, params.limit);
  }
  
  return result;
}

export async function updateExpense(id: string, dto: UpdateExpenseDTO): Promise<void> {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error('Expense not found');
  }
  
  expenses[index] = {
    ...expenses[index],
    ...dto,
    updatedAt: new Date().toISOString(),
  };
  
  saveToLocalStorage();
}

export async function deleteExpense(id: string): Promise<void> {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error('Expense not found');
  }
  
  expenses.splice(index, 1);
  saveToLocalStorage();
}

export async function deleteExpensesByDateRange(startDate: string, endDate: string): Promise<number> {
  const initialLength = expenses.length;
  expenses = expenses.filter((e) => e.date < startDate || e.date > endDate);
  const deletedCount = initialLength - expenses.length;
  
  if (deletedCount > 0) {
    saveToLocalStorage();
  }
  
  return deletedCount;
}

// ============ Category CRUD ============

export async function createCategory(dto: CreateCategoryDTO): Promise<Category> {
  const now = new Date().toISOString();
  const category: Category = {
    id: generateUUID(),
    name: dto.name,
    icon: dto.icon,
    color: dto.color,
    type: CategoryType.CUSTOM,
    budget: dto.budget,
    sortOrder: dto.sortOrder || categories.length + 1,
    isActive: true,
    createdAt: now,
  };
  
  categories.push(category);
  saveToLocalStorage();
  return category;
}

export async function getAllCategories(): Promise<Category[]> {
  return categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return categories.find((c) => c.id === id) || null;
}

export async function updateCategory(id: string, dto: UpdateCategoryDTO): Promise<void> {
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  
  categories[index] = {
    ...categories[index],
    ...dto,
  };
  
  saveToLocalStorage();
}

export async function deleteCategory(id: string): Promise<void> {
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  
  // 检查是否有关联的支出
  const hasExpenses = expenses.some((e) => e.categoryId === id);
  if (hasExpenses) {
    throw new Error('Cannot delete category with existing expenses');
  }
  
  categories.splice(index, 1);
  saveToLocalStorage();
}

/**
 * Database Service
 * SQLite 数据库操作服务 (支持 Web 平台降级)
 * 遵循 Constitution Principle V (Performance - 查询优化, 索引)
 */

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import type { Expense, CreateExpenseDTO, UpdateExpenseDTO, ExpenseQueryParams } from '@/types/expense';
import type { Category } from '@/types/category';
import { DEFAULT_CATEGORIES, CategoryType } from '@/types/category';
import * as WebStorage from './webStorage';

const DB_NAME = 'tallybook.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * 检查是否支持 SQLite
 */
function isSQLiteSupported(): boolean {
  return Platform.OS !== 'web';
}

/**
 * 初始化数据库并创建表
 */
export async function initDatabase(): Promise<void> {
  // Web 平台使用 webStorage
  if (!isSQLiteSupported()) {
    console.warn('SQLite is not supported on web platform. Using localStorage.');
    await WebStorage.initWebStorage();
    return;
  }
  
  db = await SQLite.openDatabaseAsync(DB_NAME);

  // 创建 expenses 表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL NOT NULL CHECK(amount >= 0.01 AND amount <= 1000000),
      categoryId TEXT NOT NULL,
      note TEXT DEFAULT '',
      date TEXT NOT NULL,
      inputMethod TEXT NOT NULL,
      photoPath TEXT,
      recognizedText TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
    CREATE INDEX IF NOT EXISTS idx_expenses_categoryId ON expenses(categoryId);
    CREATE INDEX IF NOT EXISTS idx_expenses_amount ON expenses(amount);
  `);

  // 创建 categories 表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL,
      budget REAL,
      sortOrder INTEGER NOT NULL,
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_categories_sortOrder ON categories(sortOrder);
  `);

  // 插入默认类别 (如果不存在)
  await insertDefaultCategories();
}

/**
 * 插入默认类别
 */
async function insertDefaultCategories(): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  const count = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM categories');
  
  if (count && count.count === 0) {
    for (const category of DEFAULT_CATEGORIES) {
      const id = generateUUID();
      const now = new Date().toISOString();
      
      await db.runAsync(
        `INSERT INTO categories (id, name, icon, color, type, budget, sortOrder, isActive, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, category.name, category.icon, category.color, category.type, category.budget || null, 
         category.sortOrder, category.isActive ? 1 : 0, now]
      );
    }
  }
}

// ============= Expense CRUD Operations =============

/**
 * 插入新支出记录
 */
export async function insertExpense(dto: CreateExpenseDTO): Promise<Expense> {
  // Web 平台使用 webStorage
  if (!isSQLiteSupported()) {
    return await WebStorage.createExpense(dto);
  }
  
  if (!db) throw new Error('Database not initialized');

  const id = generateUUID();
  const now = new Date().toISOString();
  const date = dto.date || now;

  await db.runAsync(
    `INSERT INTO expenses (id, amount, categoryId, note, date, inputMethod, photoPath, recognizedText, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, dto.amount, dto.categoryId, dto.note || '', date, dto.inputMethod, 
     dto.photoPath || null, dto.recognizedText || null, now, now]
  );

  const expense = await db.getFirstAsync<Expense>(
    'SELECT * FROM expenses WHERE id = ?',
    [id]
  );

  if (!expense) throw new Error('Failed to create expense');
  return expense;
}

/**
 * 更新支出记录
 */
export async function updateExpense(id: string, dto: UpdateExpenseDTO): Promise<Expense> {
  // Web 平台使用 webStorage
  if (!isSQLiteSupported()) {
    await WebStorage.updateExpense(id, dto);
    const expense = await WebStorage.getExpenseById(id);
    if (!expense) throw new Error('Expense not found');
    return expense;
  }
  
  if (!db) throw new Error('Database not initialized');

  const updates: string[] = [];
  const values: any[] = [];

  if (dto.amount !== undefined) {
    updates.push('amount = ?');
    values.push(dto.amount);
  }
  if (dto.categoryId !== undefined) {
    updates.push('categoryId = ?');
    values.push(dto.categoryId);
  }
  if (dto.note !== undefined) {
    updates.push('note = ?');
    values.push(dto.note);
  }
  if (dto.date !== undefined) {
    updates.push('date = ?');
    values.push(dto.date);
  }

  updates.push('updatedAt = ?');
  values.push(new Date().toISOString());
  values.push(id);

  await db.runAsync(
    `UPDATE expenses SET ${updates.join(', ')} WHERE id = ?`,
    values
  );

  const expense = await db.getFirstAsync<Expense>(
    'SELECT * FROM expenses WHERE id = ?',
    [id]
  );

  if (!expense) throw new Error('Expense not found');
  return expense;
}

/**
 * 删除支出记录
 */
export async function deleteExpense(id: string): Promise<void> {
  // Web 平台使用 webStorage
  if (!isSQLiteSupported()) {
    await WebStorage.deleteExpense(id);
    return;
  }
  
  if (!db) throw new Error('Database not initialized');
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}

/**
 * 根据ID获取支出记录
 */
export async function getExpenseById(id: string): Promise<Expense | null> {
  // Web 平台使用 webStorage
  if (!isSQLiteSupported()) {
    return await WebStorage.getExpenseById(id);
  }
  
  if (!db) throw new Error('Database not initialized');
  return await db.getFirstAsync<Expense>('SELECT * FROM expenses WHERE id = ?', [id]);
}

/**
 * 获取所有支出记录 (分页)
 */
export async function getAllExpenses(params?: ExpenseQueryParams): Promise<Expense[]> {
  // Web 平台使用 webStorage
  if (!isSQLiteSupported()) {
    return await WebStorage.queryExpenses(params);
  }
  
  if (!db) throw new Error('Database not initialized');

  let query = 'SELECT * FROM expenses WHERE 1=1';
  const queryParams: any[] = [];

  if (params?.startDate) {
    query += ' AND date >= ?';
    queryParams.push(params.startDate);
  }
  if (params?.endDate) {
    query += ' AND date <= ?';
    queryParams.push(params.endDate);
  }
  if (params?.categoryId) {
    query += ' AND categoryId = ?';
    queryParams.push(params.categoryId);
  }
  if (params?.minAmount !== undefined) {
    query += ' AND amount >= ?';
    queryParams.push(params.minAmount);
  }
  if (params?.maxAmount !== undefined) {
    query += ' AND amount <= ?';
    queryParams.push(params.maxAmount);
  }

  query += ' ORDER BY date DESC';

  if (params?.limit) {
    query += ' LIMIT ?';
    queryParams.push(params.limit);
  }
  if (params?.offset) {
    query += ' OFFSET ?';
    queryParams.push(params.offset);
  }

  return await db.getAllAsync<Expense>(query, queryParams);
}

/**
 * 根据日期范围获取支出记录
 */
export async function getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
  return getAllExpenses({ startDate, endDate });
}

// ============= Category Operations =============

/**
 * 获取所有类别
 */
export async function getAllCategories(): Promise<Category[]> {
  // Web 平台使用 webStorage
  if (!isSQLiteSupported()) {
    return await WebStorage.getAllCategories();
  }
  
  if (!db) throw new Error('Database not initialized');
  return await db.getAllAsync<Category>(
    'SELECT * FROM categories WHERE isActive = 1 ORDER BY sortOrder ASC'
  );
}

/**
 * 根据ID获取类别
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  // Web 平台使用 webStorage
  if (!isSQLiteSupported()) {
    return await WebStorage.getCategoryById(id);
  }
  
  if (!db) throw new Error('Database not initialized');
  return await db.getFirstAsync<Category>('SELECT * FROM categories WHERE id = ?', [id]);
}

// ============= Helper Functions =============

/**
 * 生成 UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 关闭数据库连接
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

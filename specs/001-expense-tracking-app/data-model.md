# Data Model: 家庭支出统计应用

**Feature**: 家庭支出统计应用  
**Date**: 2025-11-15  
**Status**: Completed  
**Storage**: SQLite (expo-sqlite) + AsyncStorage  
**Source**: Extracted from [spec.md](./spec.md) Requirements and User Stories

---

## Entity Relationship Diagram

```text
┌─────────────────────┐         ┌─────────────────────┐
│     Category        │         │      Expense        │
├─────────────────────┤         ├─────────────────────┤
│ id: string (PK)     │◄───────┤│ id: string (PK)     │
│ name: string        │   1:N   │ amount: number      │
│ icon: string        │         │ categoryId: string  │
│ color: string       │         │ timestamp: number   │
│ isDefault: boolean  │         │ inputMethod: enum   │
│ monthlyBudget: num? │         │ note?: string       │
│ createdAt: number   │         │ photoUri?: string   │
│ updatedAt: number   │         │ merchant?: string   │
└─────────────────────┘         │ rawText?: string    │
                                │ confidence?: number │
                                │ createdAt: number   │
       ┌─────────────┐          │ updatedAt: number   │
       │   Settings  │          └─────────────────────┘
       ├─────────────┤
       │ key: string │          ┌─────────────────────┐
       │ value: any  │          │   OfflineTask       │
       └─────────────┘          ├─────────────────────┤
                                │ id: string (PK)     │
                                │ type: enum          │
                                │ status: enum        │
                                │ data: JSON          │
                                │ createdAt: number   │
                                │ retryCount: number  │
                                └─────────────────────┘
```

---

## 1. Expense (支出记录)

**Description**: 代表一次支出事件，包含金额、类别、时间和可选的附加信息（照片、备注等）。

**Storage**: SQLite 表 `expenses`

### Schema

| Field | Type | Nullable | Description | Validation Rules | Source |
|-------|------|----------|-------------|-----------------|--------|
| `id` | `string` | No | 唯一标识符 (UUID) | 必须唯一 | - |
| `amount` | `number` | No | 支出金额（单位：元） | 0.01 ~ 1,000,000<br/>小数点后最多2位 | FR-010 |
| `categoryId` | `string` | No | 所属类别 ID (外键) | 必须存在于 `categories` 表 | FR-004 |
| `timestamp` | `number` | No | 支出时间戳 (Unix ms) | 不能晚于当前时间 | FR-020 |
| `inputMethod` | `enum` | No | 创建方式 | 'keyboard' \| 'voice' \| 'photo' | US1-3 |
| `note` | `string` | Yes | 用户备注 | 最大长度 200 字符 | FR-020 |
| `photoUri` | `string` | Yes | 照片附件本地路径 | 有效的文件系统路径 | FR-019 |
| `merchant` | `string` | Yes | 商家名称（OCR 识别） | 最大长度 100 字符 | FR-003 |
| `rawText` | `string` | Yes | 原始识别文本（语音/OCR） | 最大长度 500 字符 | FR-009 |
| `confidence` | `number` | Yes | 识别置信度 (0-1) | 0 ~ 1 | FR-009 |
| `createdAt` | `number` | No | 记录创建时间 (Unix ms) | 自动生成 | - |
| `updatedAt` | `number` | No | 记录更新时间 (Unix ms) | 自动更新 | - |

### TypeScript Type Definition

```typescript
// src/types/expense.ts

export enum InputMethod {
  KEYBOARD = 'keyboard',
  VOICE = 'voice',
  PHOTO = 'photo',
}

export interface Expense {
  id: string;                        // UUID
  amount: number;                    // 金额（元）
  categoryId: string;                // 类别 ID
  timestamp: number;                 // 支出时间戳
  inputMethod: InputMethod;          // 输入方式
  note?: string;                     // 备注
  photoUri?: string;                 // 照片路径
  merchant?: string;                 // 商家名称
  rawText?: string;                  // 原始识别文本
  confidence?: number;               // 识别置信度
  createdAt: number;                 // 创建时间
  updatedAt: number;                 // 更新时间
}

export interface CreateExpenseDTO {
  amount: number;
  categoryId: string;
  timestamp?: number;                // 默认为当前时间
  inputMethod: InputMethod;
  note?: string;
  photoUri?: string;
  merchant?: string;
  rawText?: string;
  confidence?: number;
}

export interface UpdateExpenseDTO {
  amount?: number;
  categoryId?: string;
  timestamp?: number;
  note?: string;
}
```

### SQLite Schema

```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL CHECK(amount >= 0.01 AND amount <= 1000000),
  category_id TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  input_method TEXT NOT NULL CHECK(input_method IN ('keyboard', 'voice', 'photo')),
  note TEXT,
  photo_uri TEXT,
  merchant TEXT,
  raw_text TEXT,
  confidence REAL CHECK(confidence >= 0 AND confidence <= 1),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 索引优化查询性能
CREATE INDEX idx_expenses_timestamp ON expenses(timestamp DESC);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);
```

### Business Rules

1. **金额验证** (FR-010):
   - 必须为正数
   - 范围: 0.01 ~ 1,000,000 元
   - 小数点后最多 2 位（分）
   - 异常大额（≥10,000）需用户二次确认

2. **类别关联** (FR-004):
   - `categoryId` 必须存在于 `categories` 表
   - 删除类别时，相关支出记录的 `categoryId` 更新为 "其他" 类别

3. **时间戳验证**:
   - 不能晚于当前时间
   - 默认使用设备当前时区

4. **照片存储** (FR-019):
   - 压缩后 <1MB
   - 存储路径: `${FileSystem.documentDirectory}photos/${expenseId}.jpg`

### State Transitions

```text
[New] ──create──> [Saved]
  │                   │
  └──validation fail──┘
  
[Saved] ──update──> [Saved]
[Saved] ──delete──> [Deleted]

// 识别状态（仅 voice/photo 输入）
[Pending Recognition] ──process──> [Recognized] ──confirm──> [Saved]
                           │                        │
                           └──────recognition fail──┘
```

---

## 2. Category (支出类别)

**Description**: 支出分类，包含系统默认类别和用户自定义类别。

**Storage**: SQLite 表 `categories` + AsyncStorage (缓存常用类别)

### Schema

| Field | Type | Nullable | Description | Validation Rules | Source |
|-------|------|----------|-------------|-----------------|--------|
| `id` | `string` | No | 唯一标识符 (UUID) | 必须唯一 | - |
| `name` | `string` | No | 类别名称 | 1-20 字符，唯一 | US5 |
| `icon` | `string` | No | 图标名称（@expo/vector-icons） | 有效的图标名 | FR-018 |
| `color` | `string` | No | 类别颜色（Hex） | 有效的 Hex 颜色 | - |
| `isDefault` | `boolean` | No | 是否为系统默认类别 | true \| false | US5 |
| `monthlyBudget` | `number` | Yes | 月度预算（元） | ≥0 | US5 |
| `createdAt` | `number` | No | 创建时间 | 自动生成 | - |
| `updatedAt` | `number` | No | 更新时间 | 自动更新 | - |

### TypeScript Type Definition

```typescript
// src/types/category.ts

export interface Category {
  id: string;
  name: string;                      // 类别名称
  icon: string;                      // @expo/vector-icons 图标名
  color: string;                     // Hex 颜色 (如 "#FF6B6B")
  isDefault: boolean;                // 是否为默认类别
  monthlyBudget?: number;            // 月度预算（元）
  createdAt: number;
  updatedAt: number;
}

export interface CreateCategoryDTO {
  name: string;
  icon: string;
  color: string;
  monthlyBudget?: number;
}

export interface UpdateCategoryDTO {
  name?: string;
  icon?: string;
  color?: string;
  monthlyBudget?: number;
}
```

### SQLite Schema

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE CHECK(LENGTH(name) >= 1 AND LENGTH(name) <= 20),
  icon TEXT NOT NULL,
  color TEXT NOT NULL CHECK(color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  is_default INTEGER NOT NULL DEFAULT 0,
  monthly_budget REAL CHECK(monthly_budget IS NULL OR monthly_budget >= 0),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_categories_is_default ON categories(is_default);
```

### Default Categories

系统预置 8 个默认类别（符合 FR-004 和假设 11）：

| ID | Name | Icon | Color | Budget |
|----|------|------|-------|--------|
| `cat_001` | 餐饮 | restaurant | #FF6B6B | null |
| `cat_002` | 交通 | car | #4ECDC4 | null |
| `cat_003` | 购物 | shopping-bag | #45B7D1 | null |
| `cat_004` | 娱乐 | movie | #FFA07A | null |
| `cat_005` | 医疗 | medical-bag | #98D8C8 | null |
| `cat_006` | 教育 | school | #F7DC6F | null |
| `cat_007` | 住房 | home | #BB8FCE | null |
| `cat_008` | 其他 | more-horizontal | #95A5A6 | null |

```typescript
// src/constants/categories.ts
export const DEFAULT_CATEGORIES: Omit<Category, 'createdAt' | 'updatedAt'>[] = [
  { id: 'cat_001', name: '餐饮', icon: 'restaurant', color: '#FF6B6B', isDefault: true },
  { id: 'cat_002', name: '交通', icon: 'car', color: '#4ECDC4', isDefault: true },
  // ... 其他默认类别
];
```

### Business Rules

1. **类别数量限制** (假设 11):
   - 系统默认类别: 8 个（不可删除）
   - 用户自定义类别: 最多 20 个
   - 总计最多 28 个类别

2. **删除规则** (US5-AS3):
   - 默认类别不可删除（`isDefault: true`）
   - 删除自定义类别时，检查是否有关联支出记录
   - 若有关联记录，显示提示并将记录归入 "其他" 类别

3. **预算提醒** (US5-AS4):
   - 当月类别支出 ≥ 预算的 80% 时，触发提醒通知

---

## 3. Statistics (统计数据) - Computed View

**Description**: 统计数据是通过计算得出的视图，不持久化存储，按需从 `expenses` 表查询计算。

### TypeScript Type Definition

```typescript
// src/types/statistics.ts

export enum TimeRange {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  count: number;
  percentage: number;              // 占总支出的百分比
}

export interface TrendDataPoint {
  date: string;                    // YYYY-MM-DD
  amount: number;
}

export interface Statistics {
  timeRange: TimeRange;
  startDate: number;               // Unix timestamp
  endDate: number;                 // Unix timestamp
  totalAmount: number;             // 总支出
  averageAmount: number;           // 平均支出
  maxDailyAmount: number;          // 最高单日支出
  count: number;                   // 记录数量
  categoryBreakdown: CategoryBreakdown[];  // 分类汇总
  trendData: TrendDataPoint[];     // 趋势数据
}

export interface StatisticsQuery {
  timeRange: TimeRange;
  customStartDate?: number;
  customEndDate?: number;
}
```

### Calculation Logic

```typescript
// src/hooks/useStatistics.ts
export function useStatistics(query: StatisticsQuery): Statistics {
  const { expenses } = useExpenseStore();
  
  // 1. 过滤时间范围内的支出
  const filteredExpenses = expenses.filter(e => 
    e.timestamp >= query.startDate && e.timestamp <= query.endDate
  );
  
  // 2. 计算总额和平均值
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const averageAmount = totalAmount / filteredExpenses.length || 0;
  
  // 3. 计算分类汇总
  const categoryBreakdown = calculateCategoryBreakdown(filteredExpenses);
  
  // 4. 计算趋势数据
  const trendData = calculateTrendData(filteredExpenses, query.timeRange);
  
  return { totalAmount, averageAmount, categoryBreakdown, trendData, ... };
}
```

### SQL Queries for Statistics

```sql
-- 查询某时间范围的总支出
SELECT SUM(amount) as total, COUNT(*) as count, AVG(amount) as average
FROM expenses
WHERE timestamp BETWEEN ? AND ?;

-- 查询分类汇总
SELECT 
  category_id,
  SUM(amount) as total,
  COUNT(*) as count
FROM expenses
WHERE timestamp BETWEEN ? AND ?
GROUP BY category_id
ORDER BY total DESC;

-- 查询每日趋势（用于折线图）
SELECT 
  DATE(timestamp / 1000, 'unixepoch') as date,
  SUM(amount) as amount
FROM expenses
WHERE timestamp BETWEEN ? AND ?
GROUP BY date
ORDER BY date ASC;
```

---

## 4. OfflineTask (离线任务队列)

**Description**: 存储离线时无法处理的识别任务（语音/OCR），网络恢复后自动处理。

**Storage**: AsyncStorage (键: `offline_queue`)

### Schema

| Field | Type | Nullable | Description | Validation Rules | Source |
|-------|------|----------|-------------|-----------------|--------|
| `id` | `string` | No | 任务 ID (UUID) | 必须唯一 | - |
| `type` | `enum` | No | 任务类型 | 'ocr' \| 'voice' | Research |
| `status` | `enum` | No | 任务状态 | 'pending' \| 'processing' \| 'failed' | - |
| `data` | `object` | No | 任务数据（JSON） | 包含 uri、expenseId 等 | - |
| `createdAt` | `number` | No | 创建时间 | 自动生成 | - |
| `retryCount` | `number` | No | 重试次数 | 0 ~ 3 | - |

### TypeScript Type Definition

```typescript
// src/types/offlineTask.ts

export enum TaskType {
  OCR = 'ocr',
  VOICE = 'voice',
}

export enum TaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

export interface OfflineTaskData {
  uri: string;                     // 照片/语音文件路径
  expenseId?: string;              // 关联的支出 ID（如已创建）
}

export interface OfflineTask {
  id: string;
  type: TaskType;
  status: TaskStatus;
  data: OfflineTaskData;
  createdAt: number;
  retryCount: number;
}
```

### Business Rules

1. **重试机制**:
   - 失败任务最多重试 3 次
   - 重试间隔: 5 秒、30 秒、5 分钟

2. **自动清理**:
   - 成功处理的任务立即删除
   - 失败超过 3 次的任务保留 7 天后自动删除

3. **用户管理**:
   - 用户可在设置页面查看待处理任务
   - 用户可手动重试或删除失败任务

---

## 5. Settings (应用设置)

**Description**: 存储应用配置和用户偏好。

**Storage**: AsyncStorage (键值对)

### Settings Keys

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |
| `language` | `'zh-CN'` | `'zh-CN'` | 界面语言 |
| `defaultCategoryId` | `string` | `null` | 默认类别（快速输入） |
| `enableVoice` | `boolean` | `true` | 启用语音输入 |
| `enableOCR` | `boolean` | `true` | 启用拍照识别 |
| `dataBackupDate` | `number` | `null` | 上次备份时间 |
| `notificationsEnabled` | `boolean` | `true` | 预算提醒通知 |

### TypeScript Type Definition

```typescript
// src/types/settings.ts

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN';
  defaultCategoryId: string | null;
  enableVoice: boolean;
  enableOCR: boolean;
  dataBackupDate: number | null;
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  language: 'zh-CN',
  defaultCategoryId: null,
  enableVoice: true,
  enableOCR: true,
  dataBackupDate: null,
  notificationsEnabled: true,
};
```

---

## Data Validation Summary

| Entity | Validation Rules | Error Codes |
|--------|-----------------|-------------|
| **Expense** | amount: 0.01-1000000<br/>categoryId: exists<br/>timestamp: ≤now | `INVALID_AMOUNT`<br/>`CATEGORY_NOT_FOUND`<br/>`FUTURE_DATE` |
| **Category** | name: unique, 1-20 chars<br/>color: valid hex<br/>total count: ≤28 | `DUPLICATE_NAME`<br/>`INVALID_COLOR`<br/>`MAX_CATEGORIES` |
| **OfflineTask** | retryCount: ≤3 | `MAX_RETRIES` |

---

## Migration Strategy

### Initial Database Setup

```typescript
// src/services/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('tally-book.db');

export async function initDatabase() {
  db.transaction(tx => {
    // 创建 categories 表
    tx.executeSql(CREATE_CATEGORIES_TABLE);
    
    // 创建 expenses 表
    tx.executeSql(CREATE_EXPENSES_TABLE);
    
    // 插入默认类别
    DEFAULT_CATEGORIES.forEach(cat => {
      tx.executeSql(INSERT_CATEGORY_SQL, [cat.id, cat.name, cat.icon, cat.color, ...]);
    });
  });
}
```

### Future Schema Versions

使用 SQLite 的 `PRAGMA user_version` 管理迁移：

```typescript
export async function migrateDatabase(currentVersion: number, targetVersion: number) {
  if (currentVersion < 2) {
    // Migration v1 -> v2: 添加 merchant 字段
    db.executeSql('ALTER TABLE expenses ADD COLUMN merchant TEXT');
  }
  // ... 更多迁移逻辑
}
```

---

**Next Step**: 生成 API 合约文档（contracts/）和 quickstart.md。

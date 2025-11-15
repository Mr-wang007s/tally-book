# Hooks API Contract

**Feature**: 家庭支出统计应用  
**Date**: 2025-11-15  
**Purpose**: 定义所有自定义 React Hooks 的接口契约，确保业务逻辑层与 UI 层的解耦

---

## 1. useExpenses - 支出记录管理

**Location**: `src/hooks/useExpenses.ts`  
**Purpose**: 提供支出记录的 CRUD 操作和查询功能

### Interface

```typescript
interface UseExpensesReturn {
  // State
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addExpense: (expense: CreateExpenseDTO) => Promise<Expense>;
  updateExpense: (id: string, data: UpdateExpenseDTO) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getExpenseById: (id: string) => Expense | undefined;
  getExpensesByDateRange: (start: number, end: number) => Expense[];
  getExpensesByCategory: (categoryId: string) => Expense[];
  
  // Utilities
  refreshExpenses: () => Promise<void>;
}

export function useExpenses(): UseExpensesReturn;
```

### Usage Example

```typescript
const {
  expenses,
  addExpense,
  updateExpense,
  deleteExpense,
  loading,
  error
} = useExpenses();

// 添加支出记录
await addExpense({
  amount: 50.5,
  categoryId: 'cat_001',
  inputMethod: InputMethod.KEYBOARD,
  note: '午餐',
});

// 更新支出记录
await updateExpense('expense_123', {
  amount: 55.0,
  note: '午餐（含饮料）',
});

// 删除支出记录
await deleteExpense('expense_123');

// 查询某日期范围的支出
const monthlyExpenses = getExpensesByDateRange(
  startOfMonth.getTime(),
  endOfMonth.getTime()
);
```

### Validation Rules

- `addExpense`: 
  - 金额必须在 0.01 ~ 1,000,000 范围内
  - categoryId 必须存在
  - 异常大额（≥10,000）触发确认对话框
  
- `updateExpense`:
  - ID 必须存在
  - 更新字段遵循 CreateExpenseDTO 验证规则

- `deleteExpense`:
  - ID 必须存在
  - 删除操作不可撤销（需用户确认）

### Error Handling

```typescript
try {
  await addExpense(data);
} catch (error) {
  if (error.code === 'INVALID_AMOUNT') {
    // 显示错误提示：金额无效
  } else if (error.code === 'CATEGORY_NOT_FOUND') {
    // 显示错误提示：类别不存在
  }
}
```

### Performance Considerations

- `expenses` 数组默认按 `timestamp` 降序排列
- 使用 `useMemo` 缓存过滤结果
- 大量数据时（>1000 条）使用虚拟化列表

---

## 2. useCategories - 类别管理

**Location**: `src/hooks/useCategories.ts`  
**Purpose**: 提供类别的 CRUD 操作和查询功能

### Interface

```typescript
interface UseCategoriesReturn {
  // State
  categories: Category[];
  defaultCategories: Category[];
  customCategories: Category[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addCategory: (category: CreateCategoryDTO) => Promise<Category>;
  updateCategory: (id: string, data: UpdateCategoryDTO) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  
  // Utilities
  canAddMoreCategories: () => boolean;  // 检查是否达到上限
  getCategoryUsageCount: (id: string) => number;  // 查询类别使用次数
}

export function useCategories(): UseCategoriesReturn;
```

### Usage Example

```typescript
const {
  categories,
  customCategories,
  addCategory,
  deleteCategory,
  canAddMoreCategories,
  getCategoryUsageCount
} = useCategories();

// 添加自定义类别
if (canAddMoreCategories()) {
  await addCategory({
    name: '宠物',
    icon: 'paw',
    color: '#FFB6C1',
    monthlyBudget: 500,
  });
}

// 删除类别（检查使用次数）
const usageCount = getCategoryUsageCount('cat_custom_01');
if (usageCount > 0) {
  // 显示确认对话框：该类别下有 X 条记录，将归入"其他"类别
  const confirmed = await showConfirmDialog();
  if (confirmed) {
    await deleteCategory('cat_custom_01');
  }
} else {
  await deleteCategory('cat_custom_01');
}
```

### Validation Rules

- `addCategory`:
  - 类别名称必须唯一
  - 长度 1-20 字符
  - 自定义类别总数 ≤20
  - 颜色必须为有效 Hex 格式

- `deleteCategory`:
  - 默认类别（`isDefault: true`）不可删除
  - 删除前检查关联支出，提示用户确认

### Error Handling

```typescript
try {
  await addCategory(data);
} catch (error) {
  if (error.code === 'DUPLICATE_NAME') {
    // 类别名称已存在
  } else if (error.code === 'MAX_CATEGORIES') {
    // 已达到最大类别数量（28）
  } else if (error.code === 'INVALID_COLOR') {
    // 颜色格式无效
  }
}
```

---

## 3. useStatistics - 统计数据计算

**Location**: `src/hooks/useStatistics.ts`  
**Purpose**: 计算和提供各种统计数据（总额、平均值、趋势、分类占比）

### Interface

```typescript
interface UseStatisticsParams {
  timeRange: TimeRange;
  customStartDate?: number;
  customEndDate?: number;
}

interface UseStatisticsReturn {
  // Computed Data
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshStatistics: () => Promise<void>;
  
  // Utilities
  getTotalByCategory: (categoryId: string) => number;
  getTopCategories: (limit: number) => CategoryBreakdown[];
  compareWithPreviousPeriod: () => { current: number; previous: number; change: number };
}

export function useStatistics(params: UseStatisticsParams): UseStatisticsReturn;
```

### Usage Example

```typescript
// 查询本月统计
const { statistics, loading } = useStatistics({
  timeRange: TimeRange.MONTH,
});

if (statistics) {
  console.log('本月总支出:', statistics.totalAmount);
  console.log('平均每日:', statistics.averageAmount);
  console.log('分类占比:', statistics.categoryBreakdown);
}

// 查询自定义时间范围
const { statistics: customStats } = useStatistics({
  timeRange: TimeRange.MONTH,
  customStartDate: new Date('2025-01-01').getTime(),
  customEndDate: new Date('2025-01-31').getTime(),
});

// 对比上月
const { current, previous, change } = compareWithPreviousPeriod();
// change = (current - previous) / previous * 100
```

### Calculation Logic

```typescript
// 分类汇总计算
categoryBreakdown = expenses
  .filter(e => inDateRange(e.timestamp))
  .reduce((acc, e) => {
    const cat = acc.find(c => c.categoryId === e.categoryId);
    if (cat) {
      cat.totalAmount += e.amount;
      cat.count += 1;
    } else {
      acc.push({
        categoryId: e.categoryId,
        totalAmount: e.amount,
        count: 1,
      });
    }
    return acc;
  }, [])
  .map(cat => ({
    ...cat,
    percentage: (cat.totalAmount / totalAmount) * 100,
  }))
  .sort((a, b) => b.totalAmount - a.totalAmount);
```

### Performance Considerations

- 使用 `useMemo` 缓存计算结果
- 大数据量（>1000 条）时使用 Web Worker 计算（如果可用）
- 目标计算时间 <500ms

---

## 4. useVoiceRecognition - 语音识别

**Location**: `src/hooks/useVoiceRecognition.ts`  
**Purpose**: 封装语音识别功能（Expo Speech API）

### Interface

```typescript
interface UseVoiceRecognitionReturn {
  // State
  isRecording: boolean;
  isProcessing: boolean;
  recognizedText: string | null;
  error: string | null;
  
  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  clearResult: () => void;
  
  // Utilities
  extractExpenseInfo: () => { amount: number | null; category: string | null };
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn;
```

### Usage Example

```typescript
const {
  isRecording,
  recognizedText,
  startRecording,
  stopRecording,
  extractExpenseInfo,
  error
} = useVoiceRecognition();

// 开始录音
await startRecording();

// 停止录音（自动触发识别）
await stopRecording();

// 提取金额和类别
const { amount, category } = extractExpenseInfo();
if (amount) {
  await addExpense({
    amount,
    categoryId: findCategoryByName(category) || 'cat_008', // 默认"其他"
    inputMethod: InputMethod.VOICE,
    rawText: recognizedText,
  });
}
```

### Error Handling

```typescript
if (error) {
  // 错误类型：
  // - PERMISSION_DENIED: 用户拒绝麦克风权限
  // - RECOGNITION_FAILED: 识别失败（网络或服务问题）
  // - TIMEOUT: 识别超时（>30 秒无响应）
}
```

### Permission Handling

```typescript
// 自动请求麦克风权限
const { status } = await Audio.requestPermissionsAsync();
if (status !== 'granted') {
  throw new Error('PERMISSION_DENIED');
}
```

---

## 5. useOCR - 拍照识别

**Location**: `src/hooks/useOCR.ts`  
**Purpose**: 封装 OCR 识别功能（百度 OCR API）

### Interface

```typescript
interface UseOCRReturn {
  // State
  isProcessing: boolean;
  result: OCRResult | null;
  error: string | null;
  
  // Actions
  recognizeImage: (imageUri: string) => Promise<OCRResult>;
  recognizeFromCamera: () => Promise<OCRResult>;
  recognizeFromGallery: () => Promise<OCRResult>;
  clearResult: () => void;
  
  // Utilities
  extractExpenseInfo: () => { amount: number | null; merchant: string | null; date: number | null };
}

export function useOCR(): UseOCRReturn;

interface OCRResult {
  amount: number | null;
  merchant: string | null;
  date: number | null;
  rawText: string;
  confidence: number;
}
```

### Usage Example

```typescript
const {
  isProcessing,
  result,
  recognizeFromCamera,
  extractExpenseInfo,
  error
} = useOCR();

// 拍照识别
const ocrResult = await recognizeFromCamera();

if (ocrResult.confidence >= 0.8) {
  // 高置信度，自动创建记录
  const { amount, merchant, date } = extractExpenseInfo();
  await addExpense({
    amount: amount || 0,
    categoryId: 'cat_008', // 默认"其他"，需用户选择
    inputMethod: InputMethod.PHOTO,
    merchant,
    rawText: ocrResult.rawText,
    confidence: ocrResult.confidence,
    photoUri: imageUri,
  });
} else {
  // 低置信度，显示识别结果让用户确认修改
  showConfirmationDialog(ocrResult);
}
```

### Error Handling

```typescript
if (error) {
  // 错误类型：
  // - PERMISSION_DENIED: 相机/存储权限被拒绝
  // - API_ERROR: OCR 服务错误
  // - NETWORK_ERROR: 网络连接失败
  // - INVALID_IMAGE: 图片格式无效或过大
}
```

### Offline Handling

```typescript
// 离线时保存到队列
if (!isConnected) {
  await addToOfflineQueue({
    type: TaskType.OCR,
    data: { uri: imageUri },
  });
  showToast('识别功能需要网络连接，已保存，联网后自动处理');
}
```

---

## 6. useTheme - 主题管理

**Location**: `src/hooks/useTheme.ts`  
**Purpose**: 提供主题颜色和深色模式切换

### Interface

```typescript
interface UseThemeReturn {
  // Current theme
  theme: Theme;
  colorScheme: 'light' | 'dark';
  
  // Actions
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'auto') => void;
}

interface Theme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    // ... more colors
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
}

export function useTheme(): UseThemeReturn;
```

### Usage Example

```typescript
const { theme, colorScheme, toggleTheme } = useTheme();

// 使用主题颜色
<View style={{ backgroundColor: theme.colors.background }}>
  <Text style={{ color: theme.colors.text }}>Hello</Text>
</View>

// 切换主题
<Button title="切换主题" onPress={toggleTheme} />
```

### Theme Definition

```typescript
// src/theme/colors.ts
export const lightTheme: Theme = {
  colors: {
    primary: '#6200EE',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#757575',
    border: '#E0E0E0',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FF9800',
  },
  // ...
};

export const darkTheme: Theme = {
  colors: {
    primary: '#BB86FC',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#2C2C2C',
    error: '#CF6679',
    success: '#81C784',
    warning: '#FFB74D',
  },
  // ...
};
```

---

## 7. useOfflineQueue - 离线任务队列管理

**Location**: `src/hooks/useOfflineQueue.ts`  
**Purpose**: 管理离线识别任务队列

### Interface

```typescript
interface UseOfflineQueueReturn {
  // State
  queue: OfflineTask[];
  isProcessing: boolean;
  
  // Actions
  addTask: (task: Omit<OfflineTask, 'id' | 'createdAt' | 'retryCount'>) => Promise<void>;
  processQueue: () => Promise<void>;
  retryTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // Utilities
  getPendingCount: () => number;
  getFailedTasks: () => OfflineTask[];
}

export function useOfflineQueue(): UseOfflineQueueReturn;
```

### Usage Example

```typescript
const {
  queue,
  addTask,
  processQueue,
  getPendingCount
} = useOfflineQueue();

// 添加离线任务
await addTask({
  type: TaskType.OCR,
  status: TaskStatus.PENDING,
  data: { uri: imageUri, expenseId: expense.id },
});

// 显示待处理任务数
const pendingCount = getPendingCount();
if (pendingCount > 0) {
  showBadge(pendingCount);
}

// 网络恢复时自动处理
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    processQueue();
  }
});
```

---

## Testing Requirements

所有 Hooks 必须满足以下测试要求（符合宪章原则三 TDD）：

1. **单元测试覆盖率 ≥90%**
2. **使用 @testing-library/react-hooks** 测试 Hooks 行为
3. **Mock 外部依赖**（数据库、网络请求）
4. **测试异步操作**（使用 `waitFor`）
5. **测试错误处理**（验证所有 error 分支）

### Example Test

```typescript
// __tests__/hooks/useExpenses.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useExpenses } from '@/hooks/useExpenses';

describe('useExpenses', () => {
  it('should add expense successfully', async () => {
    const { result } = renderHook(() => useExpenses());
    
    await act(async () => {
      const expense = await result.current.addExpense({
        amount: 50,
        categoryId: 'cat_001',
        inputMethod: InputMethod.KEYBOARD,
      });
      
      expect(expense.amount).toBe(50);
      expect(result.current.expenses).toHaveLength(1);
    });
  });
  
  it('should throw error for invalid amount', async () => {
    const { result } = renderHook(() => useExpenses());
    
    await expect(
      result.current.addExpense({
        amount: -10,  // 无效金额
        categoryId: 'cat_001',
        inputMethod: InputMethod.KEYBOARD,
      })
    ).rejects.toThrow('INVALID_AMOUNT');
  });
});
```

---

**Next**: 生成 `services-api.md` 定义数据层 API 契约。

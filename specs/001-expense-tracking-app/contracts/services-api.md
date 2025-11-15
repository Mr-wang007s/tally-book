# Services API Contract

**Feature**: 家庭支出统计应用  
**Date**: 2025-11-15  
**Purpose**: 定义数据层服务的接口契约（数据库、存储、外部 API）

---

## 1. Database Service - SQLite 数据库操作

**Location**: `src/services/database.ts`  
**Purpose**: 封装所有 SQLite 数据库操作，提供类型安全的 CRUD 接口

### Interface

```typescript
// 数据库初始化
export function initDatabase(): Promise<void>;

// 支出记录操作
export function insertExpense(expense: CreateExpenseDTO): Promise<Expense>;
export function updateExpense(id: string, data: UpdateExpenseDTO): Promise<void>;
export function deleteExpense(id: string): Promise<void>;
export function getExpenseById(id: string): Promise<Expense | null>;
export function getAllExpenses(): Promise<Expense[]>;
export function getExpensesByDateRange(start: number, end: number): Promise<Expense[]>;
export function getExpensesByCategory(categoryId: string): Promise<Expense[]>;

// 类别操作
export function insertCategory(category: CreateCategoryDTO): Promise<Category>;
export function updateCategory(id: string, data: UpdateCategoryDTO): Promise<void>;
export function deleteCategory(id: string): Promise<void>;
export function getCategoryById(id: string): Promise<Category | null>;
export function getAllCategories(): Promise<Category[]>;
export function getCategoryUsageCount(categoryId: string): Promise<number>;

// 统计查询
export function getTotalAmountByDateRange(start: number, end: number): Promise<number>;
export function getCategoryBreakdown(start: number, end: number): Promise<CategoryBreakdown[]>;
export function getDailyTrend(start: number, end: number): Promise<TrendDataPoint[]>;

// 数据库维护
export function vacuum(): Promise<void>;
export function exportData(): Promise<string>;  // 返回 JSON 字符串
export function importData(jsonData: string): Promise<void>;
```

### Implementation Details

```typescript
import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

const db = SQLite.openDatabase('tally-book.db');

export async function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // 创建 categories 表
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            icon TEXT NOT NULL,
            color TEXT NOT NULL,
            is_default INTEGER NOT NULL DEFAULT 0,
            monthly_budget REAL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
          )
        `);
        
        // 创建 expenses 表
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            amount REAL NOT NULL CHECK(amount >= 0.01 AND amount <= 1000000),
            category_id TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            input_method TEXT NOT NULL,
            note TEXT,
            photo_uri TEXT,
            merchant TEXT,
            raw_text TEXT,
            confidence REAL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id)
          )
        `);
        
        // 创建索引
        tx.executeSql('CREATE INDEX IF NOT EXISTS idx_expenses_timestamp ON expenses(timestamp DESC)');
        tx.executeSql('CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id)');
        
        // 插入默认类别（仅首次）
        tx.executeSql('SELECT COUNT(*) as count FROM categories', [], (_, result) => {
          if (result.rows.item(0).count === 0) {
            DEFAULT_CATEGORIES.forEach(cat => {
              tx.executeSql(
                'INSERT INTO categories VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [cat.id, cat.name, cat.icon, cat.color, 1, null, Date.now(), Date.now()]
              );
            });
          }
        });
      },
      error => reject(error),
      () => resolve()
    );
  });
}

export async function insertExpense(expense: CreateExpenseDTO): Promise<Expense> {
  const id = uuidv4();
  const now = Date.now();
  const timestamp = expense.timestamp || now;
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO expenses (id, amount, category_id, timestamp, input_method, note, photo_uri, merchant, raw_text, confidence, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          expense.amount,
          expense.categoryId,
          timestamp,
          expense.inputMethod,
          expense.note || null,
          expense.photoUri || null,
          expense.merchant || null,
          expense.rawText || null,
          expense.confidence || null,
          now,
          now
        ],
        (_, result) => {
          resolve({
            id,
            ...expense,
            timestamp,
            createdAt: now,
            updatedAt: now,
          } as Expense);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function getExpensesByDateRange(start: number, end: number): Promise<Expense[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM expenses WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC',
        [start, end],
        (_, result) => {
          const expenses: Expense[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            expenses.push(mapRowToExpense(result.rows.item(i)));
          }
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// 辅助函数：将数据库行映射为 Expense 对象
function mapRowToExpense(row: any): Expense {
  return {
    id: row.id,
    amount: row.amount,
    categoryId: row.category_id,
    timestamp: row.timestamp,
    inputMethod: row.input_method as InputMethod,
    note: row.note,
    photoUri: row.photo_uri,
    merchant: row.merchant,
    rawText: row.raw_text,
    confidence: row.confidence,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
```

### Error Handling

```typescript
// 数据库错误类型
export enum DBError {
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',  // 唯一性约束、外键约束等
  NOT_FOUND = 'NOT_FOUND',                        // 记录不存在
  INVALID_DATA = 'INVALID_DATA',                  // 数据验证失败
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',      // 事务失败
}

export class DatabaseError extends Error {
  code: DBError;
  
  constructor(code: DBError, message: string) {
    super(message);
    this.code = code;
    this.name = 'DatabaseError';
  }
}

// 使用示例
try {
  await insertExpense(data);
} catch (error) {
  if (error instanceof DatabaseError) {
    if (error.code === DBError.CONSTRAINT_VIOLATION) {
      // 处理约束违反（如外键不存在）
    }
  }
}
```

---

## 2. Storage Service - AsyncStorage 操作

**Location**: `src/services/storage.ts`  
**Purpose**: 封装 AsyncStorage 操作，用于存储应用设置和轻量级数据

### Interface

```typescript
// 设置操作
export function getSettings(): Promise<AppSettings>;
export function updateSettings(settings: Partial<AppSettings>): Promise<void>;
export function resetSettings(): Promise<void>;

// 离线队列操作
export function getOfflineQueue(): Promise<OfflineTask[]>;
export function addToOfflineQueue(task: Omit<OfflineTask, 'id' | 'createdAt' | 'retryCount'>): Promise<void>;
export function removeFromOfflineQueue(taskId: string): Promise<void>;
export function updateOfflineTaskStatus(taskId: string, status: TaskStatus): Promise<void>;

// 通用键值存储
export function setItem<T>(key: string, value: T): Promise<void>;
export function getItem<T>(key: string, defaultValue?: T): Promise<T | null>;
export function removeItem(key: string): Promise<void>;
export function clear(): Promise<void>;
```

### Implementation Details

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SETTINGS: 'app_settings',
  OFFLINE_QUEUE: 'offline_queue',
};

export async function getSettings(): Promise<AppSettings> {
  const json = await AsyncStorage.getItem(KEYS.SETTINGS);
  if (json) {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
  }
  return DEFAULT_SETTINGS;
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
}

export async function getOfflineQueue(): Promise<OfflineTask[]> {
  const json = await AsyncStorage.getItem(KEYS.OFFLINE_QUEUE);
  return json ? JSON.parse(json) : [];
}

export async function addToOfflineQueue(
  task: Omit<OfflineTask, 'id' | 'createdAt' | 'retryCount'>
): Promise<void> {
  const queue = await getOfflineQueue();
  const newTask: OfflineTask = {
    ...task,
    id: uuidv4(),
    createdAt: Date.now(),
    retryCount: 0,
  };
  queue.push(newTask);
  await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
}

export async function removeFromOfflineQueue(taskId: string): Promise<void> {
  const queue = await getOfflineQueue();
  const updated = queue.filter(t => t.id !== taskId);
  await AsyncStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(updated));
}
```

---

## 3. Voice API Service - 语音识别

**Location**: `src/services/voiceApi.ts`  
**Purpose**: 封装语音识别 API 调用

### Interface

```typescript
export interface VoiceRecognitionResult {
  text: string;
  confidence: number;
}

export function startRecording(): Promise<string>;  // 返回录音文件 URI
export function stopRecording(): Promise<void>;
export function recognizeSpeech(audioUri: string): Promise<VoiceRecognitionResult>;
export function requestMicrophonePermission(): Promise<boolean>;
```

### Implementation Details

```typescript
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

let recording: Audio.Recording | null = null;

export async function requestMicrophonePermission(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

export async function startRecording(): Promise<string> {
  const hasPermission = await requestMicrophonePermission();
  if (!hasPermission) {
    throw new Error('PERMISSION_DENIED');
  }
  
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
  
  recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
  await recording.startAsync();
  
  return recording.getURI() || '';
}

export async function stopRecording(): Promise<void> {
  if (!recording) return;
  
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  recording = null;
  
  return uri || '';
}

export async function recognizeSpeech(audioUri: string): Promise<VoiceRecognitionResult> {
  // 使用 Expo Speech Recognition API 或云端服务
  // 注意：Expo Speech 主要用于 TTS，实际 STT 可能需要集成其他服务
  
  // 示例：调用云端服务（如准确率不足时升级）
  // const response = await fetch('https://api.speech-service.com/recognize', {
  //   method: 'POST',
  //   body: formData,
  // });
  
  // 临时返回模拟结果
  return {
    text: '测试识别文本',
    confidence: 0.9,
  };
}
```

---

## 4. OCR API Service - 图像识别

**Location**: `src/services/ocrApi.ts`  
**Purpose**: 封装百度 OCR API 调用

### Interface

```typescript
export interface OCRResult {
  amount: number | null;
  merchant: string | null;
  date: number | null;
  rawText: string;
  confidence: number;
}

export function recognizeReceipt(imageUri: string): Promise<OCRResult>;
export function recognizeFromCamera(): Promise<{ uri: string; result: OCRResult }>;
export function recognizeFromGallery(): Promise<{ uri: string; result: OCRResult }>;
export function requestCameraPermission(): Promise<boolean>;
```

### Implementation Details

```typescript
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const BAIDU_OCR_API = 'https://aip.baidubce.com/rest/2.0/ocr/v1/receipt';
const BAIDU_TOKEN_API = 'https://aip.baidubce.com/oauth/2.0/token';

let accessToken: string | null = null;

async function getBaiduAccessToken(): Promise<string> {
  if (accessToken) return accessToken;
  
  const response = await axios.post(BAIDU_TOKEN_API, null, {
    params: {
      grant_type: 'client_credentials',
      client_id: process.env.BAIDU_API_KEY,
      client_secret: process.env.BAIDU_SECRET_KEY,
    },
  });
  
  accessToken = response.data.access_token;
  return accessToken;
}

export async function recognizeReceipt(imageUri: string): Promise<OCRResult> {
  // 读取图片并转换为 Base64
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  
  const token = await getBaiduAccessToken();
  
  const response = await axios.post(
    BAIDU_OCR_API,
    `image=${encodeURIComponent(base64)}&access_token=${token}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  
  // 解析百度 OCR 响应
  const result = response.data;
  
  return {
    amount: extractAmount(result.words_result),
    merchant: extractMerchant(result.words_result),
    date: extractDate(result.words_result),
    rawText: result.words_result.map((w: any) => w.words).join(' '),
    confidence: result.words_result_num > 0 ? 0.85 : 0,  // 简化的置信度计算
  };
}

function extractAmount(wordsResult: any[]): number | null {
  // 查找总金额字段
  const totalField = wordsResult.find(w => w.word === '总计' || w.word === '合计');
  if (totalField && totalField.next) {
    const amountStr = totalField.next.words.replace(/[^0-9.]/g, '');
    return parseFloat(amountStr) || null;
  }
  return null;
}

function extractMerchant(wordsResult: any[]): string | null {
  // 通常商家名称在第一行
  return wordsResult.length > 0 ? wordsResult[0].words : null;
}

function extractDate(wordsResult: any[]): number | null {
  // 查找日期字段（YYYY-MM-DD 格式）
  const dateField = wordsResult.find(w => /\d{4}-\d{2}-\d{2}/.test(w.words));
  if (dateField) {
    return new Date(dateField.words).getTime();
  }
  return null;
}

export async function recognizeFromCamera(): Promise<{ uri: string; result: OCRResult }> {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    throw new Error('PERMISSION_DENIED');
  }
  
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: true,
  });
  
  if (result.canceled) {
    throw new Error('USER_CANCELLED');
  }
  
  const uri = result.assets[0].uri;
  const ocrResult = await recognizeReceipt(uri);
  
  return { uri, result: ocrResult };
}

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
}
```

### Error Handling

```typescript
export enum OCRError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_IMAGE = 'INVALID_IMAGE',
  RATE_LIMIT = 'RATE_LIMIT',
}

try {
  const result = await recognizeReceipt(uri);
} catch (error) {
  if (error.message === 'PERMISSION_DENIED') {
    // 提示用户授予相机权限
  } else if (error.response?.status === 429) {
    // API 调用频率限制
  }
}
```

---

## 5. NLP Service - 文本提取

**Location**: `src/services/nlpService.ts`  
**Purpose**: 从语音或 OCR 文本中提取金额和类别信息

### Interface

```typescript
export interface ExtractedInfo {
  amount: number | null;
  category: string | null;
  confidence: number;
}

export function extractExpenseInfo(text: string): ExtractedInfo;
export function extractAmount(text: string): number | null;
export function extractCategory(text: string, categories: Category[]): string | null;
```

### Implementation Details

```typescript
// 金额提取正则表达式
const AMOUNT_PATTERNS = [
  /(\d+(?:\.\d{1,2})?)\s*元/,           // "45.5元"
  /￥\s*(\d+(?:\.\d{1,2})?)/,          // "￥100"
  /花了?\s*(\d+(?:\.\d{1,2})?)/,       // "花了30"
  /(\d+(?:\.\d{1,2})?)\s*块/,          // "20块"
  /(\d+(?:\.\d{1,2})?)\s*钱/,          // "15钱"
];

// 类别关键词映射
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '餐饮': ['吃饭', '午餐', '晚餐', '早餐', '面包', '餐厅', '外卖', '饿了么', '美团'],
  '交通': ['打车', '地铁', '公交', '出租车', '滴滴', 'Uber', '共享单车', '加油'],
  '购物': ['买了', '购买', '商场', '超市', '淘宝', '京东', '拼多多'],
  '娱乐': ['电影', '游戏', '唱歌', 'KTV', '酒吧', '夜店'],
  '医疗': ['医院', '看病', '药店', '体检', '挂号'],
  '教育': ['培训', '学费', '书籍', '课程'],
  '住房': ['房租', '水电', '物业', '维修'],
};

export function extractAmount(text: string): number | null {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const amount = parseFloat(match[1]);
      // 验证金额合理性
      if (amount > 0 && amount <= 1000000) {
        return amount;
      }
    }
  }
  return null;
}

export function extractCategory(text: string, categories: Category[]): string | null {
  let maxScore = 0;
  let matchedCategoryId: string | null = null;
  
  for (const category of categories) {
    const keywords = CATEGORY_KEYWORDS[category.name] || [];
    const score = keywords.filter(kw => text.includes(kw)).length;
    
    if (score > maxScore) {
      maxScore = score;
      matchedCategoryId = category.id;
    }
  }
  
  return matchedCategoryId;
}

export function extractExpenseInfo(text: string, categories: Category[]): ExtractedInfo {
  const amount = extractAmount(text);
  const categoryId = extractCategory(text, categories);
  
  // 置信度计算：同时提取到金额和类别为高置信度
  let confidence = 0;
  if (amount && categoryId) {
    confidence = 0.9;
  } else if (amount || categoryId) {
    confidence = 0.6;
  }
  
  return {
    amount,
    category: categoryId,
    confidence,
  };
}
```

---

## 6. File System Service - 文件管理

**Location**: `src/services/fileSystem.ts`  
**Purpose**: 管理照片附件的存储和删除

### Interface

```typescript
export function savePhoto(uri: string, expenseId: string): Promise<string>;
export function deletePhoto(uri: string): Promise<void>;
export function getPhotoUri(expenseId: string): string;
export function cleanupOrphanedPhotos(): Promise<void>;  // 清理未关联的照片
```

### Implementation Details

```typescript
import * as FileSystem from 'expo-file-system';

const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

export async function ensurePhotosDirectoryExists(): Promise<void> {
  const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

export async function savePhoto(uri: string, expenseId: string): Promise<string> {
  await ensurePhotosDirectoryExists();
  
  const filename = `${expenseId}.jpg`;
  const destUri = `${PHOTOS_DIR}${filename}`;
  
  // 压缩并保存照片
  await FileSystem.copyAsync({
    from: uri,
    to: destUri,
  });
  
  // 注意：实际应用中应使用 expo-image-manipulator 压缩图片
  
  return destUri;
}

export async function deletePhoto(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}

export function getPhotoUri(expenseId: string): string {
  return `${PHOTOS_DIR}${expenseId}.jpg`;
}

export async function cleanupOrphanedPhotos(): Promise<void> {
  const allExpenses = await getAllExpenses();
  const validPhotoUris = new Set(
    allExpenses.filter(e => e.photoUri).map(e => e.photoUri)
  );
  
  const photosDir = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
  for (const filename of photosDir) {
    const uri = `${PHOTOS_DIR}${filename}`;
    if (!validPhotoUris.has(uri)) {
      await deletePhoto(uri);
    }
  }
}
```

---

## Testing Requirements

所有 Services 必须满足：

1. **单元测试覆盖率 ≥90%**
2. **Mock 外部依赖**（SQLite、AsyncStorage、网络请求）
3. **测试错误处理**（网络失败、权限拒绝、数据验证失败）
4. **性能测试**（数据库查询时间、OCR 响应时间）

### Example Test

```typescript
// __tests__/services/database.test.ts
import { insertExpense, getExpenseById } from '@/services/database';
import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite');

describe('Database Service', () => {
  beforeEach(async () => {
    await initDatabase();
  });
  
  it('should insert expense successfully', async () => {
    const expense = await insertExpense({
      amount: 50,
      categoryId: 'cat_001',
      inputMethod: InputMethod.KEYBOARD,
    });
    
    expect(expense.id).toBeDefined();
    expect(expense.amount).toBe(50);
    
    const retrieved = await getExpenseById(expense.id);
    expect(retrieved).toEqual(expense);
  });
  
  it('should reject invalid amount', async () => {
    await expect(
      insertExpense({
        amount: -10,
        categoryId: 'cat_001',
        inputMethod: InputMethod.KEYBOARD,
      })
    ).rejects.toThrow(DatabaseError);
  });
});
```

---

**Next**: 生成 `quickstart.md` 快速入门指南。

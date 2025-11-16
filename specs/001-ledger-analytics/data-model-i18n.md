# Data Model: Internationalization (i18n) Structure

**Version**: 1.0  
**Date**: 2025-11-16  
**Feature**: 001-ledger-analytics Optimization

---

## 1. Translation Entity Model

### Translation Structure

**Namespace Organization** (by feature domain):
```
translations/
├── common/               # UI chrome (buttons, dialogs, etc.)
├── transactions/         # Transaction-specific (income, expense, category, etc.)
├── home/                # Dashboard/home screen
├── summary/             # Summary & aggregates
├── trends/              # Trends & analytics
├── validation/          # Error/validation messages
└── settings/            # Settings & preferences (future)
```

### Common Namespace
```json
{
  "ok": "确定",
  "cancel": "取消",
  "close": "关闭",
  "delete": "删除",
  "edit": "编辑",
  "save": "保存",
  "add": "添加",
  "back": "返回",
  "next": "下一步",
  "previous": "上一步",
  "loading": "加载中...",
  "error": "错误",
  "success": "成功",
  "warning": "警告",
  "info": "信息",
  "noData": "暂无数据",
  "tryAgain": "重试",
  "confirm": "确认"
}
```

### Transactions Namespace
```json
{
  "title": "交易",
  "add": "添加交易",
  "edit": "编辑交易",
  "delete": "删除交易",
  "view": "查看交易",
  "list": "交易列表",
  
  "fields": {
    "type": "类型",
    "amount": "金额",
    "date": "日期",
    "category": "分类",
    "note": "备注",
    "paymentMethod": "支付方式",
    "description": "描述"
  },
  
  "types": {
    "income": "收入",
    "expense": "支出"
  },
  
  "categories": {
    "income": {
      "salary": "工资",
      "bonus": "奖金",
      "investment": "投资收益",
      "other": "其他收入"
    },
    "expense": {
      "food": "食物",
      "transport": "交通",
      "shopping": "购物",
      "entertainment": "娱乐",
      "utilities": "生活费",
      "healthcare": "医疗",
      "education": "教育",
      "other": "其他支出"
    }
  },
  
  "paymentMethods": {
    "cash": "现金",
    "creditCard": "信用卡",
    "debitCard": "借记卡",
    "bankTransfer": "银行转账",
    "mobilePayment": "移动支付",
    "other": "其他"
  },
  
  "messages": {
    "created": "交易已添加",
    "updated": "交易已更新",
    "deleted": "交易已删除",
    "deleteConfirm": "确定要删除此交易吗？此操作无法撤销。",
    "emptyState": "还没有交易记录，点击下方按钮开始添加"
  },
  
  "validation": {
    "amountRequired": "请输入金额",
    "amountPositive": "金额必须大于 0",
    "amountDecimal": "金额最多可以有两位小数",
    "categoryRequired": "请选择分类",
    "dateRequired": "请选择日期",
    "dateInvalid": "日期无效",
    "dateFuture": "日期不能超过今天",
    "typeRequired": "请选择交易类型"
  }
}
```

### Home Namespace
```json
{
  "title": "首页",
  "greeting": "你好",
  "balance": "余额",
  "income": "收入",
  "expense": "支出",
  "rate": "储蓄率",
  
  "sections": {
    "overview": "概览",
    "recentTransactions": "最近交易",
    "topCategories": "分类排行"
  },
  
  "messages": {
    "noTransactions": "暂无交易，点击下方按钮开始记账",
    "loadingFailed": "加载失败，请重试"
  },
  
  "actions": {
    "addTransaction": "添加交易",
    "viewAll": "查看全部",
    "viewTrends": "查看趋势"
  }
}
```

### Summary Namespace
```json
{
  "title": "统计",
  "period": "时期",
  "selectPeriod": "选择时期",
  
  "periods": {
    "today": "今天",
    "week": "本周",
    "month": "本月",
    "year": "本年",
    "custom": "自定义"
  },
  
  "metrics": {
    "totalIncome": "总收入",
    "totalExpense": "总支出",
    "balance": "余额",
    "savingsRate": "储蓄率"
  },
  
  "messages": {
    "noData": "选定时期内暂无数据",
    "selectCustomRange": "请选择日期范围"
  }
}
```

### Trends Namespace
```json
{
  "title": "趋势",
  "viewBy": "查看方式",
  
  "views": {
    "byTime": "按时间",
    "byCategory": "按分类"
  },
  
  "granularity": {
    "daily": "按天",
    "weekly": "按周",
    "monthly": "按月"
  },
  
  "periods": {
    "last7Days": "最近 7 天",
    "last30Days": "最近 30 天",
    "currentMonth": "本月",
    "last3Months": "最近 3 个月",
    "custom": "自定义"
  },
  
  "messages": {
    "noData": "所选时期内暂无数据",
    "selectOption": "请选择查看方式"
  },
  
  "labels": {
    "expense": "支出",
    "income": "收入",
    "trend": "趋势",
    "average": "平均值"
  }
}
```

### Validation Namespace
```json
{
  "required": "此字段为必填项",
  "invalid": "此字段格式无效",
  "tooLong": "输入过长（最多 {max} 个字符）",
  "tooShort": "输入过短（至少 {min} 个字符）",
  "pattern": "格式不符合要求",
  "network": "网络连接失败，请检查并重试",
  "unknown": "发生了一个错误，请重试"
}
```

---

## 2. Language Configuration Entity

### LocalizationConfig Type
```typescript
interface LocalizationConfig {
  id: string;                    // "localization-config"
  currentLanguage: 'zh-CN' | 'en'; // Current active language
  systemLanguageFollow: boolean;  // Follow system locale if true
  supportedLanguages: Language[];
  dateFormat: string;            // e.g., "YYYY-MM-DD"
  timeFormat: string;            // e.g., "HH:mm"
  numberFormat: 'en-US' | 'zh-CN'; // Decimal and thousands separator
  currencySymbol: string;        // Default: "¥"
}

interface Language {
  code: 'zh-CN' | 'en';
  name: string;              // e.g., "中文", "English"
  nativeName: string;        // e.g., "中文", "English"
  direction: 'ltr' | 'rtl';  // Left-to-right or right-to-left
}
```

### Persistence
- **Storage**: AsyncStorage with key `@localization-config`
- **Default**: System locale detection via `react-native-localize`
- **Fallback**: English (en) if system locale not supported

---

## 3. Translation File Structure

### File Layout
```
src/i18n/
├── config.ts                          # i18next initialization
├── types.ts                           # TypeScript interfaces for translations
├── hooks.ts                           # Custom hooks (useTranslation, useI18n)
├── locales/
│   ├── zh-CN.json                     # Simplified Chinese
│   └── en.json                        # English
└── resources/
    ├── common.ts                      # Shared translation keys (constants)
    └── keys.ts                        # Typed translation key enums
```

### zh-CN.json Structure (Example)
```json
{
  "common": { ... },
  "transactions": { ... },
  "home": { ... },
  "summary": { ... },
  "trends": { ... },
  "validation": { ... }
}
```

### Type Safety Pattern
```typescript
// src/i18n/types.ts
export interface Translations {
  common: {
    ok: string;
    cancel: string;
    // ...
  };
  transactions: {
    title: string;
    add: string;
    fields: {
      type: string;
      amount: string;
      // ...
    };
    categories: {
      income: Record<string, string>;
      expense: Record<string, string>;
    };
    // ...
  };
  // ... other namespaces
}

// Usage in components
const { t } = useTranslation() as { t: (key: keyof Translations) => string };
```

---

## 4. Dynamic Translation Keys

### Pluralization Example
```json
{
  "transactions.count": "你有 {{count}} 笔交易",
  "transactions.count_one": "你有 1 笔交易",
  "transactions.count_other": "你有 {{count}} 笔交易"
}
```

### Interpolation Example
```json
{
  "transactions.dateRange": "从 {{startDate}} 到 {{endDate}}",
  "validation.tooLong": "最多可输入 {{max}} 个字符（当前 {{current}}）"
}
```

### Usage
```typescript
t('transactions.dateRange', {
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});
```

---

## 5. Number & Date Formatting

### Formatter Functions (i18n + locale)
```typescript
// src/i18n/formatters.ts

export function formatCurrency(amount: number, locale: 'zh-CN' | 'en'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'zh-CN' ? 'CNY' : 'USD'
  });
  return formatter.format(amount);
}

export function formatDate(date: Date, locale: 'zh-CN' | 'en'): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return formatter.format(date);
}

export function formatPercent(value: number, locale: 'zh-CN' | 'en'): string {
  const formatter = new Intl.NumberFormat(locale, { style: 'percent' });
  return formatter.format(value);
}
```

---

## 6. Translation Keys Reference

### Complete Key List by Namespace

**common** (18 keys):
- ok, cancel, close, delete, edit, save, add, back, next, previous, loading, error, success, warning, info, noData, tryAgain, confirm

**transactions** (40+ keys):
- title, add, edit, delete, view, list
- fields: type, amount, date, category, note, paymentMethod, description
- types: income, expense
- categories.income: salary, bonus, investment, other
- categories.expense: food, transport, shopping, entertainment, utilities, healthcare, education, other
- paymentMethods: cash, creditCard, debitCard, bankTransfer, mobilePayment, other
- messages: created, updated, deleted, deleteConfirm, emptyState
- validation: amountRequired, amountPositive, amountDecimal, categoryRequired, dateRequired, dateInvalid, dateFuture, typeRequired

**home** (15+ keys):
- title, greeting, balance, income, expense, rate
- sections: overview, recentTransactions, topCategories
- messages: noTransactions, loadingFailed
- actions: addTransaction, viewAll, viewTrends

**summary** (12+ keys):
- title, period, selectPeriod
- periods: today, week, month, year, custom
- metrics: totalIncome, totalExpense, balance, savingsRate
- messages: noData, selectCustomRange

**trends** (20+ keys):
- title, viewBy
- views: byTime, byCategory
- granularity: daily, weekly, monthly
- periods: last7Days, last30Days, currentMonth, last3Months, custom
- messages: noData, selectOption
- labels: expense, income, trend, average

**validation** (6 keys):
- required, invalid, tooLong, tooShort, pattern, network, unknown

**Total Keys**: ~140 translation keys (approximately)

---

## 7. Migration Path for Existing Content

### Step 1: Identify Hardcoded Strings
Scan all components for hardcoded strings in UI (done in Phase 2)

### Step 2: Extract to Translation Files
Create mapping from hardcoded string → translation key

### Step 3: Update Components
Replace hardcoded strings with `t()` calls

**Example Migration**:
```typescript
// BEFORE
<Button title="添加交易" onPress={handleAdd} />

// AFTER (with i18n)
import { useTranslation } from 'react-i18next';

export function AddButton() {
  const { t } = useTranslation();
  return <Button title={t('transactions.add')} onPress={handleAdd} />;
}
```

---

## 8. Testing Strategy for i18n

### Unit Tests
- Verify all keys exist in both zh-CN and en
- Verify no missing interpolation variables
- Verify key naming follows conventions

### Integration Tests
- Switch language mid-app and verify UI updates
- Test date/currency formatting with different locales
- Test pluralization logic with edge cases (0, 1, 2, 100 items)

### Snapshot Tests
- Form field labels and placeholders in both languages
- Error messages rendering correctly in both languages
- Empty states and messages in both languages

---

## 9. Constraints & Assumptions

- **Single locale per session**: No mid-session language switching (would require app reload)
- **Supported languages**: zh-CN (Chinese Simplified) and en (English) only in MVP
- **Character encoding**: UTF-8 for all JSON translation files
- **Key naming**: Lowercase with dots for namespacing (e.g., `transactions.add`)
- **No markup in translations**: Translations are plain strings (HTML/components handled in code)
- **Right-to-left (RTL) support**: Deferred to future milestone

---

## 10. Related Documents

- **Data Model (General)**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/data-model.md`
- **Component Architecture**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/component-architecture.md`
- **Implementation Plan**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/plan.md`
- **Research Details**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/research-optimization.md`

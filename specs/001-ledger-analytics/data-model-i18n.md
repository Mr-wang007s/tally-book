# Data Model: i18n Translation Structure

**Feature**: 001-ledger-analytics  
**Language Support**: Chinese (zh-CN) primary, English (en) fallback  
**Last Updated**: 2025-11-16  

---

## Translation Architecture

### Namespace Organization

Translations are organized by feature/domain into logical namespaces for easier maintenance and selective loading:

```
locales/
├── zh-CN.json          # Chinese (Simplified)
└── en.json             # English
```

**Namespaces**:
- `common`: Universal UI labels (OK, Cancel, Delete, Edit, Close, Save, etc.)
- `transactions`: Transaction CRUD, form fields, validation messages
- `home`: Home dashboard, balance display, recent items
- `summary`: Summary period view, aggregate totals
- `trends`: Trends analysis, time-series labels, category breakdown
- `categories`: Category names for both income and expense types
- `messages`: Notification and feedback messages (success, error, warning)

---

## Translation Keys Specification

### 1. Common Namespace

Universal UI elements and actions used across all screens.

```typescript
common: {
  ok: string;                    // "好的" / "OK"
  cancel: string;                // "取消" / "Cancel"
  save: string;                  // "保存" / "Save"
  delete: string;                // "删除" / "Delete"
  edit: string;                  // "编辑" / "Edit"
  close: string;                 // "关闭" / "Close"
  confirm: string;               // "确认" / "Confirm"
  back: string;                  // "返回" / "Back"
  clear: string;                 // "清除" / "Clear"
  add: string;                   // "添加" / "Add"
  create: string;                // "创建" / "Create"
  update: string;                // "更新" / "Update"
  remove: string;                // "移除" / "Remove"
  loading: string;               // "加载中..." / "Loading..."
  noData: string;                // "暂无数据" / "No Data"
  error: string;                 // "错误" / "Error"
  success: string;               // "成功" / "Success"
  warning: string;               // "警告" / "Warning"
  info: string;                  // "信息" / "Info"
}
```

---

### 2. Transactions Namespace

Core transaction management including CRUD operations and form fields.

```typescript
transactions: {
  // Screen title and actions
  title: string;                 // "交易记录" / "Transactions"
  addTransaction: string;        // "添加交易" / "Add Transaction"
  editTransaction: string;       // "编辑交易" / "Edit Transaction"
  deleteTransaction: string;     // "删除交易" / "Delete Transaction"
  
  // Transaction types
  income: string;                // "收入" / "Income"
  expense: string;               // "支出" / "Expense"
  
  // Form field labels
  type: string;                  // "类型" / "Type"
  amount: string;                // "金额" / "Amount"
  date: string;                  // "日期" / "Date"
  category: string;              // "分类" / "Category"
  note: string;                  // "备注" / "Note"
  paymentMethod: string;         // "支付方式" / "Payment Method"
  
  // Form actions
  saveTransaction: string;       // "保存交易" / "Save Transaction"
  updateTransaction: string;     // "更新交易" / "Update Transaction"
  cancelTransaction: string;     // "取消" / "Cancel"
  confirmDelete: string;         // "确认删除?" / "Confirm Delete?"
  
  // Transaction status/feedback
  addSuccess: string;            // "交易已添加" / "Transaction added"
  updateSuccess: string;         // "交易已更新" / "Transaction updated"
  deleteSuccess: string;         // "交易已删除" / "Transaction deleted"
  
  // Validation errors
  validation: {
    amountRequired: string;      // "金额必填" / "Amount is required"
    amountPositive: string;      // "金额必须大于0" / "Amount must be greater than 0"
    amountInvalid: string;       // "金额格式不正确" / "Invalid amount format"
    categoryRequired: string;    // "分类必选" / "Category is required"
    categoryInvalid: string;     // "分类不存在" / "Invalid category"
    dateRequired: string;        // "日期必填" / "Date is required"
    dateInvalid: string;         // "日期格式不正确" / "Invalid date format"
    typeRequired: string;        // "类型必选" / "Type is required"
    noteMaxLength: string;       // "备注不超过500字" / "Note must be <= 500 characters"
  }
}
```

---

### 3. Home Namespace

Home dashboard and overview screen.

```typescript
home: {
  title: string;                 // "首页" / "Home"
  balance: string;               // "余额" / "Balance"
  income: string;                // "收入" / "Income"
  expense: string;               // "支出" / "Expense"
  recentTransactions: string;    // "最近交易" / "Recent Transactions"
  insights: string;              // "洞察" / "Insights"
  topCategory: string;           // "热门分类" / "Top Category"
  savingsRate: string;           // "储蓄率" / "Savings Rate"
  spendingBreakdown: string;     // "支出分布" / "Spending Breakdown"
  viewAll: string;               // "查看全部" / "View All"
  empty: string;                 // "暂无交易，点击+添加第一笔交易" / "No transactions. Tap + to add your first transaction"
}
```

---

### 4. Summary Namespace

Financial summary and period filtering.

```typescript
summary: {
  title: string;                 // "统计" / "Summary"
  period: string;                // "时期" / "Period"
  totalIncome: string;           // "总收入" / "Total Income"
  totalExpense: string;          // "总支出" / "Total Expense"
  balance: string;               // "余额" / "Balance"
  
  // Period filters
  today: string;                 // "今天" / "Today"
  thisWeek: string;              // "本周" / "This Week"
  thisMonth: string;             // "本月" / "This Month"
  last7Days: string;             // "过去7天" / "Last 7 Days"
  last30Days: string;            // "过去30天" / "Last 30 Days"
  last3Months: string;           // "过去3个月" / "Last 3 Months"
  customRange: string;           // "自定义范围" / "Custom Range"
  
  // Summary actions
  selectPeriod: string;          // "选择时期" / "Select Period"
  startDate: string;             // "开始日期" / "Start Date"
  endDate: string;               // "结束日期" / "End Date"
  
  // Empty state
  empty: string;                 // "此时期无交易" / "No transactions in this period"
}
```

---

### 5. Trends Namespace

Spending trends analysis and visualization.

```typescript
trends: {
  title: string;                 // "趋势" / "Trends"
  byTime: string;                // "按时间" / "By Time"
  byCategory: string;            // "按分类" / "By Category"
  
  // Granularity options
  granularity: string;           // "粒度" / "Granularity"
  daily: string;                 // "日" / "Daily"
  weekly: string;                // "周" / "Weekly"
  monthly: string;               // "月" / "Monthly"
  
  // Period filters
  period: string;                // "时期" / "Period"
  last7Days: string;             // "过去7天" / "Last 7 Days"
  last30Days: string;            // "过去30天" / "Last 30 Days"
  last3Months: string;           // "过去3个月" / "Last 3 Months"
  thisYear: string;              // "本年" / "This Year"
  
  // Chart labels
  totalExpense: string;          // "总支出" / "Total Expense"
  expenseByCategory: string;     // "按分类支出" / "Expense by Category"
  topCategories: string;         // "热门分类" / "Top Categories"
  
  // Actions
  selectGranularity: string;     // "选择粒度" / "Select Granularity"
  selectPeriod: string;          // "选择时期" / "Select Period"
  
  // Empty state
  empty: string;                 // "此时期无数据" / "No data for this period"
}
```

---

### 6. Categories Namespace

Pre-defined income and expense categories.

```typescript
categories: {
  income: {
    salary: string;              // "工资" / "Salary"
    bonus: string;               // "奖金" / "Bonus"
    investment: string;          // "投资收益" / "Investment Returns"
    rental: string;              // "租金收入" / "Rental Income"
    freelance: string;           // "自由职业" / "Freelance"
    gifts: string;               // "礼物" / "Gifts"
    other: string;               // "其他收入" / "Other Income"
  },
  expense: {
    food: string;                // "食物" / "Food"
    transportation: string;      // "交通" / "Transportation"
    utilities: string;           // "公用事业" / "Utilities"
    entertainment: string;       // "娱乐" / "Entertainment"
    shopping: string;            // "购物" / "Shopping"
    healthcare: string;          // "医疗" / "Healthcare"
    education: string;           // "教育" / "Education"
    housing: string;             // "住房" / "Housing"
    insurance: string;           // "保险" / "Insurance"
    subscriptions: string;       // "订阅" / "Subscriptions"
    other: string;               // "其他支出" / "Other Expense"
  }
}
```

---

### 7. Messages Namespace

Feedback notifications and system messages.

```typescript
messages: {
  // Success messages
  success: {
    transactionCreated: string;       // "交易已创建" / "Transaction created"
    transactionUpdated: string;       // "交易已更新" / "Transaction updated"
    transactionDeleted: string;       // "交易已删除" / "Transaction deleted"
    dataSaved: string;                // "数据已保存" / "Data saved"
    operationComplete: string;        // "操作完成" / "Operation complete"
  },
  
  // Error messages
  error: {
    invalidInput: string;             // "输入无效" / "Invalid input"
    saveFailed: string;               // "保存失败" / "Save failed"
    deleteFailed: string;             // "删除失败" / "Delete failed"
    loadFailed: string;               // "加载失败" / "Load failed"
    networkError: string;             // "网络错误" / "Network error"
    unknownError: string;             // "未知错误，请重试" / "Unknown error, please try again"
  },
  
  // Warning messages
  warning: {
    unsavedChanges: string;           // "有未保存的更改" / "You have unsaved changes"
    deleteConfirm: string;            // "删除无法撤销" / "Delete cannot be undone"
    clearData: string;                // "此操作将清除所有数据" / "This will clear all data"
  },
  
  // Info messages
  info: {
    selectDateRange: string;          // "请选择日期范围" / "Please select a date range"
    noTransactionsFound: string;      // "未找到交易" / "No transactions found"
    emptyTransactionList: string;     // "交易列表为空" / "Transaction list is empty"
  }
}
```

---

## Implementation Guidelines

### Type-Safe Translation Hook

The custom `useTranslation` hook provides type safety:

```typescript
// src/i18n/useTranslation.ts
import { useTranslation as useI18nBase } from 'react-i18next';
import { Translations } from '@/contracts/i18n';

export function useTranslation() {
  const { t, i18n } = useI18nBase();
  return {
    t: t as typeof translations,  // Type-safe access
    i18n,
    language: i18n.language
  };
}

// Usage in component
const { t } = useTranslation();
<Text>{t('common.ok')}</Text>           // ✅ Type-checked
<Text>{t('invalid.key')}</Text>         // ❌ TypeScript error
```

### Translation Key Naming Convention

- **Dot notation**: `namespace.feature.item` (e.g., `transactions.validation.amountRequired`)
- **Kebab-case for multi-word**: `transactions.payment_method` NOT `transactions.paymentMethod`
- **Plural handling**: Use array index or suffix (e.g., `categories.income`, `categories.expense`)
- **Avoid abbreviations**: `total_income` not `tot_inc`

### Organization Principles

1. **Feature-first**: Group keys by user-facing feature, not technical layer
2. **Locality**: Related strings live in same namespace
3. **Reusability**: Common UI labels in `common` namespace
4. **Consistency**: Unified terminology across all screens
   - Always use "交易" for transactions, not "交易记录"
   - Always use "收入" for income, not "收益"
   - Always use "支出" for expense, not "花销"
   - Always use "分类" for category, not "类别"

### Fallback Strategy

- **Missing key**: Show key path (dev) or fallback to English (production)
- **Empty value**: Show "N/A" or empty string based on context
- **Invalid namespace**: Log warning, use English default

### Performance Considerations

- **Lazy loading**: Load locales on demand per screen
- **Tree-shaking**: Unused namespaces excluded from bundle
- **Bundle impact**: <50KB for both locales combined
- **Caching**: i18next handles in-memory caching automatically

---

## Validation Checklist

Before deploying translations:

- [ ] All keys exist in both zh-CN and en locales
- [ ] No hardcoded strings remain in components
- [ ] Validation error messages are i18n keys
- [ ] Category names are centralized in `categories` namespace
- [ ] Terminology is consistent (use approved Chinese/English terms)
- [ ] No PII or sensitive data in translation keys
- [ ] Character encoding: UTF-8 for JSON files
- [ ] JSON syntax valid (verified via `npm run validate-i18n`)

---

## References

- **i18next Documentation**: https://www.i18next.com/
- **React i18next**: https://react.i18next.com/
- **react-native-localize**: https://github.com/zoontek/react-native-localize
- **Chinese Style Guide**: Consistent terminology for financial apps
- **Translation Best Practices**: Keys should be descriptive, namespace organized

---

## Migration Plan (If Updating Existing Translations)

1. **Extract**: Scan codebase for hardcoded strings using regex
2. **Create**: Generate translation keys for all found strings
3. **Verify**: Ensure all keys exist in both locales
4. **Replace**: Update components to use `t()` calls
5. **Test**: Verify language switching works
6. **Deploy**: Release with both language variants

---

**Next Step**: Create `src/contracts/i18n.ts` TypeScript interface matching this structure

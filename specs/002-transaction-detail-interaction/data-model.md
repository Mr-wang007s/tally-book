# Data Model

**Feature**: Transaction Detail and Filter Interactions  
**Date**: 2025-11-15  
**Phase**: 1 - Data Model Design

## Overview

本功能涉及的核心实体包括:
1. **Transaction** - 财务交易记录
2. **FilterCriteria** - 筛选条件
3. **Account** - 资金账户
4. **Category** - 交易分类

数据存储采用AsyncStorage,以JSON格式持久化。所有实体设计遵循不可变性原则,支持类型安全(TypeScript strict mode)。

---

## Entity: Transaction

### Description
代表单笔财务交易记录,包含金额、时间、类型、账户、分类、描述和附件信息。

### Attributes

| 字段名 | 类型 | 必需 | 描述 | 验证规则 |
|--------|------|------|------|---------|
| `id` | `string` | ✓ | 唯一标识符,UUID v4格式 | 非空,格式:`[a-f0-9-]{36}` |
| `amount` | `number` | ✓ | 交易金额(正数) | >0,最多2位小数 |
| `timestamp` | `number` | ✓ | 交易时间戳(毫秒) | >0,Unix时间戳 |
| `type` | `TransactionType` | ✓ | 交易类型 | 枚举:`'income'`, `'expense'`, `'transfer'` |
| `fromAccount` | `string` (Account ID) | 条件 | 来源账户ID | type=`expense`/`transfer`时必需 |
| `toAccount` | `string` (Account ID) | 条件 | 目的账户ID | type=`income`/`transfer`时必需 |
| `category` | `string` (Category ID) | ✓ | 分类ID | 非空,引用Category.id |
| `description` | `string` | ✗ | 交易描述文本 | 最长500字符 |
| `attachments` | `string[]` | ✗ | 附件文件URI数组 | 每个URI格式:`file://...` |
| `createdAt` | `number` | ✓ | 创建时间戳 | 自动生成,Unix时间戳 |
| `updatedAt` | `number` | ✓ | 最后更新时间戳 | 自动更新,Unix时间戳 |

### Relationships

- **Transaction → Account (Many-to-One)**:
  - `fromAccount`引用Account实体(类型为expense/transfer时)
  - `toAccount`引用Account实体(类型为income/transfer时)
  
- **Transaction → Category (Many-to-One)**:
  - `category`引用Category实体

### State Transitions

交易状态本身无状态机,但操作流程如下:

```
CREATE → [存在状态]
    ↓
  UPDATE (编辑) → updatedAt更新
    ↓
  DELETE (删除) → 永久移除
```

### Validation Rules

**创建时**:
- `id`:自动生成UUID v4
- `amount`:必须>0
- `type`:必须为`income`/`expense`/`transfer`之一
- `fromAccount`:
  - type=`expense`时必需
  - type=`transfer`时必需
  - type=`income`时必须为null
- `toAccount`:
  - type=`income`时必需
  - type=`transfer`时必需
  - type=`expense`时必须为null
- `category`:必须引用有效的Category ID
- `timestamp`:默认为当前时间,可自定义
- `createdAt`/`updatedAt`:自动生成

**编辑时**:
- 所有字段可修改(除`id`和`createdAt`)
- 验证规则与创建时相同
- `updatedAt`自动更新为当前时间

**删除时**:
- 无条件删除(无级联删除逻辑)
- 删除前显示确认对话框

### Example

```typescript
{
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  amount: 2000.00,
  timestamp: 1622793600000, // 2021-06-04 16:20:00
  type: "transfer",
  fromAccount: "paypal-001",
  toAccount: "chase-002",
  category: "cat-transfer",
  description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
  attachments: [
    "file:///data/user/0/com.mytally/files/receipts/receipt-001.jpg"
  ],
  createdAt: 1622793600000,
  updatedAt: 1622793600000
}
```

---

## Entity: FilterCriteria

### Description
代表用户设置的交易筛选和排序条件。

### Attributes

| 字段名 | 类型 | 必需 | 描述 | 验证规则 |
|--------|------|------|------|---------|
| `typeFilter` | `TransactionType \| null` | ✗ | 类型筛选 | null或枚举值 |
| `sortBy` | `SortOption` | ✓ | 排序方式 | 枚举:`'highest'`, `'lowest'`, `'newest'`, `'oldest'` |
| `selectedCategories` | `string[]` | ✓ | 选中的分类ID数组 | 空数组表示不筛选分类 |

### Default Values

```typescript
{
  typeFilter: null,           // 不筛选类型
  sortBy: 'newest',           // 默认按时间降序
  selectedCategories: []      // 不筛选分类
}
```

### Validation Rules

- `typeFilter`:必须为`null`或`'income'`/`'expense'`/`'transfer'`
- `sortBy`:必须为4个枚举值之一
- `selectedCategories`:每个元素必须为有效的Category ID

### Example

```typescript
{
  typeFilter: "expense",
  sortBy: "highest",
  selectedCategories: ["cat-shopping", "cat-food"]
}
```

---

## Entity: Account

### Description
代表资金账户(如Paypal、Chase等),用于交易的来源和目的地。

### Attributes

| 字段名 | 类型 | 必需 | 描述 | 验证规则 |
|--------|------|------|------|---------|
| `id` | `string` | ✓ | 账户ID | 非空,唯一 |
| `name` | `string` | ✓ | 账户名称 | 非空,最长50字符 |
| `type` | `string` | ✗ | 账户类型(如"银行","电子钱包") | 最长20字符 |
| `balance` | `number` | ✓ | 当前余额 | 可为负数 |
| `icon` | `string` | ✗ | 图标名称(SF Symbol) | 如"creditcard","banknote" |
| `color` | `string` | ✗ | 主题颜色 | 十六进制格式:`#RRGGBB` |

### Example

```typescript
{
  id: "paypal-001",
  name: "Paypal",
  type: "电子钱包",
  balance: 5000.00,
  icon: "creditcard",
  color: "#0070BA"
}
```

**注意**:Account实体在本功能中为只读引用,增删改操作由其他功能模块负责。

---

## Entity: Category

### Description
代表交易分类(如Shopping、Food、Subscription等),用于组织和筛选交易。

### Attributes

| 字段名 | 类型 | 必需 | 描述 | 验证规则 |
|--------|------|------|------|---------|
| `id` | `string` | ✓ | 分类ID | 非空,唯一 |
| `name` | `string` | ✓ | 分类名称 | 非空,最长30字符 |
| `icon` | `string` | ✓ | 图标名称(SF Symbol或Emoji) | 如"cart","fork.knife","📱" |
| `color` | `string` | ✓ | 主题颜色 | 十六进制格式:`#RRGGBB` |
| `type` | `TransactionType` | ✗ | 适用的交易类型 | 枚举值或null(表示通用) |

### Example

```typescript
{
  id: "cat-shopping",
  name: "Shopping",
  icon: "cart",
  color: "#FFA726",
  type: "expense"
}
```

**注意**:Category实体在本功能中为只读引用,增删改操作由其他功能模块负责。

---

## Enumerations

### TransactionType

```typescript
type TransactionType = 'income' | 'expense' | 'transfer';
```

**描述**:交易类型枚举

**值定义**:
- `income`:收入交易(资金流入)
- `expense`:支出交易(资金流出)
- `transfer`:转账交易(账户间转移)

---

### SortOption

```typescript
type SortOption = 'highest' | 'lowest' | 'newest' | 'oldest';
```

**描述**:排序选项枚举

**值定义**:
- `highest`:按金额降序(最高金额优先)
- `lowest`:按金额升序(最低金额优先)
- `newest`:按时间降序(最新交易优先)
- `oldest`:按时间升序(最旧交易优先)

---

## Storage Schema

### AsyncStorage Keys

| Key | 类型 | 描述 |
|-----|------|------|
| `@transactions` | `Transaction[]` | 所有交易记录数组(JSON序列化) |
| `@accounts` | `Account[]` | 所有账户数组(JSON序列化) |
| `@categories` | `Category[]` | 所有分类数组(JSON序列化) |
| `@filter_criteria` | `FilterCriteria` | 上次使用的筛选条件(可选,用于恢复筛选状态) |

### Data Migration

**版本1.0.0**:初始结构,无需迁移

**未来迁移策略**:
- 在AsyncStorage中添加`@schema_version`键
- 启动时检查版本,执行必要的数据转换
- 迁移逻辑封装在`transactionStorage.ts`中的`migrate()`函数

---

## Data Integrity Constraints

### Referential Integrity

**手动维护**:
- Transaction引用的Account ID必须存在于`@accounts`中
- Transaction引用的Category ID必须存在于`@categories`中
- 创建/编辑Transaction时验证引用有效性

**孤儿数据处理**:
- 如果Account被删除,相关Transaction的`fromAccount`/`toAccount`设为null(需要在Account删除逻辑中处理)
- 如果Category被删除,相关Transaction的`category`设为默认分类ID

### Concurrent Modification

**单用户应用**:
- 无需处理并发修改(应用为单用户本地存储)
- AsyncStorage操作已序列化

**未来扩展**(如云同步):
- 添加`version`字段,使用乐观锁检测冲突
- 冲突解决策略:`updatedAt`较新的记录优先

---

## Query Patterns

### 筛选查询

```typescript
// 示例:筛选支出交易,按金额降序,限定分类
const filtered = transactions
  .filter(t => t.type === 'expense')
  .filter(t => ['cat-shopping', 'cat-food'].includes(t.category))
  .sort((a, b) => b.amount - a.amount);
```

### 统计查询

```typescript
// 示例:计算本月总支出
const now = Date.now();
const monthStart = startOfMonth(now);
const totalExpense = transactions
  .filter(t => t.type === 'expense')
  .filter(t => t.timestamp >= monthStart)
  .reduce((sum, t) => sum + t.amount, 0);
```

### 性能优化

- 使用`useMemo`缓存筛选结果
- 启动时一次性加载所有数据到内存
- 避免在渲染循环中执行筛选逻辑

---

## Validation Functions

### validateTransaction

```typescript
function validateTransaction(tx: Partial<Transaction>): string[] {
  const errors: string[] = [];
  
  if (!tx.amount || tx.amount <= 0) {
    errors.push('金额必须大于0');
  }
  
  if (!tx.type || !['income', 'expense', 'transfer'].includes(tx.type)) {
    errors.push('交易类型无效');
  }
  
  if (tx.type === 'expense' && !tx.fromAccount) {
    errors.push('支出交易必须指定来源账户');
  }
  
  if (tx.type === 'income' && !tx.toAccount) {
    errors.push('收入交易必须指定目的账户');
  }
  
  if (tx.type === 'transfer' && (!tx.fromAccount || !tx.toAccount)) {
    errors.push('转账交易必须指定来源和目的账户');
  }
  
  if (!tx.category) {
    errors.push('必须选择交易分类');
  }
  
  if (tx.description && tx.description.length > 500) {
    errors.push('描述文本不能超过500字符');
  }
  
  return errors;
}
```

### validateFilterCriteria

```typescript
function validateFilterCriteria(filter: FilterCriteria): boolean {
  if (filter.typeFilter && !['income', 'expense', 'transfer'].includes(filter.typeFilter)) {
    return false;
  }
  
  if (!['highest', 'lowest', 'newest', 'oldest'].includes(filter.sortBy)) {
    return false;
  }
  
  return true;
}
```

---

## Indexing Strategy

**当前不需要索引**(AsyncStorage为key-value存储,不支持索引)

**如果迁移到SQLite**:
- `transactions.timestamp`:加速时间范围查询
- `transactions.type`:加速类型筛选
- `transactions.category`:加速分类筛选
- 复合索引:`(type, timestamp)`:加速常见筛选+排序组合

---

## Next Steps

1. 创建TypeScript类型定义(`contracts/types.ts`)
2. 实现数据验证函数(`src/utils/validation.ts`)
3. 实现存储服务(`src/services/transactionStorage.ts`)
4. 编写单元测试(`__tests__/services/transactionStorage.test.ts`)

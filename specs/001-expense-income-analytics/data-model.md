# Data Model: Personal Expense/Income & Analytics

## Entities

### Transaction
- id: string (uuid)
- type: enum { expense, income }
- amount: decimal(>0, max 1,000,000)
- currency: string (ISO 4217, 单一币种环境下与全局设置一致)
- date: datetime (ISO 8601)
- categoryId: string (ref Category) | nullable (未分类)
- notes: string (≤500) | optional
- createdAt: datetime
- updatedAt: datetime

Validation
- amount > 0 且 ≤ 1,000,000
- date 为有效日期；默认“今天”
- notes ≤ 500 字符

### Category
- id: string (uuid)
- name: string (1..40)
- type: enum { expense, income }
- order: number (排序权重)
- isDefault: boolean

Constraints
- 仅内置分类；暂不支持用户自定义

### SummaryPoint
- periodStart: date
- periodEnd: date
- totalExpense: decimal
- totalIncome: decimal
- net: decimal (totalIncome - totalExpense)

### CategoryBreakdownItem
- categoryId: string
- amount: decimal
- percentage: number (0..100)

## Relationships
- Category 1..* Transaction（按 type 匹配）

## Derived Rules
- 统计时以筛选的日期范围与颗粒度聚合
- 缺少分类的交易计入“Uncategorized”

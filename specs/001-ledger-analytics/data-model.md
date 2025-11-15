# Data Model: Ledger Analytics

## Entities

### Transaction
- id: string
- type: enum (income | expense)
- amount: number (> 0)
- date: ISO date string
- categoryId: string (required)
- note: string (optional, max 500)
- paymentMethod: string (optional)

Validation:
- amount > 0
- date is valid ISO within reasonable bounds
- categoryId exists and matches type (income/expense)

### Category
- id: string
- name: string (unique within type)
- type: enum (income | expense)
- isDefault: boolean

### Summary
- period: { start: date, end: date }
- totalIncome: number
- totalExpense: number
- balance: number

### TrendPoint
- periodKey: string (e.g., YYYY-MM, YYYY‑WW, YYYY‑MM‑DD)
- expenseTotal: number

## Relationships
- Category 1—* Transaction (by categoryId)
- Transaction *—* Summary (aggregate by period)
- Transaction *—* TrendPoint (aggregate by periodKey and type=expense)

## Notes
- Default categories are seeded for both income and expense types
- No cross‑device sync in this phase; persistence is local per device

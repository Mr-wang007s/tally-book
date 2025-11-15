/**
 * Aggregates Service
 * Provides calculations for summaries, trends, and category breakdowns
 */

import { Transaction } from '@/models/transaction';
import { Category } from '@/models/category';
import { Summary, Period, createSummary } from '@/models/summary';
import { TrendPoint, Granularity, formatPeriodKey, CategoryBreakdown } from '@/models/trend';

/**
 * Filter transactions by period
 */
export function filterByPeriod(transactions: Transaction[], period: Period): Transaction[] {
  const startDate = new Date(period.start);
  const endDate = new Date(period.end);

  return transactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    return txnDate >= startDate && txnDate <= endDate;
  });
}

/**
 * Calculate summary for a period
 */
export function calculateSummary(transactions: Transaction[], period: Period): Summary {
  const filtered = filterByPeriod(transactions, period);

  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return createSummary(period, totalIncome, totalExpense);
}

/**
 * Calculate time-series trend points
 */
export function calculateTimeSeries(
  transactions: Transaction[],
  period: Period,
  granularity: Granularity
): TrendPoint[] {
  const filtered = filterByPeriod(transactions, period);

  const grouped = new Map<string, { income: number; expense: number; count: number }>();

  filtered.forEach((txn) => {
    const key = formatPeriodKey(txn.date, granularity);
    const existing = grouped.get(key) || { income: 0, expense: 0, count: 0 };

    if (txn.type === 'income') {
      existing.income += txn.amount;
    } else {
      existing.expense += txn.amount;
    }
    existing.count += 1;

    grouped.set(key, existing);
  });

  const points: TrendPoint[] = Array.from(grouped.entries())
    .map(([periodKey, data]) => ({
      periodKey,
      expenseTotal: data.expense,
      incomeTotal: data.income,
      transactionCount: data.count,
    }))
    .sort((a, b) => a.periodKey.localeCompare(b.periodKey));

  return points;
}

/**
 * Calculate category distribution (breakdown)
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  period: Period,
  type: 'income' | 'expense'
): CategoryBreakdown[] {
  const filtered = filterByPeriod(transactions, period).filter((t) => t.type === type);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const totals = new Map<string, number>();

  filtered.forEach((txn) => {
    const current = totals.get(txn.categoryId) || 0;
    totals.set(txn.categoryId, current + txn.amount);
  });

  const grandTotal = Array.from(totals.values()).reduce((sum, val) => sum + val, 0);

  const breakdown: CategoryBreakdown[] = Array.from(totals.entries())
    .map(([categoryId, total]) => {
      const category = categoryMap.get(categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Unknown',
        total,
        percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  return breakdown;
}

/**
 * Trend Point Entity
 * Represents expense data aggregated by period for trend analysis
 */

export type Granularity = 'day' | 'week' | 'month';

export interface TrendPoint {
  periodKey: string; // e.g., "2025-01", "2025-W02", "2025-01-15"
  expenseTotal: number;
  incomeTotal?: number;
  transactionCount?: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
}

/**
 * Format date to period key based on granularity
 */
export function formatPeriodKey(date: Date | string, granularity: Granularity): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  switch (granularity) {
    case 'day':
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    case 'week': {
      const weekNum = getWeekNumber(d);
      return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    }
    case 'month':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    default:
      return d.toISOString().split('T')[0];
  }
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

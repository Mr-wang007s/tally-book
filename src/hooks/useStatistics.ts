/**
 * useStatistics Hook
 * 统计计算逻辑，提供支出分析数据
 * User Story 4: 支出趋势统计与可视化
 * 遵循 Constitution Principle V (Performance - useMemo optimization)
 */

import { useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { useCategories } from './useCategories';
import type {
  Statistics,
  StatisticsQuery,
  TimeRange,
  CategoryBreakdown,
  TrendDataPoint,
} from '@/types/statistics';

/**
 * 计算时间范围的起止时间
 */
function getTimeRangeBounds(timeRange: TimeRange, customStartDate?: number, customEndDate?: number): { startDate: number; endDate: number } {
  const now = new Date();
  const endDate = customEndDate || now.getTime();
  let startDate: number;

  switch (timeRange) {
    case TimeRange.DAY:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      break;
    case TimeRange.WEEK:
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday as first day
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff).getTime();
      break;
    case TimeRange.MONTH:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      break;
    case TimeRange.YEAR:
      startDate = new Date(now.getFullYear(), 0, 1).getTime();
      break;
    default:
      startDate = customStartDate || 0;
  }

  return { startDate, endDate };
}

/**
 * 计算分类汇总
 */
function calculateCategoryBreakdown(
  expenses: any[],
  categories: any[],
  totalAmount: number
): CategoryBreakdown[] {
  const categoryMap = new Map<string, CategoryBreakdown>();

  expenses.forEach((expense) => {
    const existing = categoryMap.get(expense.categoryId);
    if (existing) {
      existing.totalAmount += expense.amount;
      existing.count += 1;
    } else {
      const category = categories.find((c) => c.id === expense.categoryId);
      categoryMap.set(expense.categoryId, {
        categoryId: expense.categoryId,
        categoryName: category?.name || '未知',
        totalAmount: expense.amount,
        count: 1,
        percentage: 0,
      });
    }
  });

  // 计算百分比并排序
  const breakdown = Array.from(categoryMap.values());
  breakdown.forEach((item) => {
    item.percentage = totalAmount > 0 ? (item.totalAmount / totalAmount) * 100 : 0;
  });

  return breakdown.sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * 计算趋势数据
 */
function calculateTrendData(expenses: any[], timeRange: TimeRange): TrendDataPoint[] {
  const dataMap = new Map<string, number>();

  expenses.forEach((expense) => {
    const date = new Date(expense.timestamp);
    let key: string;

    switch (timeRange) {
      case TimeRange.DAY:
        // 按小时分组
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        break;
      case TimeRange.WEEK:
      case TimeRange.MONTH:
        // 按天分组
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        break;
      case TimeRange.YEAR:
        // 按月分组
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    dataMap.set(key, (dataMap.get(key) || 0) + expense.amount);
  });

  const trendData = Array.from(dataMap.entries()).map(([date, amount]) => ({
    date,
    amount,
  }));

  return trendData.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * useStatistics Hook
 * 封装统计计算逻辑，使用 useMemo 优化性能
 */
export function useStatistics(query: StatisticsQuery): Statistics {
  const { expenses } = useExpenses();
  const { categories } = useCategories();

  const statistics = useMemo(() => {
    const { startDate, endDate } = getTimeRangeBounds(
      query.timeRange,
      query.customStartDate,
      query.customEndDate
    );

    // 过滤时间范围内的支出
    const filteredExpenses = expenses.filter(
      (e) => e.timestamp >= startDate && e.timestamp <= endDate
    );

    // 计算总额和平均值
    const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const averageAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;

    // 计算最高单日支出
    const dailyTotals = new Map<string, number>();
    filteredExpenses.forEach((e) => {
      const date = new Date(e.timestamp).toISOString().split('T')[0];
      dailyTotals.set(date, (dailyTotals.get(date) || 0) + e.amount);
    });
    const maxDailyAmount = Math.max(...Array.from(dailyTotals.values()), 0);

    // 计算分类汇总
    const categoryBreakdown = calculateCategoryBreakdown(filteredExpenses, categories, totalAmount);

    // 计算趋势数据
    const trendData = calculateTrendData(filteredExpenses, query.timeRange);

    return {
      timeRange: query.timeRange,
      startDate,
      endDate,
      totalAmount,
      averageAmount,
      maxDailyAmount,
      count: filteredExpenses.length,
      categoryBreakdown,
      trendData,
    };
  }, [expenses, categories, query.timeRange, query.customStartDate, query.customEndDate]);

  return statistics;
}

/**
 * 比较统计数据（当前周期 vs 上一周期）
 */
export function useStatisticsComparison(timeRange: TimeRange): {
  current: Statistics;
  previous: Statistics;
  change: {
    totalAmount: number;
    averageAmount: number;
    count: number;
  };
} {
  const currentStats = useStatistics({ timeRange });

  const { startDate, endDate } = getTimeRangeBounds(timeRange);
  const duration = endDate - startDate;
  const previousStartDate = startDate - duration;
  const previousEndDate = startDate - 1;

  const previousStats = useStatistics({
    timeRange,
    customStartDate: previousStartDate,
    customEndDate: previousEndDate,
  });

  const change = useMemo(
    () => ({
      totalAmount: currentStats.totalAmount - previousStats.totalAmount,
      averageAmount: currentStats.averageAmount - previousStats.averageAmount,
      count: currentStats.count - previousStats.count,
    }),
    [currentStats, previousStats]
  );

  return { current: currentStats, previous: previousStats, change };
}

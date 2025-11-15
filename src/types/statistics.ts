/**
 * Statistics Types
 * 统计相关的类型定义
 */

/**
 * 时间范围枚举
 */
export enum TimeRange {
  TODAY = 'today', // 今天
  WEEK = 'week', // 本周
  MONTH = 'month', // 本月
  YEAR = 'year', // 今年
  CUSTOM = 'custom', // 自定义范围
}

/**
 * 类别支出分布
 */
export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  totalAmount: number; // 总金额
  count: number; // 记录数
  percentage: number; // 占比 (0-100)
}

/**
 * 统计数据实体
 */
export interface Statistics {
  timeRange: TimeRange;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  totalExpenses: number; // 总支出
  totalRecords: number; // 记录总数
  averagePerDay: number; // 日均支出
  categoryBreakdown: CategoryBreakdown[]; // 类别分布
  dailyTrend: DailyTrend[]; // 日趋势数据
  topCategory: CategoryBreakdown | null; // 最大支出类别
}

/**
 * 日趋势数据
 */
export interface DailyTrend {
  date: string; // YYYY-MM-DD 格式
  totalAmount: number; // 当天总支出
  count: number; // 当天记录数
}

/**
 * 统计查询参数
 */
export interface StatisticsQueryParams {
  timeRange: TimeRange;
  startDate?: string; // 仅 CUSTOM 时需要
  endDate?: string; // 仅 CUSTOM 时需要
}

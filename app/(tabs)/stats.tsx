/**
 * StatisticsScreen - 统计图表页
 * User Story 4: 支出趋势统计与可视化
 * 遵循 Constitution Principles I (HIG), IV (Accessibility), V (Performance), VII (Safe Areas)
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { Card } from '@/components/ui/Card';
import { TimeRangeSelector } from '@/components/features/TimeRangeSelector';
import { CategoryPieChart } from '@/components/features/CategoryPieChart';
import { TrendLineChart } from '@/components/features/TrendLineChart';
import { ComparisonBarChart } from '@/components/features/ComparisonBarChart';
import { useTheme } from '@/hooks/useTheme';
import { useStatistics, useStatisticsComparison } from '@/hooks/useStatistics';
import { TimeRange } from '@/types/statistics';
import { formatAmount } from '@/utils/formatting';

export default function StatisticsScreen() {
  const { colors, typography, spacing } = useTheme();
  const [selectedRange, setSelectedRange] = useState<TimeRange>(TimeRange.MONTH);

  const statistics = useStatistics({ timeRange: selectedRange });
  const comparison = useStatisticsComparison(selectedRange);

  // 数据不足提示
  const hasInsufficientData = statistics.count < 3;

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* 时间范围选择器 */}
        <Card variant="flat" style={styles.selectorCard}>
          <TimeRangeSelector selected={selectedRange} onChange={setSelectedRange} />
        </Card>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 数据不足提示 */}
          {hasInsufficientData && (
            <Card variant="outlined" style={styles.warningCard}>
              <Text
                style={[
                  styles.warningText,
                  { color: colors.warning, fontSize: typography.fontSize.footnote },
                ]}
                accessibilityRole="alert"
              >
                ⚠️ 数据不足，建议至少记录 3 笔支出以获得更准确的统计分析
              </Text>
            </Card>
          )}

          {/* 总览卡片 */}
          <Card variant="elevated" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSize.footnote },
                  ]}
                >
                  总支出
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.error, fontSize: typography.fontSize.title1 },
                  ]}
                  accessibilityLabel={`总支出${formatAmount(statistics.totalAmount)}`}
                >
                  {formatAmount(statistics.totalAmount)}
                </Text>
                {comparison.change.totalAmount !== 0 && (
                  <Text
                    style={[
                      styles.changeText,
                      {
                        color: comparison.change.totalAmount > 0 ? colors.error : colors.success,
                        fontSize: typography.fontSize.caption1,
                      },
                    ]}
                  >
                    {comparison.change.totalAmount > 0 ? '↑' : '↓'}{' '}
                    {Math.abs(comparison.change.totalAmount).toFixed(2)}
                  </Text>
                )}
              </View>

              <View style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSize.footnote },
                  ]}
                >
                  平均支出
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.text, fontSize: typography.fontSize.title1 },
                  ]}
                  accessibilityLabel={`平均支出${formatAmount(statistics.averageAmount)}`}
                >
                  {formatAmount(statistics.averageAmount)}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSize.footnote },
                  ]}
                >
                  记录笔数
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.text, fontSize: typography.fontSize.title1 },
                  ]}
                  accessibilityLabel={`共${statistics.count}笔记录`}
                >
                  {statistics.count}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSize.footnote },
                  ]}
                >
                  最高单日
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.text, fontSize: typography.fontSize.title1 },
                  ]}
                  accessibilityLabel={`最高单日支出${formatAmount(statistics.maxDailyAmount)}`}
                >
                  {formatAmount(statistics.maxDailyAmount)}
                </Text>
              </View>
            </View>
          </Card>

          {/* 类别占比饼图 */}
          <Card variant="outlined" style={styles.chartCard}>
            <Text
              style={[
                styles.chartTitle,
                { color: colors.text, fontSize: typography.fontSize.headline },
              ]}
            >
              类别分布
            </Text>
            <CategoryPieChart data={statistics.categoryBreakdown} />
          </Card>

          {/* 趋势折线图 */}
          <Card variant="outlined" style={styles.chartCard}>
            <Text
              style={[
                styles.chartTitle,
                { color: colors.text, fontSize: typography.fontSize.headline },
              ]}
            >
              支出趋势
            </Text>
            <TrendLineChart data={statistics.trendData} />
          </Card>

          {/* 周期对比柱状图 */}
          <Card variant="outlined" style={styles.chartCard}>
            <Text
              style={[
                styles.chartTitle,
                { color: colors.text, fontSize: typography.fontSize.headline },
              ]}
            >
              周期对比
            </Text>
            <ComparisonBarChart
              currentData={comparison.current.categoryBreakdown}
              previousData={comparison.previous.categoryBreakdown}
            />
          </Card>

          {/* 底部间距 */}
          <View style={{ height: spacing.large }} />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectorCard: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  warningCard: {
    marginBottom: 16,
    padding: 12,
  },
  warningText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  summaryCard: {
    marginBottom: 16,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryValue: {
    fontWeight: '700',
  },
  changeText: {
    marginTop: 4,
    fontWeight: '600',
  },
  chartCard: {
    marginBottom: 16,
    padding: 16,
  },
  chartTitle: {
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
});

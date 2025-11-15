/**
 * ComparisonBarChart Component
 * 周期对比柱状图
 * User Story 4: 支出趋势统计与可视化
 * 遵循 Constitution Principles IV (Accessibility), VI (Dark Mode)
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryContainer,
  VictoryGroup,
} from 'victory-native';
import { useTheme } from '@/hooks/useTheme';
import type { CategoryBreakdown } from '@/types/statistics';

interface ComparisonBarChartProps {
  currentData: CategoryBreakdown[];
  previousData: CategoryBreakdown[];
  width?: number;
  height?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function ComparisonBarChart({
  currentData,
  previousData,
  width = SCREEN_WIDTH - 32,
  height = 300,
}: ComparisonBarChartProps) {
  const { colors, typography } = useTheme();

  // 如果没有数据，显示提示
  if (!currentData || currentData.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text
          style={[styles.emptyText, { color: colors.textSecondary, fontSize: typography.fontSize.body }]}
          accessibilityRole="text"
        >
          暂无对比数据
        </Text>
      </View>
    );
  }

  // 合并类别（确保两个周期的类别一致）
  const allCategories = new Set([
    ...currentData.map((d) => d.categoryName),
    ...previousData.map((d) => d.categoryName),
  ]);

  // 准备当前周期数据
  const currentChartData = Array.from(allCategories).map((categoryName) => {
    const item = currentData.find((d) => d.categoryName === categoryName);
    return {
      x: categoryName,
      y: item?.totalAmount || 0,
    };
  });

  // 准备上一周期数据
  const previousChartData = Array.from(allCategories).map((categoryName) => {
    const item = previousData.find((d) => d.categoryName === categoryName);
    return {
      x: categoryName,
      y: item?.totalAmount || 0,
    };
  });

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="周期对比柱状图"
      accessibilityHint={`对比当前周期和上一周期的${allCategories.size}个类别支出`}
    >
      {/* 图例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.text, fontSize: typography.fontSize.footnote }]}>
            当前周期
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.textSecondary }]} />
          <Text style={[styles.legendText, { color: colors.text, fontSize: typography.fontSize.footnote }]}>
            上一周期
          </Text>
        </View>
      </View>

      <VictoryChart
        width={width}
        height={height}
        theme={VictoryTheme.material}
        containerComponent={<VictoryContainer responsive={false} />}
        domainPadding={{ x: 20 }}
        padding={{ top: 20, bottom: 60, left: 50, right: 20 }}
      >
        {/* X轴 */}
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: {
              fill: colors.textSecondary,
              fontSize: 10,
              angle: -45,
              textAnchor: 'end',
            },
            grid: { stroke: 'transparent' },
          }}
        />

        {/* Y轴 */}
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: {
              fill: colors.textSecondary,
              fontSize: 10,
            },
            grid: { stroke: colors.border, strokeDasharray: '4,4', opacity: 0.3 },
          }}
          tickFormat={(t) => `¥${t}`}
        />

        {/* 柱状图组 */}
        <VictoryGroup offset={15} colorScale={[colors.primary, colors.textSecondary]}>
          <VictoryBar data={currentChartData} barWidth={12} />
          <VictoryBar data={previousChartData} barWidth={12} />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontWeight: '500',
  },
});

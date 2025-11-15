/**
 * CategoryPieChart Component
 * 类别占比饼图
 * User Story 4: 支出趋势统计与可视化
 * 遵循 Constitution Principles IV (Accessibility), VI (Dark Mode)
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryPie, VictoryContainer, VictoryLabel } from 'victory-native';
import { useTheme } from '@/hooks/useTheme';
import type { CategoryBreakdown } from '@/types/statistics';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
  width?: number;
  height?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function CategoryPieChart({
  data,
  width = SCREEN_WIDTH - 32,
  height = 300,
}: CategoryPieChartProps) {
  const { colors, typography } = useTheme();

  // 如果没有数据，显示提示
  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text
          style={[styles.emptyText, { color: colors.textSecondary, fontSize: typography.fontSize.body }]}
          accessibilityRole="text"
        >
          暂无数据
        </Text>
      </View>
    );
  }

  // 准备图表数据
  const chartData = data.map((item, index) => ({
    x: item.categoryName,
    y: item.totalAmount,
    label: `${item.categoryName}\n¥${item.totalAmount.toFixed(2)}\n${item.percentage.toFixed(1)}%`,
  }));

  // 颜色方案（自动适配深色模式）
  const colorScale = [
    colors.primary,
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
  ];

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="支出类别分布饼图"
      accessibilityHint={`共${data.length}个类别，总计${chartData.reduce((sum, d) => sum + d.y, 0).toFixed(2)}元`}
    >
      <VictoryPie
        data={chartData}
        width={width}
        height={height}
        colorScale={colorScale}
        innerRadius={50}
        labelRadius={({ innerRadius }) => (innerRadius as number) + 30}
        style={{
          labels: {
            fill: colors.text,
            fontSize: 10,
            fontWeight: '600',
          },
          data: {
            stroke: colors.background,
            strokeWidth: 2,
          },
        }}
        labels={({ datum }) => datum.label}
        containerComponent={<VictoryContainer responsive={false} />}
      />
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
});

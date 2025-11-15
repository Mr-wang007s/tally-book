/**
 * TrendLineChart Component
 * 每日支出趋势折线图
 * User Story 4: 支出趋势统计与可视化
 * 遵循 Constitution Principles IV (Accessibility), VI (Dark Mode)
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryContainer,
  VictoryScatter,
} from 'victory-native';
import { useTheme } from '@/hooks/useTheme';
import type { TrendDataPoint } from '@/types/statistics';

interface TrendLineChartProps {
  data: TrendDataPoint[];
  width?: number;
  height?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function TrendLineChart({
  data,
  width = SCREEN_WIDTH - 32,
  height = 250,
}: TrendLineChartProps) {
  const { colors, typography } = useTheme();

  // 如果没有数据，显示提示
  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text
          style={[styles.emptyText, { color: colors.textSecondary, fontSize: typography.fontSize.body }]}
          accessibilityRole="text"
        >
          暂无趋势数据
        </Text>
      </View>
    );
  }

  // 准备图表数据
  const chartData = data.map((item) => ({
    x: item.date,
    y: item.amount,
  }));

  // 格式化日期标签
  const formatDate = (date: string) => {
    const parts = date.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`; // MM/DD
    } else if (parts.length === 2) {
      return `${parts[1]}月`; // MM月
    }
    return date;
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="支出趋势折线图"
      accessibilityHint={`显示${data.length}天的支出趋势`}
    >
      <VictoryChart
        width={width}
        height={height}
        theme={VictoryTheme.material}
        containerComponent={<VictoryContainer responsive={false} />}
        padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
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
          tickFormat={(t) => formatDate(t)}
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

        {/* 折线 */}
        <VictoryLine
          data={chartData}
          style={{
            data: {
              stroke: colors.primary,
              strokeWidth: 2,
            },
          }}
          interpolation="monotoneX"
        />

        {/* 数据点 */}
        <VictoryScatter
          data={chartData}
          size={4}
          style={{
            data: {
              fill: colors.primary,
            },
          }}
        />
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
});

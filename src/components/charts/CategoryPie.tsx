/**
 * CategoryPie Component
 * Simple list-based category breakdown (pie chart alternative for simplicity)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CategoryBreakdown } from '@/models/trend';
import { colors, typography, spacing, radius } from '@/theme/tokens';

export interface CategoryPieProps {
  data: CategoryBreakdown[];
  type?: 'income' | 'expense';
}

export function CategoryPie({ data, type = 'expense' }: CategoryPieProps) {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const color = type === 'income' ? colors.success : colors.error;

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View
          key={item.categoryId}
          style={styles.item}
          accessible={true}
          accessibilityLabel={`${item.categoryName}: $${item.total.toFixed(2)}, ${item.percentage.toFixed(1)}%`}
          accessibilityRole="summary"
        >
          <View style={styles.itemLeft}>
            <View style={[styles.dot, { backgroundColor: getColor(index, color) }]} />
            <Text style={styles.categoryName}>{item.categoryName}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.amount}>${item.total.toFixed(2)}</Text>
            <Text style={styles.percentage}>{item.percentage.toFixed(1)}%</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function getColor(index: number, baseColor: string): string {
  // Generate variations of the base color for different categories
  const colors_list = [
    baseColor,
    '#8E8E93',
    '#5AC8FA',
    '#FF9500',
    '#AF52DE',
    '#FF2D55',
    '#5856D6',
    '#34C759',
  ];
  return colors_list[index % colors_list.length];
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.md,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryName: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  percentage: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginTop: 2,
  },
  empty: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

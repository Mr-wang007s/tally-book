/**
 * TimeSeries Chart Component
 * Simple bar chart for time-series data
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendPoint } from '@/models/trend';
import { colors, typography, spacing } from '@/theme/tokens';

export interface TimeSeriesProps {
  data: TrendPoint[];
  type?: 'income' | 'expense';
}

export function TimeSeries({ data, type = 'expense' }: TimeSeriesProps) {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.expenseTotal || 0));
  const color = type === 'income' ? colors.success : colors.error;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((point) => {
          const height = maxValue > 0 ? (point.expenseTotal / maxValue) * 150 : 0;
          return (
            <View key={point.periodKey} style={styles.barContainer}>
              <View
                style={[styles.bar, { height, backgroundColor: color }]}
                accessible={true}
                accessibilityLabel={`${point.periodKey}: $${point.expenseTotal.toFixed(2)}`}
              />
              <Text style={styles.label} numberOfLines={1}>
                {formatLabel(point.periodKey)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function formatLabel(periodKey: string): string {
  // YYYY-MM-DD -> DD
  // YYYY-MM -> MM
  // YYYY-WXX -> WXX
  if (periodKey.includes('W')) {
    return periodKey.split('-')[1]; // W01, W02, etc.
  }
  const parts = periodKey.split('-');
  if (parts.length === 3) {
    return parts[2]; // Day
  }
  if (parts.length === 2) {
    return parts[1]; // Month
  }
  return periodKey;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    paddingHorizontal: spacing.xs,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  bar: {
    width: '100%',
    minHeight: 2,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption2,
    color: colors.textTertiary,
    fontSize: 10,
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

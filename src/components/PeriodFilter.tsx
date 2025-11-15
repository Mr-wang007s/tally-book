/**
 * PeriodFilter Component
 * Allows users to filter by period (month/week/custom)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { Period } from '@/models/summary';
import { buttonA11y } from './A11y';

export type PeriodType = 'month' | 'week' | 'custom';

export interface PeriodFilterProps {
  onPeriodChange: (period: Period) => void;
  initialType?: PeriodType;
}

export function PeriodFilter({ onPeriodChange, initialType = 'month' }: PeriodFilterProps) {
  const [selectedType, setSelectedType] = useState<PeriodType>(initialType);

  const handlePeriodTypeChange = (type: PeriodType) => {
    setSelectedType(type);

    const now = new Date();
    let start: Date;
    let end: Date;

    switch (type) {
      case 'week':
        // Current week (Mon-Sun)
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        start = new Date(now.setDate(diff));
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;

      case 'month':
        // Current month
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;

      case 'custom':
        // Last 30 days for custom
        end = new Date();
        end.setHours(23, 59, 59, 999);
        start = new Date();
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        break;

      default:
        return;
    }

    onPeriodChange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selectedType === 'month' && styles.buttonActive]}
        onPress={() => handlePeriodTypeChange('month')}
        {...buttonA11y('This Month', 'Filter by current month')}
      >
        <Text style={[styles.buttonText, selectedType === 'month' && styles.buttonTextActive]}>
          Month
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedType === 'week' && styles.buttonActive]}
        onPress={() => handlePeriodTypeChange('week')}
        {...buttonA11y('This Week', 'Filter by current week')}
      >
        <Text style={[styles.buttonText, selectedType === 'week' && styles.buttonTextActive]}>
          Week
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedType === 'custom' && styles.buttonActive]}
        onPress={() => handlePeriodTypeChange('custom')}
        {...buttonA11y('Last 30 Days', 'Filter by last 30 days')}
      >
        <Text style={[styles.buttonText, selectedType === 'custom' && styles.buttonTextActive]}>
          Last 30D
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    ...typography.callout,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: colors.textOnPrimary,
  },
});

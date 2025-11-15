/**
 * TrendControls Component
 * Controls for selecting range and granularity for trends
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { Granularity } from '@/models/trend';
import { buttonA11y } from './A11y';

export interface TrendControlsProps {
  granularity: Granularity;
  onGranularityChange: (granularity: Granularity) => void;
}

export function TrendControls({ granularity, onGranularityChange }: TrendControlsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time Range</Text>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, granularity === 'day' && styles.buttonActive]}
          onPress={() => onGranularityChange('day')}
          {...buttonA11y('Day', 'View daily trends')}
        >
          <Text style={[styles.buttonText, granularity === 'day' && styles.buttonTextActive]}>
            Day
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, granularity === 'week' && styles.buttonActive]}
          onPress={() => onGranularityChange('week')}
          {...buttonA11y('Week', 'View weekly trends')}
        >
          <Text style={[styles.buttonText, granularity === 'week' && styles.buttonTextActive]}>
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, granularity === 'month' && styles.buttonActive]}
          onPress={() => onGranularityChange('month')}
          {...buttonA11y('Month', 'View monthly trends')}
        >
          <Text style={[styles.buttonText, granularity === 'month' && styles.buttonTextActive]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.subhead,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.md,
    padding: spacing.xs,
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

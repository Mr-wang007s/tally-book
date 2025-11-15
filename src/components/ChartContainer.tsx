/**
 * ChartContainer Component
 * Wrapper for chart components with consistent styling
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius, shadows } from '@/theme/tokens';

export interface ChartContainerProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
  accessibilityLabel?: string;
}

export function ChartContainer({
  title,
  subtitle,
  children,
  accessibilityLabel,
}: ChartContainerProps) {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="summary"
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    minHeight: 200,
  },
});

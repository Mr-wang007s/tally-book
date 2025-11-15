/**
 * Card Component
 * 遵循 Constitution Principle I (HIG) 和 VI (Dark Mode)
 */

import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  padding?: number;
}

export function Card({
  children,
  variant = 'default',
  padding,
  style,
  ...props
}: CardProps) {
  const { colors, spacing } = useTheme();

  const cardStyles = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderRadius: spacing.borderRadius.lg,
      padding: padding !== undefined ? padding : spacing.cardPadding,
    },
    variant === 'elevated' && {
      ...spacing.shadow.md,
      shadowColor: colors.shadow,
    },
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

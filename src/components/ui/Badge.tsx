/**
 * Badge Component (shadcn-like pattern)
 * Reusable badge for category/tag display with variant support
 * 
 * @module src/components/ui/Badge
 */

import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '@/tokens';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface BadgeProps {
  /** Badge text */
  label: string;
  
  /** Visual variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  
  /** Custom style */
  style?: ViewStyle;
  
  /** Test ID */
  testID?: string;
}

/**
 * Badge component for categories and tags
 * 
 * @example
 * ```tsx
 * <Badge label="Food" variant="primary" size="md" />
 * <Badge label="Complete" variant="success" size="sm" />
 * ```
 */
export function Badge({ 
  label, 
  variant = 'default', 
  size = 'md',
  style,
  testID,
}: BadgeProps) {
  const { colorScheme } = useColorScheme();
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;

  const variantStyles = {
    default: {
      backgroundColor: themeColors.categoryBackground,
      textColor: themeColors.textPrimary,
      borderColor: themeColors.categoryBorder,
    },
    primary: {
      backgroundColor: themeColors.primary,
      textColor: themeColors.textInverted,
      borderColor: themeColors.primary,
    },
    success: {
      backgroundColor: themeColors.success,
      textColor: themeColors.textInverted,
      borderColor: themeColors.success,
    },
    warning: {
      backgroundColor: themeColors.warning,
      textColor: themeColors.textInverted,
      borderColor: themeColors.warning,
    },
    error: {
      backgroundColor: themeColors.error,
      textColor: themeColors.textInverted,
      borderColor: themeColors.error,
    },
    info: {
      backgroundColor: themeColors.info,
      textColor: themeColors.textInverted,
      borderColor: themeColors.info,
    },
  }[variant];

  const sizeStyles = {
    sm: {
      paddingHorizontal: spacing.xxs,
      paddingVertical: spacing.xxxs,
      fontSize: typography.caption2.fontSize,
      borderRadius: 4,
    },
    md: {
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      fontSize: typography.caption1.fontSize,
      borderRadius: 6,
    },
    lg: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      fontSize: typography.callout.fontSize,
      borderRadius: 8,
    },
  }[size];

  const containerStyle: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderRadius: sizeStyles.borderRadius,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    paddingVertical: sizeStyles.paddingVertical,
    borderWidth: 1,
    borderColor: variantStyles.borderColor,
    alignSelf: 'flex-start', // Only take up space needed
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    color: variantStyles.textColor,
  };

  return (
    <View style={containerStyle} testID={testID}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

export default Badge;

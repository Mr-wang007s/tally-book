/**
 * Button Component
 * 遵循 Constitution Principles I (HIG), IV (Accessibility)
 * 触摸目标 ≥44pt, accessibilityRole="button"
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  ...props
}: ButtonProps) {
  const { colors, typography, spacing } = useTheme();

  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    {
      backgroundColor:
        variant === 'primary'
          ? colors.primary
          : variant === 'secondary'
          ? colors.backgroundSecondary
          : variant === 'outline'
          ? 'transparent'
          : 'transparent',
      borderWidth: variant === 'outline' ? spacing.borderWidth.regular : 0,
      borderColor: variant === 'outline' ? colors.border : 'transparent',
      minHeight: spacing.touchTarget,
      paddingHorizontal:
        size === 'small'
          ? spacing.md
          : size === 'large'
          ? spacing.xl
          : spacing.lg,
      paddingVertical:
        size === 'small' ? spacing.sm : size === 'large' ? spacing.md : spacing.sm,
      borderRadius: spacing.borderRadius.md,
      opacity: isDisabled ? 0.5 : 1,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color:
        variant === 'primary'
          ? '#FFFFFF'
          : variant === 'secondary' || variant === 'outline'
          ? colors.text
          : colors.primary,
      fontSize:
        size === 'small'
          ? typography.fontSize.callout
          : size === 'large'
          ? typography.fontSize.headline
          : typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold,
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : colors.primary}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    textAlign: 'center',
  },
});

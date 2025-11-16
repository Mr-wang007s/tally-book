/**
 * Button Component (shadcn-like pattern)
 * Reusable button primitive with variants, sizes, and haptic feedback
 * 
 * @module src/components/ui/Button
 */

import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography } from '@/tokens';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface ButtonProps {
  /** Button text */
  title: string;
  
  /** Press handler */
  onPress: () => void | Promise<void>;
  
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  
  /** Loading state */
  loading?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Haptic feedback intensity */
  hapticFeedback?: 'light' | 'medium' | 'heavy' | false;
  
  /** Custom style */
  style?: ViewStyle;
  
  /** Test ID for testing */
  testID?: string;
  
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Primary button component with haptic feedback
 * 
 * @example
 * ```tsx
 * <Button
 *   title="Save"
 *   onPress={handleSave}
 *   variant="primary"
 *   loading={isSaving}
 *   hapticFeedback="medium"
 * />
 * ```
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  hapticFeedback = 'medium',
  style,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const { colorScheme } = useColorScheme();
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;

  const handlePress = async () => {
    if (disabled || loading) return;

    // Trigger haptic feedback
    if (hapticFeedback) {
      try {
        const feedbackStyle =
          hapticFeedback === 'light'
            ? Haptics.ImpactFeedbackStyle.Light
            : hapticFeedback === 'heavy'
              ? Haptics.ImpactFeedbackStyle.Heavy
              : Haptics.ImpactFeedbackStyle.Medium;
        await Haptics.impactAsync(feedbackStyle);
      } catch (e) {
        // Graceful fallback if haptics not supported
        console.warn('Haptic feedback not supported:', e);
      }
    }

    await onPress();
  };

  // Size-based styling
  const sizeStyles = {
    sm: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      fontSize: typography.callout.fontSize,
    },
    md: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: typography.body.fontSize,
    },
    lg: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: typography.headline.fontSize,
    },
  }[size];

  // Variant-based styling
  const variantStyles = {
    primary: {
      backgroundColor: themeColors.primary,
      textColor: themeColors.textInverted,
    },
    secondary: {
      backgroundColor: themeColors.surface,
      textColor: themeColors.primary,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: themeColors.primary,
    },
    destructive: {
      backgroundColor: themeColors.error,
      textColor: themeColors.textInverted,
    },
  }[variant];

  const containerStyle: ViewStyle = {
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: 8,
    opacity: disabled || loading ? 0.5 : 1,
    backgroundColor: variantStyles.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Accessibility: minimum touch target
    ...('borderWidth' in variantStyles && { borderWidth: variantStyles.borderWidth }),
    ...('borderColor' in variantStyles && { borderColor: variantStyles.borderColor }),
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    color: variantStyles.textColor,
    textAlign: 'center',
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export default Button;

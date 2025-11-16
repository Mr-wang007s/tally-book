/**
 * Enhanced Button Component
 * Supports multiple variants, sizes, and haptic feedback
 * Fully accessible with proper hit targets and labels
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  Text,
  AccessibilityRole,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Button label */
  label: string;
  /** Leading icon element */
  leadingIcon?: React.ReactNode;
  /** Trailing icon element */
  trailingIcon?: React.ReactNode;
  /** Is button loading */
  isLoading?: boolean;
  /** Is button disabled */
  disabled?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Trigger haptic feedback on press */
  hapticFeedback?: boolean;
  /** Haptic type ('light' | 'medium' | 'heavy') */
  hapticType?: 'light' | 'medium' | 'heavy';
  /** Custom children */
  children?: React.ReactNode;
}

/**
 * Button component - styled pressable with variants and haptics
 */
export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      label,
      leadingIcon,
      trailingIcon,
      isLoading = false,
      disabled = false,
      containerStyle,
      textStyle,
      hapticFeedback = true,
      hapticType = 'light',
      children,
      onPress,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { triggerImpact } = useHaptics();

    const pressScale = useSharedValue(1);

    // Get button styling based on variant
    const getButtonStyles = (): {
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    } => {
      const baseColor = theme.colors;

      switch (variant) {
        case 'primary':
          return {
            backgroundColor: baseColor.primary,
            borderColor: baseColor.primary,
            borderWidth: 0,
          };
        case 'secondary':
          return {
            backgroundColor: baseColor.surface,
            borderColor: baseColor.primary,
            borderWidth: 1.5,
          };
        case 'tertiary':
          return {
            backgroundColor: baseColor.backgroundSecondary,
            borderColor: baseColor.border,
            borderWidth: 1,
          };
        case 'destructive':
          return {
            backgroundColor: baseColor.error,
            borderColor: baseColor.error,
            borderWidth: 0,
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
          };
        default:
          return {
            backgroundColor: baseColor.primary,
            borderColor: baseColor.primary,
            borderWidth: 0,
          };
      }
    };

    // Get text color based on variant
    const getTextColor = (): string => {
      const baseColor = theme.colors;

      switch (variant) {
        case 'primary':
        case 'destructive':
          return baseColor.textOnPrimary;
        case 'secondary':
        case 'tertiary':
        case 'ghost':
          return baseColor.textPrimary;
        default:
          return baseColor.textOnPrimary;
      }
    };

    // Get button dimensions based on size
    const getSizeStyles = (): { height: number; paddingHorizontal: number; fontSize: number } => {
      switch (size) {
        case 'small':
          return { height: 36, paddingHorizontal: 12, fontSize: 14 };
        case 'large':
          return { height: 52, paddingHorizontal: 24, fontSize: 18 };
        case 'medium':
        default:
          return { height: 44, paddingHorizontal: 16, fontSize: 16 };
      }
    };

    const buttonStyles = getButtonStyles();
    const textColor = getTextColor();
    const sizeStyles = getSizeStyles();

    // Handle press with haptics
    const handlePress = useCallback(
      (e: any) => {
        if (disabled || isLoading) return;

        if (hapticFeedback) {
          triggerImpact(hapticType);
        }

        pressScale.value = withTiming(0.95, {
          duration: 100,
          easing: Easing.inOut(Easing.ease),
        });

        setTimeout(() => {
          pressScale.value = withTiming(1, {
            duration: 100,
            easing: Easing.inOut(Easing.ease),
          });
        }, 100);

        onPress?.(e);
      },
      [disabled, isLoading, hapticFeedback, hapticType, triggerImpact, onPress, pressScale]
    );

    // Animated press style
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: pressScale.value }],
      };
    });

    return (
      <Animated.View
        ref={ref}
        style={[
          {
            minHeight: sizeStyles.height,
            borderRadius: sizeStyles.height / 2,
          },
          animatedStyle,
        ]}
      >
        <Pressable
          onPress={handlePress}
          disabled={disabled || isLoading}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: disabled || isLoading }}
          style={({ pressed }) => [
            {
              backgroundColor: buttonStyles.backgroundColor,
              borderColor: buttonStyles.borderColor,
              borderWidth: buttonStyles.borderWidth,
              borderRadius: sizeStyles.height / 2,
              height: sizeStyles.height,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
            },
            containerStyle,
          ]}
          {...props}
        >
          {leadingIcon && <View style={{ marginRight: 8 }}>{leadingIcon}</View>}

          {isLoading ? (
            <Text style={{ color: textColor, opacity: 0.5 }}>...</Text>
          ) : children ? (
            children
          ) : (
            <Text
              style={[
                {
                  color: textColor,
                  fontSize: sizeStyles.fontSize,
                  fontWeight: '600',
                  textAlign: 'center',
                },
                textStyle,
              ]}
            >
              {label}
            </Text>
          )}

          {trailingIcon && <View style={{ marginLeft: 8 }}>{trailingIcon}</View>}
        </Pressable>
      </Animated.View>
    );
  }
);

Button.displayName = 'Button';

/**
 * Button group for multiple related buttons
 */
export interface ButtonGroupProps {
  buttons: Array<Omit<ButtonProps, 'ref'>>;
  layout?: 'horizontal' | 'vertical';
  gap?: number;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttons,
  layout = 'vertical',
  gap = 12,
}) => {
  return (
    <View
      style={{
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        gap,
      }}
    >
      {buttons.map((button, index) => (
        <Button key={index} {...button} />
      ))}
    </View>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

/**
 * Export as default
 */
export default Button;

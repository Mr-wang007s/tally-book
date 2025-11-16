/**
 * IconButton Component
 * Compact button with icon only, supports multiple variants and sizes
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export type IconButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type IconButtonSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Button variant */
  variant?: IconButtonVariant;
  /** Button size */
  size?: IconButtonSize;
  /** Background shape */
  shape?: 'circle' | 'square' | 'rounded';
  /** Is button disabled */
  disabled?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Haptic feedback on press */
  hapticFeedback?: boolean;
  /** Haptic type */
  hapticType?: 'light' | 'medium' | 'heavy';
  /** Badge count or indicator */
  badge?: number | string;
  /** Badge color */
  badgeColor?: string;
}

/**
 * IconButton component - icon-only pressable button
 */
export const IconButton = React.forwardRef<View, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      size = 'medium',
      shape = 'circle',
      disabled = false,
      containerStyle,
      hapticFeedback = true,
      hapticType = 'light',
      badge,
      badgeColor,
      onPress,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { triggerImpact } = useHaptics();
    const pressScale = useSharedValue(1);

    // Size configurations
    const getSizeValue = (): number => {
      switch (size) {
        case 'small':
          return 32;
        case 'large':
          return 48;
        case 'extra-large':
          return 56;
        case 'medium':
        default:
          return 40;
      }
    };

    // Get background color
    const getBackgroundColor = (): string => {
      switch (variant) {
        case 'primary':
          return theme.colors.primary;
        case 'secondary':
          return theme.colors.backgroundSecondary;
        case 'destructive':
          return theme.colors.error;
        case 'ghost':
        default:
          return 'transparent';
      }
    };

    // Get icon color
    const getIconColor = (): string => {
      switch (variant) {
        case 'primary':
        case 'destructive':
          return theme.colors.textOnPrimary;
        case 'secondary':
          return theme.colors.textPrimary;
        case 'ghost':
        default:
          return theme.colors.textPrimary;
      }
    };

    const sizeValue = getSizeValue();

    const handlePress = useCallback(
      (e: any) => {
        if (disabled) return;

        if (hapticFeedback) {
          triggerImpact(hapticType);
        }

        pressScale.value = withTiming(0.9, {
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
      [disabled, hapticFeedback, hapticType, triggerImpact, onPress, pressScale]
    );

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressScale.value }],
    }));

    const backgroundColor = getBackgroundColor();
    const iconColor = getIconColor();

    // Get border radius based on shape
    const getBorderRadius = (): number => {
      switch (shape) {
        case 'square':
          return 0;
        case 'rounded':
          return 8;
        case 'circle':
        default:
          return sizeValue / 2;
      }
    };

    const borderRadius = getBorderRadius();

    return (
      <Animated.View
        ref={ref}
        style={[
          {
            width: sizeValue,
            height: sizeValue,
            borderRadius,
          },
          animatedStyle,
        ]}
      >
        <Pressable
          onPress={handlePress}
          disabled={disabled || false}
          accessibilityRole="button"
          accessibilityState={{ disabled: disabled || false }}
          style={({ pressed }) => [
            {
              width: sizeValue,
              height: sizeValue,
              borderRadius,
              backgroundColor,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
            },
            containerStyle,
          ]}
          {...props}
        >
          {/* Icon */}
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {typeof icon === 'string' ? (
              <Text style={{ fontSize: sizeValue * 0.5, color: iconColor }}>
                {icon}
              </Text>
            ) : (
              icon
            )}
          </View>

          {/* Badge */}
          {badge !== undefined && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: badgeColor || theme.colors.error,
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: theme.colors.surface,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: theme.colors.textOnPrimary,
                }}
              >
                {badge}
              </Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  }
);

IconButton.displayName = 'IconButton';

// Add missing import
import { Text } from 'react-native';

export default IconButton;

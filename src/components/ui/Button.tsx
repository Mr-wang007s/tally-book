/**
 * Button Component (shadcn-like pattern)
 * Reusable button primitive with variants, sizes, and haptic feedback
 */

import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/hooks/useTheme';

export interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  hapticFeedback?: 'light' | 'medium' | 'heavy';
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  hapticFeedback = 'medium',
  style,
  testID,
  accessibilityLabel
}: ButtonProps) {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = React.useState(false);

  const handlePress = async () => {
    if (isDisabled || isLoading) return;

    // Haptic feedback
    if (hapticFeedback) {
      try {
        const style =
          hapticFeedback === 'light'
            ? Haptics.ImpactFeedbackStyle.Light
            : hapticFeedback === 'heavy'
              ? Haptics.ImpactFeedbackStyle.Heavy
              : Haptics.ImpactFeedbackStyle.Medium;
        await Haptics.impactAsync(style);
      } catch (e) {
        // Graceful fallback
      }
    }

    await onPress();
  };

  const containerStyle: ViewStyle = {
    paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
    paddingHorizontal: size === 'sm' ? 12 : size === 'lg' ? 24 : 16,
    borderRadius: 8,
    opacity: isDisabled || isLoading ? 0.5 : 1,
    ...style
  };

  const backgroundColor = {
    primary: colors.primary,
    secondary: colors.secondary,
    ghost: 'transparent',
    destructive: colors.error
  }[variant];

  const textColor = {
    primary: 'white',
    secondary: colors.primary,
    ghost: colors.primary,
    destructive: 'white'
  }[variant];

  const textStyle: TextStyle = {
    fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
    fontWeight: '600',
    color: textColor,
    textAlign: 'center'
  };

  return (
    <TouchableOpacity
      style={[containerStyle, { backgroundColor }]}
      onPress={handlePress}
      disabled={isDisabled || isLoading}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      {isLoading ? (
        <Text style={textStyle}>加载中...</Text>
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export default Button;

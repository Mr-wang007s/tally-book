/**
 * Card Component (shadcn-like pattern)
 * Reusable card container with elevation and padding variants
 * 
 * @module src/components/ui/Card
 */

import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, spacing, elevations } from '@/tokens';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  
  /** Elevation level (0-5) */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /** Press handler (makes card pressable) */
  onPress?: () => void;
  
  /** Disabled state (for pressable cards) */
  disabled?: boolean;
  
  /** Custom style */
  style?: ViewStyle;
  
  /** Test ID */
  testID?: string;
  
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Card container component with elevation
 * 
 * @example
 * ```tsx
 * // Static card
 * <Card elevation={2} padding="md">
 *   <Text>Card content</Text>
 * </Card>
 * 
 * // Pressable card
 * <Card elevation={1} onPress={handlePress}>
 *   <Text>Tap me</Text>
 * </Card>
 * ```
 */
export function Card({
  children,
  elevation = 1,
  padding = 'md',
  onPress,
  disabled,
  style,
  testID,
  accessibilityLabel,
}: CardProps) {
  const { colorScheme } = useColorScheme();
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;

  const paddingValue = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  }[padding];

  const elevationStyle = elevation > 0 ? elevations[`elevation${elevation}`] : {};

  const containerStyle: ViewStyle = {
    backgroundColor: themeColors.surface,
    borderRadius: 12,
    padding: paddingValue,
    ...elevationStyle,
    ...style,
  };

  // If onPress is provided, render as pressable
  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || false }}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Otherwise, render as static view
  return (
    <View 
      style={containerStyle} 
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}

export default Card;

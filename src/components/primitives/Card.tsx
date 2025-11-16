/**
 * Card Component
 * Elevated container with shadow and border radius
 * Supports multiple elevation levels and interactive states
 */

import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

export type CardElevation = 'none' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
export type CardVariant = 'outlined' | 'elevated' | 'filled';

export interface CardProps extends ViewProps {
  /** Elevation level (shadow depth) */
  elevation?: CardElevation;
  /** Visual variant */
  variant?: CardVariant;
  /** Border radius */
  borderRadius?: number;
  /** Enable press feedback */
  onPress?: (event: GestureResponderEvent) => void;
  /** Add interactive press animation */
  interactive?: boolean;
  /** Custom padding */
  padding?: number;
  /** Custom children */
  children?: React.ReactNode;
}

/**
 * Get shadow style based on elevation level
 */
function getShadowStyle(elevation: CardElevation, theme: any): ViewStyle {
  const isDark = theme.isDark;

  switch (elevation) {
    case 'level1':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: 2,
        elevation: 2,
      };
    case 'level2':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.25 : 0.12,
        shadowRadius: 4,
        elevation: 4,
      };
    case 'level3':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.3 : 0.15,
        shadowRadius: 8,
        elevation: 8,
      };
    case 'level4':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.35 : 0.18,
        shadowRadius: 12,
        elevation: 12,
      };
    case 'level5':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isDark ? 0.4 : 0.2,
        shadowRadius: 16,
        elevation: 16,
      };
    case 'none':
    default:
      return {
        shadowOpacity: 0,
        elevation: 0,
      };
  }
}

/**
 * Card component - elevated container with customizable elevation
 */
export const Card = React.forwardRef<View, CardProps>(
  (
    {
      elevation = 'level2',
      variant = 'elevated',
      borderRadius = 12,
      onPress,
      interactive = !!onPress,
      padding = 16,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const pressScale = useSharedValue(1);

    const shadowStyle = getShadowStyle(elevation, theme);

    // Get background color based on variant
    const getBackgroundColor = (): string => {
      switch (variant) {
        case 'outlined':
          return theme.colors.surface;
        case 'filled':
          return theme.colors.surfaceElevated;
        case 'elevated':
        default:
          return theme.colors.surface;
      }
    };

    // Get border style based on variant
    const getBorderStyle = (): any => {
      switch (variant) {
        case 'outlined':
          return {
            borderWidth: 1,
            borderColor: theme.colors.border,
          };
        case 'filled':
        case 'elevated':
        default:
          return { borderWidth: 0 };
      }
    };

    const handlePressIn = () => {
      if (interactive) {
        pressScale.value = withTiming(0.98, {
          duration: 100,
          easing: Easing.inOut(Easing.ease),
        });
      }
    };

    const handlePressOut = () => {
      if (interactive) {
        pressScale.value = withTiming(1, {
          duration: 100,
          easing: Easing.inOut(Easing.ease),
        });
      }
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: pressScale.value }],
      };
    });

    const borderStyle = getBorderStyle();
    const backgroundColor = getBackgroundColor();

    const CardContainer = onPress ? Animated.createAnimatedComponent(Pressable) : Animated.View;

    return (
      <Animated.View
        ref={ref}
        style={[
          {
            borderRadius,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}
      >
        <View
          style={[
            {
              backgroundColor,
              borderRadius,
              padding,
              ...shadowStyle,
              ...borderStyle,
            },
            style,
          ]}
          {...(onPress
            ? {
                onPress,
                onPressIn: handlePressIn,
                onPressOut: handlePressOut,
                accessible: true,
                accessibilityRole: 'button',
              }
            : {})}
          {...props}
        >
          {children}
        </View>
      </Animated.View>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card variants for common use cases
 */
export const cardVariants = {
  standard: {
    elevation: 'level2' as const,
    variant: 'elevated' as const,
    borderRadius: 12,
    padding: 16,
  },
  outlined: {
    elevation: 'none' as const,
    variant: 'outlined' as const,
    borderRadius: 12,
    padding: 16,
  },
  filled: {
    elevation: 'none' as const,
    variant: 'filled' as const,
    borderRadius: 12,
    padding: 16,
  },
  minimal: {
    elevation: 'level1' as const,
    variant: 'elevated' as const,
    borderRadius: 8,
    padding: 12,
  },
};

/**
 * Section card - card with title and content
 */
export interface SectionCardProps extends CardProps {
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const SectionCard = React.forwardRef<View, SectionCardProps>(
  (
    {
      title,
      subtitle,
      actionButton,
      children,
      elevation = 'level1',
      padding = 16,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <Card ref={ref} elevation={elevation} padding={0} {...props}>
        {(title || subtitle || actionButton) && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: padding,
              paddingTop: padding,
              paddingBottom: subtitle ? padding / 2 : padding,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.divider,
            }}
          >
            <View style={{ flex: 1 }}>
              {title && (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.colors.textPrimary,
                  }}
                >
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.textSecondary,
                    marginTop: 4,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </View>
            {actionButton && <View style={{ marginLeft: 12 }}>{actionButton}</View>}
          </View>
        )}
        <View style={{ padding }}>
          {children}
        </View>
      </Card>
    );
  }
);

SectionCard.displayName = 'SectionCard';

/**
 * Grid card - for grid layouts
 */
export interface GridCardProps extends CardProps {
  title?: string;
  icon?: React.ReactNode;
  count?: number | string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const GridCard = React.forwardRef<View, GridCardProps>(
  (
    {
      title,
      icon,
      count,
      trend,
      trendValue,
      elevation = 'level1',
      padding = 12,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();

    const trendColor =
      trend === 'up'
        ? theme.colors.success
        : trend === 'down'
        ? theme.colors.error
        : theme.colors.textSecondary;

    return (
      <Card
        ref={ref}
        elevation={elevation}
        padding={padding}
        style={{ justifyContent: 'space-between' }}
        {...props}
      >
        {icon && <View style={{ marginBottom: 8 }}>{icon}</View>}
        
        {title && (
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textSecondary,
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {count && (
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: theme.colors.textPrimary,
              }}
            >
              {count}
            </Text>
          )}
          {trendValue && (
            <Text style={{ fontSize: 12, color: trendColor, fontWeight: '600' }}>
              {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}
              {trendValue}
            </Text>
          )}
        </View>
      </Card>
    );
  }
);

GridCard.displayName = 'GridCard';

// Add missing import
import { Text } from 'react-native';

export default Card;

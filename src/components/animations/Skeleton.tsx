/**
 * Skeleton Loading Component
 * Provides animated placeholder for content while loading
 * Uses shimmer effect and respects accessibility preferences
 */

import React, { useMemo } from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedStyle,
  useReducedMotionIsEnabled,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

const screenWidth = Dimensions.get('window').width;

export type SkeletonShape = 'circle' | 'rect' | 'text';

export interface SkeletonProps extends ViewProps {
  /** Shape of skeleton */
  shape?: SkeletonShape;
  /** Width in pixels or percentage string */
  width?: number | string;
  /** Height in pixels */
  height?: number;
  /** Border radius for rect shapes */
  borderRadius?: number;
  /** Enable shimmer animation */
  shimmer?: boolean;
  /** Shimmer duration in milliseconds */
  shimmerDuration?: number;
  /** Custom children for complex layouts */
  children?: React.ReactNode;
}

/**
 * Skeleton component - animated placeholder while content loads
 */
export const Skeleton = React.forwardRef<View, SkeletonProps>(
  (
    {
      shape = 'rect',
      width = '100%',
      height = 16,
      borderRadius = 8,
      shimmer = true,
      shimmerDuration = 1000,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const reducedMotion = useReducedMotionIsEnabled();

    const shimmerPosition = useSharedValue(0);

    // Setup shimmer animation
    React.useEffect(() => {
      if (shimmer && !reducedMotion) {
        shimmerPosition.value = withRepeat(
          withTiming(1, {
            duration: shimmerDuration,
            easing: Easing.linear,
          }),
          -1
        );
      }
    }, [shimmer, reducedMotion, shimmerDuration, shimmerPosition]);

    // Calculate width
    const calculatedWidth =
      typeof width === 'string' ? width : width;

    // Shimmer animation style
    const shimmerAnimatedStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
        shimmerPosition.value,
        [0, 1],
        [-screenWidth, screenWidth],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ translateX }],
        opacity: shimmer && !reducedMotion ? 0.5 : 0.3,
      };
    });

    // Base skeleton style
    const baseStyle: any = {
      width: calculatedWidth,
      height,
      backgroundColor: theme.colors.backgroundSecondary,
      overflow: 'hidden',
    };

    if (shape === 'circle') {
      baseStyle.borderRadius = height / 2;
    } else if (shape === 'rect') {
      baseStyle.borderRadius = borderRadius;
    } else if (shape === 'text') {
      baseStyle.borderRadius = 4;
    }

    if (children) {
      return (
        <View ref={ref} style={[baseStyle, style]} {...props}>
          {children}
        </View>
      );
    }

    return (
      <View
        ref={ref}
        style={[baseStyle, style]}
        {...props}
      >
        {shimmer && (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: theme.colors.overlay,
              },
              shimmerAnimatedStyle,
            ]}
          />
        )}
      </View>
    );
  }
);

Skeleton.displayName = 'Skeleton';

/**
 * Skeleton variants for common use cases
 */
export const skeletonVariants = {
  text: {
    shape: 'text' as const,
    height: 16,
    borderRadius: 4,
  },
  title: {
    shape: 'text' as const,
    height: 24,
    borderRadius: 4,
  },
  paragraph: (lines = 3) =>
    Array.from({ length: lines }).map((_, i) => ({
      shape: 'text' as const,
      height: 16,
      borderRadius: 4,
      marginBottom: i < lines - 1 ? 8 : 0,
    })),
  avatar: {
    shape: 'circle' as const,
    width: 48,
    height: 48,
  },
  card: {
    shape: 'rect' as const,
    height: 200,
    borderRadius: 12,
  },
};

/**
 * Skeleton group for loading multiple items
 */
export interface SkeletonGroupProps extends ViewProps {
  /** Number of items to show */
  count?: number;
  /** Height of each skeleton item */
  itemHeight?: number;
  /** Gap between items */
  gap?: number;
  /** Shape of items */
  shape?: SkeletonShape;
  /** Children render function */
  children?: (index: number) => React.ReactNode;
}

export const SkeletonGroup = React.forwardRef<View, SkeletonGroupProps>(
  (
    {
      count = 3,
      itemHeight = 60,
      gap = 12,
      shape = 'rect',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const items = Array.from({ length: count });

    return (
      <View ref={ref} style={style} {...props}>
        {items.map((_, index) => (
          <View
            key={index}
            style={
              index < items.length - 1 ? { marginBottom: gap } : undefined
            }
          >
            {children ? (
              children(index)
            ) : (
              <Skeleton shape={shape} height={itemHeight} />
            )}
          </View>
        ))}
      </View>
    );
  }
);

SkeletonGroup.displayName = 'SkeletonGroup';

/**
 * Skeleton for cards/grid items
 */
export interface SkeletonCardProps extends ViewProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  lineCount?: number;
}

export const SkeletonCard = React.forwardRef<View, SkeletonCardProps>(
  (
    {
      showAvatar = true,
      showTitle = true,
      lineCount = 2,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <View
        ref={ref}
        style={[
          {
            padding: 12,
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
          style,
        ]}
        {...props}
      >
        {showAvatar && (
          <View style={{ marginBottom: 12 }}>
            <Skeleton shape="circle" width={40} height={40} />
          </View>
        )}
        {showTitle && (
          <View style={{ marginBottom: 8 }}>
            <Skeleton shape="text" height={20} width="80%" />
          </View>
        )}
        <View>
          {Array.from({ length: lineCount }).map((_, i) => (
            <View key={i} style={{ marginBottom: i < lineCount - 1 ? 8 : 0 }}>
              <Skeleton
                shape="text"
                height={14}
                width={i === lineCount - 1 ? '60%' : '100%'}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }
);

SkeletonCard.displayName = 'SkeletonCard';

/**
 * Export as default for convenience
 */
export default Skeleton;

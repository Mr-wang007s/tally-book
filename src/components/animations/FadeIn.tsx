/**
 * FadeIn Animation Component
 * Provides fade-in animation on mount with customizable duration and delay
 * Respects prefers-reduced-motion for accessibility
 */

import React, { useMemo } from 'react';
import {
  View,
  ViewProps,
  AccessibilityInfo,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  useReducedMotionIsEnabled,
} from 'react-native-reanimated';

export interface FadeInProps extends ViewProps {
  /** Duration of fade-in animation in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Initial opacity (0-1) */
  initialOpacity?: number;
  /** Whether to respect prefers-reduced-motion */
  respectReducedMotion?: boolean;
  /** Custom children */
  children?: React.ReactNode;
}

/**
 * FadeIn component - animates children opacity from 0 to 1 on mount
 */
export const FadeInComponent = React.forwardRef<View, FadeInProps>(
  (
    {
      duration = 400,
      delay = 0,
      initialOpacity = 0,
      respectReducedMotion = true,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionIsEnabled();

    // Create fade-in animation configuration
    const fadeInAnimation = useMemo(
      () =>
        reducedMotion || !respectReducedMotion
          ? FadeIn.duration(0).delay(0) // Instant if reduced motion
          : FadeIn.duration(duration).delay(delay),
      [duration, delay, reducedMotion, respectReducedMotion]
    );

    return (
      <Animated.View
        ref={ref}
        entering={fadeInAnimation}
        style={[{ opacity: initialOpacity }, style]}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }
);

FadeInComponent.displayName = 'FadeIn';

/**
 * Predefined fade-in variants
 */
export const fadeInVariants = {
  fast: { duration: 200, delay: 0 },
  normal: { duration: 400, delay: 0 },
  slow: { duration: 600, delay: 0 },
  quickStagger: (index: number) => ({
    duration: 200,
    delay: index * 50,
  }),
  normalStagger: (index: number) => ({
    duration: 400,
    delay: index * 75,
  }),
  slowStagger: (index: number) => ({
    duration: 600,
    delay: index * 100,
  }),
};

/**
 * FadeIn wrapper for list items with stagger
 */
export interface FadeInListProps extends ViewProps {
  index: number;
  staggerDelay?: number;
  duration?: number;
  children?: React.ReactNode;
}

export const FadeInListItem = React.forwardRef<View, FadeInListProps>(
  (
    {
      index = 0,
      staggerDelay = 75,
      duration = 400,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <FadeInComponent
        ref={ref}
        duration={duration}
        delay={index * staggerDelay}
        style={style}
        {...props}
      >
        {children}
      </FadeInComponent>
    );
  }
);

FadeInListItem.displayName = 'FadeInListItem';

/**
 * Export as default for convenience
 */
export default FadeInComponent;

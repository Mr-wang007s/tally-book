/**
 * SlideIn Animation Component
 * Provides slide-in animation from any direction on mount
 * Respects prefers-reduced-motion for accessibility
 */

import React, { useMemo } from 'react';
import {
  View,
  ViewProps,
} from 'react-native';
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideInDown,
  useReducedMotionIsEnabled,
} from 'react-native-reanimated';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export interface SlideInProps extends ViewProps {
  /** Direction of slide animation */
  direction?: SlideDirection;
  /** Duration of animation in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Distance to slide from (in pixels) */
  distance?: number;
  /** Whether to respect prefers-reduced-motion */
  respectReducedMotion?: boolean;
  /** Custom children */
  children?: React.ReactNode;
}

/**
 * Map direction to Reanimated animation
 */
function getSlideAnimation(
  direction: SlideDirection,
  distance: number,
  duration: number,
  delay: number,
  reducedMotion: boolean
) {
  if (reducedMotion) {
    // Instant animation
    return SlideInDown.duration(0).delay(0);
  }

  const config = duration ? `.duration(${duration})` : '';
  const delayConfig = delay ? `.delay(${delay})` : '';

  switch (direction) {
    case 'left':
      return SlideInRight(distance)
        .duration(duration)
        .delay(delay);
    case 'right':
      return SlideInLeft(distance)
        .duration(duration)
        .delay(delay);
    case 'up':
      return SlideInDown(distance)
        .duration(duration)
        .delay(delay);
    case 'down':
      return SlideInUp(distance)
        .duration(duration)
        .delay(delay);
    default:
      return SlideInRight(distance)
        .duration(duration)
        .delay(delay);
  }
}

/**
 * SlideIn component - animates children sliding in from specified direction
 */
export const SlideInComponent = React.forwardRef<View, SlideInProps>(
  (
    {
      direction = 'right',
      duration = 400,
      delay = 0,
      distance = 100,
      respectReducedMotion = true,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionIsEnabled();

    const slideAnimation = useMemo(
      () =>
        getSlideAnimation(
          direction,
          distance,
          reducedMotion ? 0 : duration,
          reducedMotion ? 0 : delay,
          reducedMotion && respectReducedMotion
        ),
      [direction, distance, duration, delay, reducedMotion, respectReducedMotion]
    );

    return (
      <Animated.View
        ref={ref}
        entering={slideAnimation}
        style={style}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }
);

SlideInComponent.displayName = 'SlideIn';

/**
 * Predefined slide-in variants
 */
export const slideInVariants = {
  fromLeft: (duration = 400, delay = 0) => ({
    direction: 'left' as const,
    duration,
    delay,
    distance: 100,
  }),
  fromRight: (duration = 400, delay = 0) => ({
    direction: 'right' as const,
    duration,
    delay,
    distance: 100,
  }),
  fromTop: (duration = 400, delay = 0) => ({
    direction: 'up' as const,
    duration,
    delay,
    distance: 100,
  }),
  fromBottom: (duration = 400, delay = 0) => ({
    direction: 'down' as const,
    duration,
    delay,
    distance: 100,
  }),
  
  // Staggered variants
  leftStagger: (index: number, duration = 300) => ({
    direction: 'left' as const,
    duration,
    delay: index * 50,
    distance: 100,
  }),
  rightStagger: (index: number, duration = 300) => ({
    direction: 'right' as const,
    duration,
    delay: index * 50,
    distance: 100,
  }),
  bottomStagger: (index: number, duration = 300) => ({
    direction: 'down' as const,
    duration,
    delay: index * 50,
    distance: 100,
  }),
};

/**
 * SlideIn wrapper for list items with stagger
 */
export interface SlideInListProps extends ViewProps {
  index: number;
  direction?: SlideDirection;
  staggerDelay?: number;
  duration?: number;
  distance?: number;
  children?: React.ReactNode;
}

export const SlideInListItem = React.forwardRef<View, SlideInListProps>(
  (
    {
      index = 0,
      direction = 'right',
      staggerDelay = 75,
      duration = 300,
      distance = 100,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <SlideInComponent
        ref={ref}
        direction={direction}
        duration={duration}
        delay={index * staggerDelay}
        distance={distance}
        style={style}
        {...props}
      >
        {children}
      </SlideInComponent>
    );
  }
);

SlideInListItem.displayName = 'SlideInListItem';

/**
 * Export as default for convenience
 */
export default SlideInComponent;

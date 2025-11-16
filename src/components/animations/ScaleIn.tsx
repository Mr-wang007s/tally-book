/**
 * ScaleIn Animation Component
 * Provides scale/zoom animation on mount with optional rotation
 * Respects prefers-reduced-motion for accessibility
 */

import React, { useMemo } from 'react';
import {
  View,
  ViewProps,
} from 'react-native';
import Animated, {
  ScaleIn,
  useReducedMotionIsEnabled,
} from 'react-native-reanimated';

export interface ScaleInProps extends ViewProps {
  /** Duration of animation in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Initial scale value (0-1) */
  initialScale?: number;
  /** Whether to add rotation effect */
  withRotation?: boolean;
  /** Rotation angle in degrees */
  rotationAngle?: number;
  /** Whether to respect prefers-reduced-motion */
  respectReducedMotion?: boolean;
  /** Custom children */
  children?: React.ReactNode;
}

/**
 * ScaleIn component - animates children scaling from 0 to 1 on mount
 */
export const ScaleInComponent = React.forwardRef<View, ScaleInProps>(
  (
    {
      duration = 400,
      delay = 0,
      initialScale = 0,
      withRotation = false,
      rotationAngle = 180,
      respectReducedMotion = true,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionIsEnabled();

    // Create scale-in animation configuration
    const scaleAnimation = useMemo(() => {
      if (reducedMotion && respectReducedMotion) {
        return ScaleIn.duration(0).delay(0);
      }

      let animation = ScaleIn.duration(duration).delay(delay);

      if (withRotation) {
        animation = animation.rotate(rotationAngle);
      }

      return animation;
    }, [duration, delay, withRotation, rotationAngle, reducedMotion, respectReducedMotion]);

    return (
      <Animated.View
        ref={ref}
        entering={scaleAnimation}
        style={[{ transform: [{ scale: initialScale }] }, style]}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }
);

ScaleInComponent.displayName = 'ScaleIn';

/**
 * Predefined scale-in variants
 */
export const scaleInVariants = {
  small: { duration: 300, delay: 0, initialScale: 0.8 },
  medium: { duration: 400, delay: 0, initialScale: 0.5 },
  large: { duration: 500, delay: 0, initialScale: 0.2 },
  
  withRotation: {
    fast: { duration: 300, delay: 0, withRotation: true, rotationAngle: 180 },
    normal: { duration: 400, delay: 0, withRotation: true, rotationAngle: 360 },
    slow: { duration: 600, delay: 0, withRotation: true, rotationAngle: 720 },
  },

  // Stagger variants
  quickStagger: (index: number) => ({
    duration: 300,
    delay: index * 50,
    initialScale: 0.5,
  }),
  normalStagger: (index: number) => ({
    duration: 400,
    delay: index * 75,
    initialScale: 0.5,
  }),
  slowStagger: (index: number) => ({
    duration: 600,
    delay: index * 100,
    initialScale: 0.2,
  }),
};

/**
 * ScaleIn wrapper for list items with stagger
 */
export interface ScaleInListProps extends ViewProps {
  index: number;
  staggerDelay?: number;
  duration?: number;
  initialScale?: number;
  withRotation?: boolean;
  children?: React.ReactNode;
}

export const ScaleInListItem = React.forwardRef<View, ScaleInListProps>(
  (
    {
      index = 0,
      staggerDelay = 75,
      duration = 400,
      initialScale = 0.5,
      withRotation = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <ScaleInComponent
        ref={ref}
        duration={duration}
        delay={index * staggerDelay}
        initialScale={initialScale}
        withRotation={withRotation}
        style={style}
        {...props}
      >
        {children}
      </ScaleInComponent>
    );
  }
);

ScaleInListItem.displayName = 'ScaleInListItem';

/**
 * Bouncy scale-in variant (combines scale with spring)
 */
export interface BounceScaleInProps extends ViewProps {
  duration?: number;
  delay?: number;
  bounceFactor?: number; // Higher = more bounce
  children?: React.ReactNode;
}

export const BounceScaleIn = React.forwardRef<View, BounceScaleInProps>(
  (
    {
      duration = 600,
      delay = 0,
      bounceFactor = 1.2,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Custom animation with overshoot using scale
    const bounceAnimation = useMemo(
      () => ScaleIn.duration(duration).delay(delay),
      [duration, delay]
    );

    return (
      <Animated.View
        ref={ref}
        entering={bounceAnimation}
        style={[{ transform: [{ scale: 0 }] }, style]}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }
);

BounceScaleIn.displayName = 'BounceScaleIn';

/**
 * Export as default for convenience
 */
export default ScaleInComponent;

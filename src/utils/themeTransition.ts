/**
 * Theme Transition Utilities
 * Provides smooth animated transitions when switching themes
 * Respects prefers-reduced-motion accessibility preference
 */

import { useRef, useCallback } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { AccessibilityInfo } from 'react-native';

export const THEME_TRANSITION_DURATION = 300;

/**
 * Animation configuration for theme transitions
 */
export const themeTransitionConfig = {
  duration: THEME_TRANSITION_DURATION,
  easing: Easing.inOut(Easing.cubic),
};

/**
 * Respects prefers-reduced-motion by returning instant or slow transition
 */
export async function getTransitionDuration(
  respectReducedMotion = true
): Promise<number> {
  if (!respectReducedMotion) {
    return THEME_TRANSITION_DURATION;
  }

  try {
    const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    // If screen reader is on, also respect reduced motion
    if (isScreenReaderEnabled) {
      return 0; // Instant transition
    }
  } catch (error) {
    // Continue with default if accessibility check fails
  }

  return THEME_TRANSITION_DURATION;
}

/**
 * Hook for animating color values during theme transitions
 */
export function useThemeTransitionAnimation(
  fromColor: string,
  toColor: string,
  shouldAnimate = true
) {
  const progress = useSharedValue(0);
  const animatedColor = Animated.interpolateColor(
    progress,
    [0, 1],
    [fromColor, toColor]
  );

  const startTransition = useCallback(async () => {
    const duration = shouldAnimate
      ? await getTransitionDuration(true)
      : 0;

    progress.value = withTiming(1, {
      duration,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [progress, shouldAnimate]);

  const resetTransition = useCallback(() => {
    progress.value = 0;
  }, [progress]);

  return {
    animatedColor,
    startTransition,
    resetTransition,
    progress,
  };
}

/**
 * Calculate transition speed based on animation preferences
 */
export function getAnimationSpeed(reducedMotion: boolean): number {
  // 0 = instant, 1 = normal, slower = slowed down
  return reducedMotion ? 0 : 1;
}

/**
 * Transition configuration factory
 */
export function createTransitionConfig(reducedMotion: boolean) {
  return {
    duration: reducedMotion ? 0 : THEME_TRANSITION_DURATION,
    easing: Easing.inOut(Easing.cubic),
    useNativeDriver: true,
  };
}

/**
 * Batch multiple theme transitions
 */
export function batchThemeTransitions(
  transitions: Array<{
    from: string;
    to: string;
    onStart?: () => void;
    onComplete?: () => void;
  }>,
  reducedMotion: boolean
) {
  const duration = reducedMotion ? 0 : THEME_TRANSITION_DURATION;
  const easing = Easing.inOut(Easing.cubic);

  return transitions.map((transition) => ({
    ...transition,
    config: { duration, easing },
  }));
}

/**
 * Generate interpolation values for color transitions
 */
export function generateColorInterpolation(
  inputRange: number[],
  outputColors: string[]
) {
  return {
    inputRange,
    outputColors,
  };
}

/**
 * Theme change event with transition data
 */
export interface ThemeChangeEvent {
  from: 'light' | 'dark';
  to: 'light' | 'dark';
  timestamp: number;
  duration: number;
  animated: boolean;
}

/**
 * Track theme transitions for analytics/logging
 */
export class ThemeTransitionTracker {
  private transitions: ThemeChangeEvent[] = [];
  private maxHistory = 50;

  recordTransition(event: ThemeChangeEvent): void {
    this.transitions.push(event);
    if (this.transitions.length > this.maxHistory) {
      this.transitions.shift();
    }
  }

  getHistory(): ThemeChangeEvent[] {
    return [...this.transitions];
  }

  getStats() {
    if (this.transitions.length === 0) {
      return null;
    }

    const animatedCount = this.transitions.filter((t) => t.animated).length;
    const avgDuration =
      this.transitions.reduce((sum, t) => sum + t.duration, 0) /
      this.transitions.length;

    return {
      totalTransitions: this.transitions.length,
      animatedTransitions: animatedCount,
      averageDuration: avgDuration,
    };
  }

  clear(): void {
    this.transitions = [];
  }
}

/**
 * Singleton instance for tracking
 */
export const themeTransitionTracker = new ThemeTransitionTracker();

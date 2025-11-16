/**
 * Animation Helper Utilities
 * Common animation helpers for reusable animation patterns
 * Works with react-native-reanimated for high-performance animations
 */

import Animated, {
  Easing,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';

/**
 * Normalize a value from one range to another
 * Used for mapping scroll position to animation values
 */
export function normalizeRange(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number = 0,
  outputMax: number = 1
): number {
  const normalized = (value - inputMin) / (inputMax - inputMin);
  return outputMin + normalized * (outputMax - outputMin);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

/**
 * Interpolate between two animation values with extrapolation
 */
export function interpolateValue(
  progress: Animated.Adaptable<number>,
  inputRange: number[],
  outputRange: number[],
  extrapolate: Extrapolate = Extrapolate.CLAMP
): Animated.Node<number> {
  return interpolate(progress, inputRange, outputRange, extrapolate);
}

/**
 * Create spring animation configuration
 */
export interface SpringConfig {
  damping: number;
  mass: number;
  stiffness: number;
  overshootClamping?: boolean;
  restSpeedThreshold?: number;
  restDisplacementThreshold?: number;
}

export const springPresets = {
  default: {
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
  snappy: {
    damping: 12,
    mass: 0.8,
    stiffness: 200,
  },
  bouncy: {
    damping: 8,
    mass: 1.2,
    stiffness: 100,
  },
  smooth: {
    damping: 20,
    mass: 1,
    stiffness: 100,
  },
  gentle: {
    damping: 25,
    mass: 1,
    stiffness: 50,
  },
};

/**
 * Easing function presets
 */
export const easingPresets = {
  linear: Easing.linear,
  ease: Easing.ease,
  inQuad: Easing.quad,
  outQuad: Easing.out(Easing.quad),
  inOutQuad: Easing.inOut(Easing.quad),
  inCubic: Easing.cubic,
  outCubic: Easing.out(Easing.cubic),
  inOutCubic: Easing.inOut(Easing.cubic),
  inQuart: Easing.poly(4),
  outQuart: Easing.out(Easing.poly(4)),
  inOutQuart: Easing.inOut(Easing.poly(4)),
  inExpo: Easing.exp,
  outExpo: Easing.out(Easing.exp),
  inOutExpo: Easing.inOut(Easing.exp),
  inCirc: Easing.circle,
  outCirc: Easing.out(Easing.circle),
  inOutCirc: Easing.inOut(Easing.circle),
};

/**
 * Timing configuration for common animations
 */
export const timingConfigs = {
  instant: {
    duration: 0,
  },
  snappy: {
    duration: 200,
    easing: Easing.inOut(Easing.cubic),
  },
  quick: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  },
  normal: {
    duration: 400,
    easing: Easing.inOut(Easing.cubic),
  },
  slow: {
    duration: 600,
    easing: Easing.out(Easing.quad),
  },
  verySlow: {
    duration: 1000,
    easing: Easing.linear,
  },
};

/**
 * Calculate animation duration based on distance
 * Ensures consistent animation speeds
 */
export function calculateDurationFromDistance(
  distance: number,
  speed = 1
): number {
  // ~1 unit per 3ms at speed=1
  return Math.max(0, distance * 3 / speed);
}

/**
 * Create a loop animation configuration
 */
export function createLoopAnimation(
  duration: number,
  easing: (value: number) => number = Easing.linear
) {
  return {
    duration,
    easing,
    loop: true,
  };
}

/**
 * Stagger animation delays for multiple items
 */
export function createStaggerDelays(
  itemCount: number,
  baseDelay: number = 0,
  staggerDelay: number = 50
): number[] {
  return Array.from({ length: itemCount }, (_, i) => baseDelay + i * staggerDelay);
}

/**
 * Calculate stagger delay for an item
 */
export function getStaggerDelay(
  index: number,
  baseDelay: number = 0,
  staggerDelay: number = 50
): number {
  return baseDelay + index * staggerDelay;
}

/**
 * Animation timing presets for different scenarios
 */
export const animationTimings = {
  // UI feedback animations
  tap: { duration: 150, easing: Easing.inOut(Easing.cubic) },
  press: { duration: 200, easing: Easing.inOut(Easing.cubic) },
  release: { duration: 300, easing: Easing.out(Easing.cubic) },

  // Entrance animations
  enterFromBottom: { duration: 400, easing: Easing.out(Easing.cubic) },
  enterFromTop: { duration: 400, easing: Easing.out(Easing.cubic) },
  enterFromLeft: { duration: 400, easing: Easing.out(Easing.cubic) },
  enterFromRight: { duration: 400, easing: Easing.out(Easing.cubic) },
  fadeIn: { duration: 300, easing: Easing.out(Easing.quad) },
  scaleIn: { duration: 300, easing: Easing.out(Easing.back(1.2)) },

  // Exit animations
  exitToBottom: { duration: 300, easing: Easing.in(Easing.cubic) },
  exitToTop: { duration: 300, easing: Easing.in(Easing.cubic) },
  exitToLeft: { duration: 300, easing: Easing.in(Easing.cubic) },
  exitToRight: { duration: 300, easing: Easing.in(Easing.cubic) },
  fadeOut: { duration: 200, easing: Easing.in(Easing.quad) },
  scaleOut: { duration: 200, easing: Easing.in(Easing.back(1.2)) },

  // Transitions
  screenTransition: { duration: 400, easing: Easing.out(Easing.cubic) },
  modalPresent: { duration: 300, easing: Easing.out(Easing.cubic) },
  modalDismiss: { duration: 250, easing: Easing.in(Easing.cubic) },

  // Micro interactions
  micro: { duration: 100, easing: Easing.linear },
  feedback: { duration: 150, easing: Easing.inOut(Easing.cubic) },
  snappy: { duration: 200, easing: Easing.out(Easing.cubic) },
};

/**
 * Transform animations object to percentage-based progress
 */
export function transformProgress(
  progress: Animated.Adaptable<number>,
  from: number,
  to: number
): Animated.Node<number> {
  return interpolate(progress, [0, 1], [from, to], Extrapolate.CLAMP);
}

/**
 * Create delay function for sequential animations
 */
export function createDelayedAnimation(baseDelay: number) {
  return (index: number, itemDelay: number = 50) => {
    return baseDelay + index * itemDelay;
  };
}

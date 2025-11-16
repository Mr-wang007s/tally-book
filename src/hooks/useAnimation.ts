/**
 * useAnimation Hook
 * Provides animation utilities respecting reduced motion preferences
 */

import { useContext } from 'react';
import { springConfigs, durations, easingCurves, colorTransitions } from '@/theme/animations';

interface UseAnimationOptions {
  respectMotion?: boolean;
}

/**
 * Hook for animation configurations
 */
export function useAnimation(options: UseAnimationOptions = {}) {
  const { respectMotion = false } = options;

  return {
    // Spring configs
    springs: {
      gentle: springConfigs.gentle,
      default: springConfigs.default,
      snappy: springConfigs.snappy,
      bouncy: springConfigs.bouncy,
      stiff: springConfigs.stiff,
    },

    // Durations
    durations: {
      instant: durations.instant,
      fast: durations.fast,
      normal: durations.normal,
      slow: durations.slow,
      deliberate: durations.deliberate,
    },

    // Easing curves
    easings: {
      easeInOut: easingCurves.standard,
      easeOut: easingCurves.decelerate,
      easeIn: easingCurves.accelerate,
      linear: easingCurves.linear,
      smooth: easingCurves.smooth,
      sharp: easingCurves.sharp,
    },

    // Color transitions
    colorTransitions: {
      fast: respectMotion ? { duration: 0 } : colorTransitions.fast,
      smooth: respectMotion ? { duration: 0 } : colorTransitions.smooth,
      gradual: respectMotion ? { duration: 0 } : colorTransitions.gradual,
    },

    // Helper to get duration respecting motion
    getDuration: (key: keyof typeof durations): number => {
      return respectMotion ? 0 : durations[key];
    },

    // Helper to get spring config respecting motion
    getSpring: (key: keyof typeof springConfigs) => {
      return respectMotion ? { damping: 100, stiffness: 100, mass: 1 } : springConfigs[key];
    },
  };
}

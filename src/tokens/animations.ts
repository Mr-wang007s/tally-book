/**
 * Design Tokens: Animations
 * 
 * Animation timing functions and spring physics configurations.
 * Based on iOS UIKit and React Native Reanimated 3.
 * 
 * @module src/tokens/animations
 * @see https://docs.swmansion.com/react-native-reanimated/
 * @see https://developer.apple.com/design/human-interface-guidelines/animation
 */

/**
 * Spring animation configurations
 * Each preset matches iOS UIKit spring behavior
 */
export const springs = {
  /**
   * Gentle spring for large movements (page transitions)
   * Slow, smooth, with some bounce
   * Duration: ~800ms
   */
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 1,
    overshootClamping: false,
  } as const,

  /**
   * Default spring for UI elements (buttons, cards)
   * Balanced between responsiveness and comfort
   * Duration: ~500ms
   * ** MOST COMMON **
   */
  default: {
    damping: 15,
    stiffness: 150,
    mass: 1,
    overshootClamping: false,
  } as const,

  /**
   * Snappy spring for small movements (toggles, checkboxes)
   * Quick and responsive with minimal bounce
   * Duration: ~350ms
   */
  snappy: {
    damping: 12,
    stiffness: 200,
    mass: 0.8,
    overshootClamping: false,
  } as const,

  /**
   * Bouncy spring for playful interactions (success states)
   * Lively with noticeable bounce
   * Duration: ~600ms
   */
  bouncy: {
    damping: 10,
    stiffness: 100,
    mass: 1,
    overshootClamping: false,
  } as const,

  /**
   * Stiff spring for snappy, immediate feedback
   * Very fast with no bounce
   * Duration: ~250ms
   */
  stiff: {
    damping: 18,
    stiffness: 300,
    mass: 0.8,
    overshootClamping: true,
  } as const,

  /**
   * Slow spring for careful, deliberate movements
   * Very smooth with generous bounce
   * Duration: ~1000ms
   */
  slow: {
    damping: 25,
    stiffness: 80,
    mass: 1.2,
    overshootClamping: false,
  } as const,
} as const;

/**
 * Animation duration presets (milliseconds)
 * Used for timing-based animations and delays
 */
export const durations = {
  /**
   * 100ms - Micro-interactions
   * Use for: Haptic feedback timing, very quick state changes
   */
  instant: 100,

  /**
   * 200ms - State changes
   * Use for: Toggle animations, checkbox selection, quick feedback
   */
  fast: 200,

  /**
   * 300ms - Transitions
   * Use for: Modal open/close, card flip, normal interactions
   * ** MOST COMMON **
   */
  normal: 300,

  /**
   * 500ms - Page transitions
   * Use for: Screen navigation, sheet entrance, major layout changes
   */
  slow: 500,

  /**
   * 800ms - Deliberate animations
   * Use for: Count-up animations, tutorial animations, special effects
   */
  deliberate: 800,
} as const;

/**
 * Animation delay presets (milliseconds)
 * Used for staggered animations and timing
 */
export const animationDelays = {
  none: 0,
  micro: 50,       // Very short delay
  short: 100,      // Short delay between elements
  standard: 150,   // Standard stagger delay
  medium: 200,     // Medium delay
  long: 300,       // Long delay
  veryLong: 500,   // Very long delay
} as const;

/**
 * Easing functions (CSS cubic-bezier equivalents)
 * Used for timing-based animations
 */
export const easings = {
  /**
   * Standard Material Design easing (ease-in-out)
   * Natural, balanced feel
   */
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',

  /**
   * Deceleration (ease-out)
   * Starts fast, slows down (exit animations)
   */
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',

  /**
   * Acceleration (ease-in)
   * Starts slow, speeds up (entrance animations)
   */
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',

  /**
   * Linear easing
   * Constant speed (use sparingly, often feels unnatural)
   */
  linear: 'cubic-bezier(0, 0, 1, 1)',

  /**
   * iOS standard easing
   * Smooth, elegant
   */
  iosStandard: 'cubic-bezier(0.33, 0.66, 0.66, 1)',

  /**
   * Bounce easing (simplified)
   * Used for playful animations
   */
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

/**
 * Component-specific animation presets
 * Pre-configured animation sets for common components
 */
export const componentAnimations = {
  // Button animations
  button: {
    press: {
      duration: durations.fast,
      spring: springs.snappy,
    },
    ripple: {
      duration: durations.normal,
      easing: easings.easeOut,
    },
  },

  // Card animations
  card: {
    enter: {
      duration: durations.normal,
      spring: springs.default,
      delay: animationDelays.none,
    },
    tap: {
      duration: durations.fast,
      spring: springs.snappy,
    },
  },

  // Modal animations
  modal: {
    enter: {
      duration: durations.normal,
      spring: springs.gentle,
    },
    exit: {
      duration: durations.fast,
      easing: easings.easeIn,
    },
  },

  // Bottom sheet animations
  sheet: {
    enter: {
      duration: durations.slow,
      spring: springs.gentle,
    },
    exit: {
      duration: durations.fast,
      spring: springs.stiff,
    },
    snap: {
      duration: durations.normal,
      spring: springs.snappy,
    },
  },

  // Floating action button
  fab: {
    appear: {
      duration: durations.slow,
      spring: springs.bouncy,
    },
    press: {
      duration: durations.fast,
      spring: springs.snappy,
    },
  },

  // Loading animations
  loading: {
    spin: {
      duration: 1000,  // Full rotation
      easing: easings.linear,
      loop: true,
    },
    skeleton: {
      duration: 1500,
      easing: easings.easeInOut,
      loop: true,
    },
  },

  // Success animations
  success: {
    checkmark: {
      duration: durations.slow,
      spring: springs.bouncy,
    },
  },

  // List animations
  list: {
    itemEnter: {
      duration: durations.normal,
      spring: springs.default,
    },
    itemStagger: animationDelays.short,
    swipeDelete: {
      duration: durations.fast,
      spring: springs.snappy,
    },
  },

  // Transition animations
  transition: {
    screenEnter: {
      duration: durations.slow,
      spring: springs.gentle,
    },
    screenExit: {
      duration: durations.normal,
      easing: easings.easeIn,
    },
    tabSwitch: {
      duration: durations.normal,
      spring: springs.default,
    },
  },

  // Form animations
  form: {
    fieldShake: {
      duration: durations.normal,
      easing: easings.bounce,
    },
    errorAppear: {
      duration: durations.fast,
      spring: springs.snappy,
    },
  },
} as const;

/**
 * Haptic feedback timing
 * Coordinated with visual animations
 */
export const hapticTiming = {
  /**
   * Light tap - instant feedback
   * Timing: Immediately on interaction
   */
  lightTap: {
    delay: 0,
    duration: 10,  // Very short (haptics are brief)
  },

  /**
   * Medium feedback - coordinated with action
   * Timing: At peak of animation or immediately
   */
  mediumFeedback: {
    delay: 0,
    duration: 20,
  },

  /**
   * Success feedback - after action completes
   * Timing: At end of submit animation
   */
  successFeedback: {
    delay: durations.normal - 50,  // Slightly before animation ends
    duration: 30,
  },

  /**
   * Error feedback - error state visible
   * Timing: Immediately when error appears
   */
  errorFeedback: {
    delay: 0,
    duration: 50,  // Longer for error emphasis
  },

  /**
   * Warning feedback - warning appears
   * Timing: When warning becomes visible
   */
  warningFeedback: {
    delay: durations.fast,
    duration: 30,
  },
} as const;

/**
 * Reduced motion alternatives
 * Used when prefers-reduced-motion is enabled
 */
export const reducedMotionAnimations = {
  /**
   * No animation - instant transition
   */
  none: {
    duration: 0,
  },

  /**
   * Very fast transition - minimal motion
   */
  fast: {
    duration: durations.instant,
  },

  /**
   * Fade only - directional motion removed
   */
  fadeOnly: {
    duration: durations.fast,
    easing: easings.easeInOut,
  },
} as const;

/**
 * Stagger animations for lists and grids
 * Creates sequential entrance effects
 */
export const staggerAnimations = {
  /**
   * Gentle stagger - slow, smooth entrance
   * Use for: Important content, onboarding
   */
  gentle: {
    itemDelay: animationDelays.standard,
    springConfig: springs.gentle,
    duration: durations.slow,
  },

  /**
   * Standard stagger - balanced
   * Use for: Most lists, grids
   */
  standard: {
    itemDelay: animationDelays.short,
    springConfig: springs.default,
    duration: durations.normal,
  },

  /**
   * Quick stagger - fast entrance
   * Use for: Navigation, quick transitions
   */
  quick: {
    itemDelay: animationDelays.micro,
    springConfig: springs.snappy,
    duration: durations.fast,
  },

  /**
   * Wave stagger - flowing entrance
   * Use for: Special effects, demos
   */
  wave: {
    itemDelay: animationDelays.medium,
    springConfig: springs.bouncy,
    duration: durations.slow,
  },
} as const;

/**
 * Gesture-based animations
 * Timing for interactive gestures
 */
export const gestureAnimations = {
  /**
   * Swipe gesture
   */
  swipe: {
    duration: durations.normal,
    spring: springs.snappy,
  },

  /**
   * Drag and drop
   */
  dragDrop: {
    duration: durations.normal,
    spring: springs.default,
  },

  /**
   * Scroll/pan
   */
  scroll: {
    duration: durations.normal,
    spring: springs.stiff,
  },

  /**
   * Pinch/zoom
   */
  pinch: {
    duration: durations.normal,
    spring: springs.default,
  },

  /**
   * Long press
   */
  longPress: {
    duration: 500,  // Long press threshold typically 500ms
    spring: springs.bouncy,
  },
} as const;

/**
 * Type-safe spring key
 */
export type SpringKey = keyof typeof springs;

/**
 * Type-safe duration key
 */
export type DurationKey = keyof typeof durations;

/**
 * Get spring configuration by key
 * 
 * @example
 * const springConfig = getSpring('default');
 */
export function getSpring(key: SpringKey) {
  return springs[key];
}

/**
 * Get duration by key (in milliseconds)
 * 
 * @example
 * const ms = getDuration('normal'); // 300
 */
export function getDuration(key: DurationKey): number {
  return durations[key];
}

/**
 * Create custom spring configuration
 * 
 * @example
 * const custom = createSpring(15, 150, 1, false);
 */
export function createSpring(
  damping: number,
  stiffness: number,
  mass?: number,
  overshootClamping?: boolean
) {
  return {
    damping,
    stiffness,
    mass: mass ?? 1,
    overshootClamping: overshootClamping ?? false,
  } as const;
}

/**
 * Create staggered delay sequence
 * 
 * @example
 * const delays = createStaggerDelays(5, 100); // [0, 100, 200, 300, 400]
 */
export function createStaggerDelays(
  count: number,
  delayBetween: number
): number[] {
  return Array.from({ length: count }, (_, i) => i * delayBetween);
}

/**
 * Animation timing guidelines
 * 
 * - < 100ms: Instant feedback, micro-interactions
 * - 100-300ms: Standard UI animations
 * - 300-500ms: Important transitions, navigation
 * - 500ms+: Attention-grabbing, special animations
 * 
 * Spring physics:
 * - High stiffness + low damping = Bouncy, energetic
 * - Low stiffness + high damping = Slow, smooth
 * - Use springs for natural, responsive feel
 * - Use easing curves for mechanical precision
 */

/**
 * Animation System - iOS 18 Inspired
 * Spring configs, timing curves, color transitions
 */

/**
 * Spring animation configurations
 * Matched to iOS UIView.animate spring behavior
 */
export const springConfigs = {
  // Gentle spring for large movements (page transitions)
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 1,
    overshootClamping: false,
  },
  
  // Default spring for UI elements (buttons, cards)
  default: {
    damping: 15,
    stiffness: 150,
    mass: 1,
    overshootClamping: false,
  },
  
  // Snappy spring for small movements (toggles, checkboxes)
  snappy: {
    damping: 12,
    stiffness: 200,
    mass: 0.8,
    overshootClamping: false,
  },
  
  // Bouncy spring for playful interactions (success states)
  bouncy: {
    damping: 10,
    stiffness: 100,
    mass: 1,
    overshootClamping: false,
  },
  
  // Stiff spring for precise animations (focus states)
  stiff: {
    damping: 25,
    stiffness: 250,
    mass: 1,
    overshootClamping: true,
  },
};

/**
 * Animation duration presets
 */
export const durations = {
  instant: 100,      // Micro-interactions (haptic, ripple)
  fast: 200,         // State changes (toggle, checkbox)
  normal: 300,       // Transitions (modal open, card flip)
  slow: 500,         // Page transitions (screen navigation)
  deliberate: 800,   // Count-up animations, special effects
};

/**
 * Easing curves for non-spring animations
 */
export const easings = {
  // Material Design standard
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  // Deceleration
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  // Acceleration
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  // Constant speed
  linear: 'cubic-bezier(0, 0, 1, 1)',
  // Anticipation and release
  anticipate: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // Smooth back
  backOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

/**
 * Color transition animations
 * Used for theme switching and state changes
 */
export const colorTransitions = {
  // Fast theme switch (perceived instant, actually 300ms)
  fast: {
    duration: 300,
    timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
  
  // Smooth theme transition with more noticeable animation
  smooth: {
    duration: 500,
    timingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  // Gradual fade for accent color changes
  gradual: {
    duration: 800,
    timingFunction: 'cubic-bezier(0.33, 0.66, 0.66, 1)',
  },
};

/**
 * Animation presets for common interactions
 */
export const animationPresets = {
  // Button press animation
  buttonPress: {
    duration: durations.fast,
    config: springConfigs.snappy,
    scale: 0.95,
  },
  
  // Card tap ripple
  cardTap: {
    duration: durations.fast,
    scale: 0.98,
    opacity: 0.8,
  },
  
  // Modal entrance
  modalEnter: {
    duration: durations.slow,
    config: springConfigs.gentle,
    translateY: 600,
  },
  
  // FAB expansion
  fabExpand: {
    duration: durations.normal,
    config: springConfigs.default,
    scale: 0,
  },
  
  // List item stagger delay
  listItemStagger: 50,
  
  // Count-up animation duration
  countUp: durations.deliberate,
};

/**
 * Gesture-based animation configs
 */
export const gestureAnimations = {
  // Swipe to dismiss
  swipeDismiss: {
    duration: durations.normal,
    config: springConfigs.snappy,
  },
  
  // Pan to expand
  panExpand: {
    tension: 100,
    friction: 8,
  },
  
  // Long press effect
  longPress: {
    duration: durations.fast,
    config: springConfigs.snappy,
  },
};

/**
 * Reduced motion alternatives
 * Instant, no animation versions for accessibility
 */
export const reducedMotion = {
  instant: {
    duration: 0,
    timingFunction: 'linear',
  },
};

/**
 * Utility to get animation config with motion preference
 */
export function getAnimationConfig(
  preset: keyof typeof springConfigs,
  respectMotion: boolean = false
) {
  if (respectMotion) {
    return reducedMotion.instant;
  }
  return springConfigs[preset];
}

/**
 * Utility to get color transition with motion preference
 */
export function getColorTransition(
  speed: keyof typeof colorTransitions,
  respectMotion: boolean = false
) {
  if (respectMotion) {
    return { duration: 0, timingFunction: 'linear' };
  }
  return colorTransitions[speed];
}

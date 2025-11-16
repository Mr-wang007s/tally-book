/**
 * Haptic Feedback Taxonomy
 * Standardized haptic patterns for consistent interaction feedback
 */

import { HapticStyle, NotificationType } from '@/services/haptics';

/**
 * Haptic feedback mappings for UI interactions
 */
export const hapticPatterns = {
  // Light tap for subtle feedback
  lightTap: 'light' as HapticStyle,
  
  // Standard button press
  buttonPress: 'medium' as HapticStyle,
  
  // Heavy confirmation
  heavyConfirm: 'heavy' as HapticStyle,
  
  // Success notification (transaction created, save complete)
  success: 'success' as NotificationType,
  
  // Warning notification (validation error, caution)
  warning: 'warning' as NotificationType,
  
  // Error notification (failed action, critical error)
  error: 'error' as NotificationType,
};

/**
 * Haptic feedback for specific interactions
 */
export const interactionHaptics = {
  // Button and control feedback
  button: {
    press: hapticPatterns.buttonPress,
    longPress: [hapticPatterns.lightTap, hapticPatterns.lightTap],
    disabled: hapticPatterns.lightTap,
  },

  // Form interactions
  form: {
    fieldFocus: hapticPatterns.lightTap,
    fieldError: hapticPatterns.warning,
    fieldSuccess: hapticPatterns.success,
    submit: hapticPatterns.buttonPress,
  },

  // Transaction operations
  transaction: {
    create: hapticPatterns.success,
    edit: hapticPatterns.buttonPress,
    delete: hapticPatterns.heavyConfirm,
    undo: hapticPatterns.lightTap,
  },

  // Navigation
  navigation: {
    tabSwitch: hapticPatterns.lightTap,
    screenTransition: hapticPatterns.lightTap,
    backGesture: hapticPatterns.lightTap,
  },

  // Gestures
  gesture: {
    swipe: hapticPatterns.lightTap,
    drag: hapticPatterns.lightTap,
    release: hapticPatterns.lightTap,
    longPress: hapticPatterns.buttonPress,
  },

  // System feedback
  system: {
    unlock: hapticPatterns.success,
    notification: hapticPatterns.buttonPress,
    error: hapticPatterns.error,
    warning: hapticPatterns.warning,
  },

  // Animation triggers
  animation: {
    start: hapticPatterns.lightTap,
    complete: hapticPatterns.lightTap,
    bounce: hapticPatterns.lightTap,
  },
};

/**
 * Haptic intensity levels
 */
export const hapticIntensity = {
  subtle: 'light' as HapticStyle,
  standard: 'medium' as HapticStyle,
  strong: 'heavy' as HapticStyle,
};

/**
 * Haptic pattern sequences for special events
 */
export const hapticSequences = {
  // Success pattern (light, light, medium)
  success: ['light', 'light', 'medium'] as HapticStyle[],
  
  // Error pattern (heavy, medium, heavy)
  error: ['heavy', 'medium', 'heavy'] as HapticStyle[],
  
  // Warning pattern (medium, medium)
  warning: ['medium', 'medium'] as HapticStyle[],
  
  // Loading/progress (light repeating)
  loading: ['light', 'light', 'light', 'light'] as HapticStyle[],
  
  // Celebration (varied pattern)
  celebration: ['light', 'medium', 'light', 'heavy', 'light', 'medium'] as HapticStyle[],
};

/**
 * Get haptic for interaction type
 */
export function getHapticForInteraction(
  category: keyof typeof interactionHaptics,
  action: string
): HapticStyle | HapticStyle[] | undefined {
  const categoryMap = interactionHaptics[category];
  if (categoryMap && action in categoryMap) {
    return categoryMap[action as keyof typeof categoryMap];
  }
  return undefined;
}
